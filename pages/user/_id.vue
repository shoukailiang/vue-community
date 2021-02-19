<template>
  <div>
    <!-- 个人信息 -->
    <el-row class="main-top">
      <div class="avatar">
        <el-tooltip content="点击上传头像" effect="light">
          <el-upload accept="image/*" action="" :show-file-list="false">
            <el-avatar :size="120" :src="this.userInfo.imageUrl">{{
              userInfo.nickName
            }}</el-avatar>
          </el-upload>
        </el-tooltip>
      </div>
      <div class="info">
        <div>
          <span class="meta-block">&nbsp;&nbsp;&nbsp;昵称：</span>
          <span class="name">{{ userInfo.nickName }}</span>
        </div>
        <div>
          <span class="meta-block">用户名：</span>
          <span class="name">{{ userInfo.username }}</span>
        </div>
      </div>
    </el-row>
    <el-row>
      <el-tabs value="public" @tab-click="handleClick">
        <el-tab-pane label="公开文章" name="public">
          <article-list
            name="public"
            :page="query"
            :listData="articleList"
            @fetch-data="findUserArticleList"
          />
        </el-tab-pane>

        <el-tab-pane label="我的提问" name="question">
          <question-list
            name="question"
            :page="query"
            :listData="questionList"
            @fetch-data="findUserQuestionList"
          />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>
<script>
import ArticleList from "@/components/article/List";
import QuestionList from "@/components/question/List";

export default {
  components: { QuestionList, ArticleList },
  data() {
    return {
      loading: false,
      userInfo: {
        imageUrl: "",
      },
      questionList: [], // 提问列表
      userId: "",
    };
  },
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id);
  },

  methods: {
    // 查询我的提问列表（
    async findUserQuestionList(paneName, current) {
      // 当前查询页码
      this.query.current = current;
      // 将isPlulic 删除
      delete this.query.isPublic;

      const { data } = await this.$findUserQuestion(this.query);

      // 总记录数
      this.query.total = data.total;
      // 提问列表数据
      this.questionList = data.records;
    },

    // 查询用户的文章列表
    async findUserArticleList(paneName, current) {
      this.query.current = current;
      // 1 公开 ，0未公开
      this.query.isPublic = paneName === "public" ? 1 : 0;
      // 发送分页查询请求
      const { data } = await this.$findUserArticle(this.query);
      // 总记录数
      this.query.total = data.total;
      // 列表数据
      this.articleList = data.records;
    },

    // 切换标签页
    handleClick(tab, event) {
      switch (tab.paneName) {
        case "public":
          // 公开
          this.findUserArticleList(tab.paneName, 1);
          break;
        case "nopublic":
          // 私密
          this.findUserArticleList(tab.paneName, 1);
          break;
        case "question":
          this.findUserQuestionList(tab.paneName, 1);
          break;
        case "user":
          // 用户不用查询，在加载此页面时已经查询了
          break;
      }
    },
  },

  async asyncData({ app, store, params }) {
    // 1. 查询用户信息
    const userId = params.id;
    const { data: userInfo } = await app.$getUserInfo(userId);

    // 2. 查询公开文章列表
    const query = {
      current: 1,
      size: 20,
      total: 0,
      isPublic: 1, // 1.公开，0.未公开
      userId,
    };
    const { data } = await app.$findUserArticle(query);
    query.total = data.total;
    return { userInfo, query, articleList: data.records };
  },
};
</script>
<style scoped>
.main-top {
  padding: 30px 0;
}
.avatar {
  float: left;
}
.info {
  margin: 30px 0 0 140px;
}
.info .name {
  font-size: 18px;
  font-weight: 500;
  padding-top: 10px;
}
.info .meta-block {
  font-size: 14px;
  color: #969696;
}
</style>