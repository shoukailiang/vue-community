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
                  {{ data.updateDate|getDateFormat }}
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
            <el-button
              :disabled="!$store.state.userInfo"
              @click="handleThumb"
              :plain="!isThumb"
              icon="el-icon-thumb"
              type="primary"
              size="medium"
              class="zan"
              >赞
            </el-button>
          </el-card>
          <!-- 评 论 区 -->
          <div>
            <h2>评论区</h2>
            <!-- 未登录 -->
            <el-card v-if="!$store.state.userInfo">
              <h4>
                请登录
              </h4>
              <div>
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
        <my-affix :offset="480" style="padding-top: 20px">
          <!--作者-->
          <Author
            :user="data"
            v-if="
              $store.state.userInfo && $store.state.userInfo.uid !== data.userId
            "
          />
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
import MyAffix from "@/components/common/Affix";
import MyDirectory from "@/components/common/Directory";
import MyComment from "@/components/common/Comment";

import Author from "@/components/user/Author";

export default {
  components: { MyAffix, MyDirectory, MyComment, Author },
  data() {
    return {
      // 是否已点赞
      isThumb: this.$store.state.userInfo
        ? this.$cookies.get(
            `article-thumb-${this.$route.params.id}-${this.$store.state.userInfo.uid}`
          )
          ? this.$cookies.get(
              `article-thumb-${this.$route.params.id}-${this.$store.state.userInfo.uid}`
            )
          : false
        : false,
      userId: this.$store.state.userInfo && this.$store.state.userInfo.uid,
      userImage:
        this.$store.state.userInfo && this.$store.state.userInfo.imageUrl,
    };
  },

  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id);
  },
  head() {
    return {
      title: this.data.title, // 浏览器显示的标题
    };
  },
  async asyncData({ params, app }) {
    const { data } = await app.$getArticleById(params.id);

    // 浏览器页面关闭后，删除cookie
    const isView = app.$cookies.get(`article-view-${data.id}`);
    // 没有值，则更新浏览数
    if (!isView) {
      const { code } = await app.$updateArticleViewCount(data.id);
      if (code === 20000) {
        data.viewCount++;
      }
      app.$cookies.set(`article-view-${data.id}`, true);
    }

    // 通过文章id查询所有评论列表信息
    const { data: commentList } = await app.$getCommentListByArticleId(
      params.id
    );
    return { data, commentList };
  },
  methods: {

    async handleThumb() {
      this.isThumb = !this.isThumb;
      // 1. 点赞，-1取消赞
      const count = this.isThumb ? 1 : -1;
      const articleId = this.$route.params.id;
      const { code } = await this.$updateArticleThumb(articleId, count);
      if (code === 20000) {
        this.data.thumhup = this.data.thumhup + count;
        this.$cookies.set(
          `article-thumb-${this.$route.params.id}-${this.$store.state.userInfo.uid}`,
          this.isThumb,
          {
            maxAge: 60 * 60 * 24 * 365 * 5, // 保存5年
          }
        );
      }
    },
    // 公布评论
    doSend(content) {
      this.doChildSend(content);
    },
    // 发布回复评论（回复内容，父评论id)
    // -1 表示没有父评论
    doChildSend(content, parentId = "-1") {
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
          this.refreshComment();
        }
      });
    },

    async doRemove(id) {
      const { code } = await this.$deleteCommentById(id);
      if (code === 20000) {
        // 删除成功，刷新评论
        this.refreshComment();
      }
    },

    // 查询评论列表数据
    async refreshComment() {
      const { data } = await this.$getCommentListByArticleId(
        this.$route.params.id
      );
      this.commentList = data;
    },
  },
  filters:{
    getDateFormat(date) {
      return dateFormat(date);
    },
  }
};
</script>
<style scoped>
@import "@/assets/css/article/article.css";
.zan {
  margin-top: 20px;
}
</style>