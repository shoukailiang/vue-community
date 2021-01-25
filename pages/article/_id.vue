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
                  <i class="el-icon-date"></i> {{ data.updateDate }}
                  <i class="el-icon-thumb"></i> {{ data.thumhup }}
                  <i class="el-icon-view"></i> {{ data.viewCount }}
                </span>
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
            <el-button icon="el-icon-thumb" type="primary" size="medium" plain
              >赞
            </el-button>
          </el-card>
          <!-- 评 论 区 -->
          <div>
            <h2>评论区</h2>
            <el-card> </el-card>
          </div>
        </div>
      </el-col>
      <el-col class="hidden-sm-and-down" :md="6"> 11 </el-col>
    </el-row>
  </div>
</template>
<script>
// 高亮显示md内容样式
import "@/assets/css/md/github-markdown.css";
import "@/assets/css/md/github-min.css";

export default {
  // 校验路由参数
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

    return { data }; //等价于 {data: data}
  },
};
</script>
<style scoped>
@import "@/assets/css/article/article.css";
</style>