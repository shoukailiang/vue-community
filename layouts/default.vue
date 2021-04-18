<template>
  <div class="container">
    <!-- 头部 -->
    <my-header />
    <!-- 主体 -->
    <div class="main">
      <nuxt />
    </div>
    <!-- <my-footer></my-footer> -->
    <!-- 底部 -->
    <!-- 回到顶部 -->
    <el-backtop :bottom="80"></el-backtop>
  </div>
</template>

<script>
import MyHeader from "@/components/layout/Header";
import MyFooter from "@/components/layout/Footer";
export default {
  components: {
    MyHeader,
    MyFooter,
  },
};
</script>

<style scoped>
.main {
  padding-top: 90px;
  max-width: 1140px;
  margin: 0 auto;
}
</style>
