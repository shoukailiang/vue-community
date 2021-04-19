<template>
  <div>
    <!-- 左（上下）右  -->
    <el-row type="flex">
      <el-col :md="18" :xs="24" :sm="24">
        <div class="article-left">
          <el-card>
            <!-- 标题 -->
            <div class="article-title">
              <h1>{{ data.title }}</h1>
              <div class="article-count">
                <nuxt-link
                  :to="`/user/${data.userId}`"
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
                <nuxt-link
                  v-if="
                    $store.state.userInfo &&
                    $store.state.userInfo.uid === data.userId
                  "
                  :to="{ path: '/question/edit', query: { id: data.id } }"
                  class="nickname"
                >
                  &nbsp; &nbsp; 编辑
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
            <!-- 文章内容 -->
            <div class="article-content">
              <div class="markdown-body" v-html="data.htmlContent"></div>
            </div>
            <!-- plain为true，背景不是深蓝色，为false是深蓝色 -->
            <el-button
              :disabled="!$store.state.userInfo"
              @click="handleThumb"
              icon="el-icon-thumb"
              type="primary"
              size="medium"
              :plain="!isThumb"
              class="zan"
            >
              赞
            </el-button>
          </el-card>
          <div>
            <h2>精彩回答</h2>
            <el-card v-if="!commentList || commentList.length === 0">
              暂无回答
            </el-card>
            <!-- 每个回答，是一个card.[comment] 是将对象转化成数组 -->
            <el-card v-else v-for="comment in commentList" :key="comment.id">
              <my-comment
                :showComment="false"
                :commentList="[comment]"
                :userId="userId"
                :userImage="userImage"
                :authorId="data.userId"
                @doChildSend="doChildSend"
                @doRemove="doRemove"
              >
              </my-comment>
            </el-card>
          </div>
          <div>
            <h2>编写回答</h2>
            <el-card v-if="!$store.state.userInfo">
              <h4>登录后参与交流、获取后续更新提醒</h4>
              <div>
                <el-button
                  @click="$store.dispatch('LoginPage')"
                  type="primary"
                  size="small"
                  >登录</el-button
                >
                <el-button
                  @click="$store.dispatch('LoginPage')"
                  type="primary"
                  size="small"
                  plain
                  >注册</el-button
                >
              </div>
            </el-card>
            <!-- markdown编辑器，提交回答内容 -->
            <div v-else>
              <!-- 
                                ref 就是唯一标识，相关于id
                                v-model 绑定的markdown输入 框的内容
                            -->
              <mavon-editor
                :autofocus="false"
                ref="md"
                v-model="mdContent"
                @change="getMdHtml"
                @imgAdd="uploadContentImg"
                @imgDel="delConentImg"
              />
              <el-row style="margin-top: 20px" type="flex" justify="center">
                <el-button type="primary" @click="submitReplay">
                  提交问答
                </el-button>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="hidden-sm-and-down" :md="6">
        <el-row>
          <el-col>
            <my-affix :offset="80">
              <my-directory parentClass="article-content"></my-directory>
            </my-affix>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 高度显示样式
import "@/assets/css/md/github-markdown.css";
import "@/assets/css/md/github-min.css";

