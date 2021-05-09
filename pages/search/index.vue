<template>
  <!-- 文章列表 -->
  <div id="list-container">
    <div slot="header" class="clearfix">
      检索到 <code>{{ articleList.length }}</code> 条关于
      <code class="has-text-info">{{ query.title }}</code> 的记录
    </div>
    <el-divider></el-divider>
    <ul class="note-list">
      <!-- 无 主 图 -->
      <li
        :class="{ 'have-img': item.imageUrl }"
        v-for="item in articleList"
        :key="item.id"
      >
        <div class="content">
          <nuxt-link :to="`/article/${item.id}`" >
            <p class="title">{{ item.title }}</p>
            <p class="abstract">
              {{ item.summary }}
            </p>
          </nuxt-link>
          <div class="meta">
            <nuxt-link
              :to="`/user/${item.userId}`"
              target="_blank"
              class="nickname"
            >
              <i class="el-icon-user-solid"></i> {{ item.nickName }}
            </nuxt-link>
            <span> <i class="el-icon-thumb"></i> {{ item.thumhup }} </span>
            <span> <i class="el-icon-view"></i> {{ item.viewCount }} </span>
          </div>
          <div v-if="item.imageUrl">
            <!-- 图 片 -->
            <nuxt-link
              :to="`/article/${item.id}`"
              class="wrap-img"
              target="_blank"
            >
              <img :src="item.imageUrl" />
            </nuxt-link>
          </div>
        </div>
      </li>
    </ul>
    <!-- 分 页 -->
    <el-row class="page" type="flex" justify="center"> </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        current: this.$route.query.current,
        size: this.$route.query.size,
        title: this.$route.query.title,
      },
      articleList: {},
    };
  },
  methods: {
    async getArticleList() {
      this.query.current = this.$route.query.current;
      this.query.size = this.$route.query.size;
      this.query.title = this.$route.query.title;
      const { data } = await this.$searchArticle(this.query);
      this.articleList = data.records;
    },
  },
  watch: {
    $route(to, from) {
      this.getArticleList();
    },
  },

  validate({ params }) {
    const id = params.id ? params.id : 0; // 在首页推荐的时候，是没有id传入的，即0值查询推荐的
    // 必须是数值
    // 必须是number类型
    return /^\d+$/.test(id);
  },

  async asyncData({ params, app, route }) {
    // 获取文章列表
    const query = {
      current: route.query.current,
      size: route.query.size,
      title: route.query.title,
    };
    const { data } = await app.$searchArticle(query);
    return { query, articleList: data.records };
  },
};
</script>

<style>
/* 此处补要用 scoped，因为要被引入 index.vue 中 */
@import "@/assets/css/article/list.css";
code {
  background-color: whitesmoke;
  color: #da1039;
  font-size: 0.875em;
  font-weight: normal;
  padding: 0.25em 0.5em 0.25em;
}
</style>