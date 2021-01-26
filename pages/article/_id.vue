<template>
  <div>
    <el-row type="flex">
      <el-col :md="18" :xs="24" :sm="24">
        <div class="article-left">
          <el-card>
            <!-- 标 题 -->
            <div class="article-title">
              <h1>{{ data.title }}</h1>
              <div class="article-count">
                <nuxt-link
                  :to="'/user/' + data.userId"
                  target="_blank"
                  class="nickname"
                >
                  <i class="el-icon-user-solid"></i> {{ data.nickName }}
                </nuxt-link>
                <span>
                  <i class="el-icon-date"></i>
                  {{ getDateFormat(data.updateDate) }}
                  <i class="el-icon-thumb"></i> {{ data.thumhup }}
                  <i class="el-icon-view"></i> {{ data.viewCount }}
                </span>

                <!-- 只能自己编辑自己的 -->
                <nuxt-link
                  v-if="
                    $store.state.userInfo &&
                    $store.state.userInfo.uid === data.userId
                  "
                  :to="{ path: '/article/edit', query: { id: data.id } }"
                  class="nickname"
                >
                  &nbsp;&nbsp; 编 辑
                </nuxt-link>
              </div>
              <!-- 加 style="margin: 5px;" 不然会紧密连接在一起 -->
              <el-tag
                style="margin: 5px"
                v-for="item in data.labelList"
                :key="item.id"
                size="small"
              >
                {{ item.name }}
              </el-tag>
            </div>
            <!-- 内 容 -->
            <div class="article-content">
              <!-- 1. 加上样式，2 使用 v-html 渲染 -->
              <div class="markdown-body" v-html="data.htmlContent"></div>
            </div>
            <!-- plain为true为深色，false不是深色 -->
            <el-button
              :disabled="!$store.state.userInfo"
              @click="handleThumb"
              :plain="!isThumb"
              icon="el-icon-thumb"
              type="primary"
              size="medium"
              >赞
            </el-button>
          </el-card>
          <!-- 评 论 区 -->
          <div>
            <h2>评论区</h2>
            <!-- 未登录 -->
            <el-card v-if="!$store.state.userInfo">
              <h4>
                登录后参与交流、获取后续更新提醒 {{ $store.state.userInfo }}
              </h4>
              <div>
                <!-- 不要以 / 开头，LoginPage -->
                <el-button
                  @click="$store.dispatch('LoginPage')"
                  type="primary"
                  size="small"
                >
                  登录</el-button
                >
                <el-button
                  @click="$store.dispatch('LoginPage')"
                  type="primary"
                  size="small"
                  plain
                >
                  注册</el-button
                >
              </div>
            </el-card>
            <el-card>
              <!-- userId 当前登录用户id，userImage 当前登录用户头像，showComment 显示评论区
                doSend 公共评论事件函数，doChidSend 回复评论事件函数, doRemove 删除 -->
              <my-comment
                :userId="userId"
                :userImage="userImage"
                :authorId="data.userId"
                :showComment="$store.state.userInfo ? true : false"
                @doSend="doSend"
                @doChildSend="doChildSend"
                @doRemove="doRemove"
                :commentList="commentList"
              >
              </my-comment>
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col class="hidden-sm-and-down" :md="6">
        <!-- 固钉距离 80px -->
        <my-affix :offset="80">
          <!-- parentClass 指定文章内容的父元素class值 -->
          <my-directory parentClass="article-content"></my-directory>
        </my-affix>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 高亮显示md内容样式
import "@/assets/css/md/github-markdown.css";
import "@/assets/css/md/github-min.css";
import { dateFormat } from "@/utils/date";
// 固 钉
import MyAffix from "@/components/common/Affix";
// 生成文章导航目录
import MyDirectory from "@/components/common/Directory";
// 评论组件
import MyComment from "@/components/common/Comment";

export default {
  components: { MyAffix, MyDirectory, MyComment },
  data() {
    return {
      // 是否已点赞
      isThumb: this.$cookies.get(`article-thumb-${this.$route.params.id}`)
        ? this.$cookies.get(`article-thumb-${this.$route.params.id}`)
        : false,
      // 当前登录用户id
      userId: this.$store.state.userInfo && this.$store.state.userInfo.uid,
      // 当前登录用户头像，
      userImage:
        this.$store.state.userInfo && this.$store.state.userInfo.imageUrl,
    };
  },

  // 校验路由参数 http://localhost:3000/article/12
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id);
  },
  head() {
    return {
      title: this.data.title, // 浏览器显示的标题
    };
  },
  // 获取数据
  async asyncData({ params, app }) {
    // 查询文章详情
    const { data } = await app.$getArticleById(params.id);

    // 更新浏览数，判断 Cookie 中是否已经存在，防止无限刷自己浏览数
    // 浏览器页面关闭后，删除cookie
    const isView = app.$cookies.get(`article-view-${data.id}`);
    // 没有值，则更新浏览数
    if (!isView) {
      const { code } = await app.$updateArticleViewCount(data.id);
      if (code === 20000) {
        // 更新后页面上+1浏览数，省得再查询
        data.viewCount++;
      }
      // 保存到cookie中，关闭浏览器后删除
      app.$cookies.set(`article-view-${data.id}`, true);
    }

    // 通过文章id查询所有评论列表信息
    const { data: commentList } = await app.$getCommentListByArticleId(
      params.id
    );
    return { data, commentList };
  },
  methods: {
    getDateFormat(date) {
      return dateFormat(date);
    },
    // 点赞
    async handleThumb() {
      // 取消点赞或者点赞
      this.isThumb = !this.isThumb;
      // 1. 点赞，-1取消赞
      const count = this.isThumb ? 1 : -1;
      // 获取文章
      const articleId = this.$route.params.id;
      const { code } = await this.$updateArticleThumb(articleId, count);
      if (code === 20000) {
        // 更新下当前文章页面显示的点赞数
        this.data.thumhup = this.data.thumhup + count;
        // 保存cookie，永久保存
        this.$cookies.set(
          `article-thumb-${this.$route.params.id}`,
          this.isThumb,
          {
            maxAge: 60 * 60 * 24 * 365 * 5, // 保存5年
          }
        );
      }
    },
    // 公布评论
    doSend(content) {
      // console.log("公布评论", content);
      this.doChildSend(content);
    },
    // 发布回复评论（回复内容，父评论id)
    // -1 表示没有父评论
    doChildSend(content, parentId = "-1") {
      // console.log("发布回复评论（回复内容，父评论id", content, parentId);
      const data = {
        content,
        parentId,
        articleId: this.$route.params.id,
        userId: this.userId,
        userImage: this.userImage,
        nickName:
          this.$store.state.userInfo && this.$store.state.userInfo.nickName,
      };
      this.$addComment(data).then((response) => {
        // 新增评论成功
        if (response.code === 20000) {
          // 刷新评论信息
          this.refreshComment();
        }
      });
    },

    // 删除
    async doRemove(id) {
      const { code } = await this.$deleteCommentById(id);
      if (code === 20000) {
        // 删除成功，刷新评论
        this.refreshComment();
      }
    },

    // 查询评论列表数据
    async refreshComment() {
      // console.log("refreshComment");
      const { data } = await this.$getCommentListByArticleId(
        this.$route.params.id
      );
      this.commentList = data;
    },
  },
};
</script>
<style scoped>
@import "@/assets/css/article/article.css";
</style>