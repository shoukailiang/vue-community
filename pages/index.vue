<template>
  <div>
    <el-row>
      <div class="banner">
        <el-carousel height="230px"  type="card">
          <el-carousel-item v-for="item in mainAdvertList" :key="item.id">
            <a :href="item.advertUrl" :target="item.advertTarget">
              <img :src="item.imageUrl" />
            </a>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-row>
    <el-row type="flex" justify="space-between">
      <!-- 左侧 -->
      <el-col class="hidden-sm-and-down" :md="3">
        <el-divider content-position="left">技术分类</el-divider>
        <el-menu :default-active="$route.path" router active-text-color="#fff">
          <el-menu-item index="/">推荐</el-menu-item>
          <el-menu-item
            v-for="item in categoryList"
            :key="item.id"
            :index="'/' + item.id"
          >
            {{ item.name }}
          </el-menu-item>
        </el-menu>
      </el-col>
      <!-- 中间 -->
      <el-col :md="16">
        <div class="article-center">
          <!-- 文章列表 -->
          <nuxt-child />
        </div>
      </el-col>
      <!-- 右侧广告区 -->
      <el-col class="hidden-sm-and-down" :md="5">
        <el-divider>热门文章</el-divider>
        <el-table
          class="label-list"
          :show-header="false"
          :data="hotArticleList"
          style="width: 100%"
        >
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column>
            <template slot-scope="scope" width="100">
              <span class="title">
                <nuxt-link :to="'/article/' + scope.row.id" target="_blank">
                  {{ scope.row.title }}
                </nuxt-link>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-card
          class="right-card"
          shadow="hover"
          :body-style="{ padding: '10px' }"
        >
          <p>经典推荐</p>
          <el-carousel height="210px">
            <el-carousel-item v-for="item in courseAdvertList" :key="item.id">
              <a :href="item.advertUrl" :target="item.advertTarget">
                <img :src="item.imageUrl" />
                <span>{{ item.title }}</span>
              </a>
            </el-carousel-item>
          </el-carousel>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  async asyncData({ app }) {
    // 左侧分类  data取别名 categoryList
    const { data: categoryList } = await app.$getCategoryList();
    // 上方，位置position=1
    const { data: mainAdvertList } = await app.$getAdvertList(1);
    // 右侧，位置position=2
    const { data: courseAdvertList } = await app.$getAdvertList(2);
    // 简 写 { categoryList: categoryList }
    const { data: hotArticleList } = await app.$hotArticleList();
    return { categoryList, mainAdvertList, courseAdvertList, hotArticleList };
  },
};
</script>

<style scoped>
@import "@/assets/css/article/index.css";

.label-list {
  margin-bottom: 20px;
}
.article-label:hover {
  background: #f45154;
}
.banner .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .banner .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .banner .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
