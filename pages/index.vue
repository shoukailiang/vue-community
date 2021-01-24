<template>
  <div class="container">
    <el-button type="primary">主要按钮</el-button>
    <div v-for="i in 10000" :key="i">
      <span>{{i}}</span>
    </div>
  </div>
</template>

<script>

export default {
  async asyncData({$axios}) {
    const ttt=  await $axios.$get('/test')
    console.log(ttt)
  },

}
</script>

<style>

</style>
