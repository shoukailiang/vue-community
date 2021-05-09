<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/label' }">标签</el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: $route.path, query: { name: $route.query.name } }"
      >
        {{ $route.query.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>标签动态</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="label-tab">
      <el-tabs value="question" type="card" @tab-click="handleClick">
        <el-tab-pane label="技术问答" name="question">
          <question-list
            name="question"
            :page="page"
            :listData="questionList"
            @fetch-data="fetchData"
          />
        </el-tab-pane>
        <el-tab-pane label="博客文章" name="article">
          <article-list
            name="article"
            :page="page"
            :listData="articleList"
            @fetch-data="fetchData"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<script>
import QuestionList from "@/components/question/List";
import ArticleList from "@/components/article/List";

export default {
  components: { QuestionList, ArticleList },

  // 校验标签id
  validate({ params }) {
    return /^\d+$/.test(params.id);
  },

  data() {
    return {
      articleList: [], 
    };
  },

  methods: {
    handleClick(tab) {
      // 切换标签页查询对应第1页的数据
      this.fetchData(tab.paneName, 1);
    },

    // 切换页码时查询（标签页的名字，当前页码）
    async fetchData(paneName, current) {
      this.page.current = current;
      let response = null;
      switch (paneName) {
        case "question":
          // 查询技术问答列表
          const query2 = { ...this.page, labelId: this.$route.params.id };
          response = await this.$getQuestionByLableId(query2);
          
          this.page.total = response.data.total;
          this.questionList = response.data.records;
          break;
        case "article":
          // 封装标签id,和分页对象{current: 1, size: 20, total: 0, labelId: 10}
          const query = { ...this.page, labelId: this.$route.params.id };
          response = await this.$getArticleList(query);
          this.page.total = response.data.total;
          this.articleList = response.data.records;
          break;
        default:
          break;
      }
    },
  },

  async asyncData({ params, app }) {
    const page = {
      current: 1,
      size: 8,
      total: 0,
    };
    const query = { ...page, labelId: params.id };
    const { data } = await app.$getQuestionByLableId(query);
    page.total = data.total;

    return { page, questionList: data.records };
  },
};
</script>
<style scoped>
.label-tab {
  margin-top: 30px;
}
</style>