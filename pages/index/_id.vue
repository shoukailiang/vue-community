<template>
  <!-- 文章列表 -->
  <div id="list-container">
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
    <el-row class="page" type="flex" justify="center">
      <el-button v-if="noMore || articleList.length === 0" type="primary" disabled class="loadmore-button">
        没有更多了……
      </el-button>
      <el-button
        v-else
        @click="load"
        :loading="loading"
        type="primary"
        size="medium"
        round
        class="loadmore-button"
      >
        {{ loading ? "加载中……" : "点击加载更多" }}
      </el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false, // 加载中
      noMore: false, // 没有更多了
    };
  },
  methods: {
    async load() {
      // 加载中
      this.loading = true;
      //	将 页 码 加 1 
      this.query.current++
      const { data } = await this.$getArticleList(this.query);
      // 有数据
      if (data.records && data.records.length > 0) {
        // 合并新旧数据返回
        this.articleList = this.articleList.concat(data.records);
      } else {
        // 没有数据了
        this.noMore = true;
      }
      // 加载完
      this.loading = false;
    },
  },

  // 校验路由参数合法性
  validate({ params }) {
    const id = params.id ? params.id : 0; // 在首页推荐的时候，是没有id传入的，即0值查询推荐的
    // 必须是数值
    // 必须是number类型
    return /^\d+$/.test(id);
  },

  async asyncData({ params, app }) {
    // 分类id，为空则查询推荐
    const categoryId = params.id ? params.id : null;

    // 获取文章列表
    const query = { categoryId, current: 1, size: 8 };
    const { data } = await app.$getArticleList(query);
    return { query, articleList: data.records };
  },
};
</script>

<style>
/* 此处补要用 scoped，因为要被引入 index.vue 中 */
@import "@/assets/css/article/list.css";
.loadmore-button{
  margin-bottom: 40px;
}
</style>