import { dateFormat } from "@/utils/date.js";
import MyAffix from "@/components/common/Affix/index.vue";
import MyDirectory from "@/components/common/Directory/index.vue";
import MyComment from "@/components/common/Comment";
export default {
  components: { MyAffix, MyDirectory, MyComment },

  // 校验id为数值才可访问此组件
  validate({ params }) {
    return /^\d+$/.test(params.id);
  },

  head() {
    return {
      title: this.data.title, // 浏览器中的标题
    };
  },

  data() {
    return {
      // 是否点赞
      isThumb: this.$store.state.userInfo
        ? this.$cookies.get(
            `question-thumb-${this.$route.params.id}-${this.$store.state.userInfo.uid}`
          ) || false
        : false,
      //    当前登录用户id
      userId: this.$store.state.userInfo && this.$store.state.userInfo.uid,
      //    当前登录用户头像url
      userImage:
        this.$store.state.userInfo && this.$store.state.userInfo.imageUrl,
      //    commentList: []
      mdContent: "", // 回答内容 md格式
      htmlContent: "", // 回答内容 html格式
    };
  },

  methods: {
    getDateFormat(date) {
      return dateFormat(date);
    },

    //点赞
    async handleThumb() {
      // 取消点赞或者点赞
      this.isThumb = !this.isThumb;
      // 1. 点赞，-1取消赞
      const count = this.isThumb ? 1 : -1;
      // 获取问题id
      const questionId = this.$route.params.id;
      const { code } = await this.$updateQuestionThumb(questionId, count);
      if (code === 20000) {
        // 更新下当前问题页面显示的点赞数
        this.data.thumhup = this.data.thumhup + count;
        // 保存cookie，永久保存
        this.$cookies.set(
          `question-thumb-${this.$route.params.id}-${this.$store.state.userInfo.uid}`,
          this.isThumb,
          {
            maxAge: 60 * 60 * 24 * 365 * 5, // 保存5年
          }
        );
      }
    },

    // 发布回复评论（回复内容，父评论id)
    doChildSend(htmlContent, parentId = "-1", mdContent = "") {
      // console.log('发布回复评论（回复内容，父评论id', content, parentId)
      const data = {
        htmlContent, // 存放回复信息，回答中的md格式内容也是传到这个属性中
        mdContent, // md格式内容
        parentId,
        questionId: this.$route.params.id,
        userId: this.userId,
        userImage: this.userImage,
        nickName:
          this.$store.state.userInfo && this.$store.state.userInfo.nickName,
      };
      this.$addReplay(data).then((response) => {
        // 新增评论成功
        if (response.code === 20000) {
          // 刷新评论信息
          this.refreshReplay();
        }
      });
    },

    async doRemove(id) {
      //    console.log(id, 'xxxxx')
      const { code } = await this.$deleteReplayById(id);
      if (code === 20000) {
        // 删除成功，刷新评论
        this.refreshReplay();
      }
    },

    // 查询评论列表数据
    async refreshReplay() {
      //    console.log('refreshReplay')
      const { data } = await this.$getReplayByQuestionById(
        this.$route.params.id
      );
      this.commentList = data;
      this.mdContent = "";
    },

    // 获取问答输入框的内容
    getMdHtml(mdContent, htmlContent) {
      this.mdContent = mdContent;
      this.htmlContent = htmlContent;
    },

    // 上传回答内容图片（图片位置编号，File对象）
    uploadContentImg(pos, file) {
      // 封装表单数据
      const fd = new FormData();
      fd.append("file", file);

      this.$uploadImg(fd).then((response) => {
        if (response.code === 20000) {
          // 上传成功，回显，
          this.$refs.md.$img2Url(pos, response.data);
          this.$message.success("上传成功");
        }
      });
    },

    // 删除回答内容图片
    delConentImg(urlAndFileArr) {
      const fileUrl = urlAndFileArr[0]; //图片url
      const file = urlAndFileArr[1]; //File对象
      // 删除内容图片
      this.$deleteImg(fileUrl);
    },

    // 提交回答
    submitReplay() {
      if (this.htmlContent) {
        // 发送回答信息
        this.doChildSend(this.htmlContent, -1, this.mdContent);
      } else {
        this.$message.error("请输入回答内容");
      }
    },
  },

  async asyncData({ params, app }) {
    // 1. 查询问题详情
    const { data } = await app.$getQuestionById(params.id);

    // 2. 更新问题浏览数
    const isView = app.$cookies.get(`question-view-${params.id}`);
    if (!isView) {
      // 没有值 ，可以更新浏览数
      const { code } = await app.$updateQuestionViewCount(params.id);
      console.log(code);
      if (code === 20000) {
        // 将此问题浏览数+1
        data.viewCount++;
        // 保存cookie中, 关闭浏览器后会被删除
        app.$cookies.set(`question-view-${params.id}`, true);
      }
    }
    // 通过问题id查询所有回答列表信息
    const { data: commentList } = await app.$getReplayByQuestionById(params.id);
    return { data, commentList };
  },
};
</script>

<style scoped>
@import "@/assets/css/article/article.css";
.zan {
  margin-top: 20px;
}
</style>