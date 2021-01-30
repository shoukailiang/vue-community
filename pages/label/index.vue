<template>
  <div class="label-main">
    <el-row :gutter="10">
      <el-col
        v-for="category in data"
        :key="category.id"
        :xs="24"
        :sm="24"
        :md="6"
      >
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <!-- 分类名 -->
            <span>{{ category.name }}</span>
          </div>
          <!-- 分类下的标签 -->
          <div>
            <nuxt-link
              :to="{ path: `/label/${label.id}`, query: { name: label.name } }"
              v-for="label in category.labelList"
              :key="label.id"
            >
              <el-tag size="small">{{ label.name }}</el-tag>
            </nuxt-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  async asyncData({ app }) {
    // 查询分类和标签
    const { data } = await app.$getCategoryAndLabel();
    // console.log(data)
    return { data };
  },
};
</script>
<style scoped>
.label-main {
  margin: 0 10px;
}
.el-col {
  margin-bottom: 20px;
}
.el-tag {
  margin-right: 5px;
}
.el-tag:hover {
  border-bottom: 1px solid #f45154;
}
.el-card {
  height: 200px;
}
</style>