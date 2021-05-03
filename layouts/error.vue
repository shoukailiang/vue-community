<template>
  <div>
    <h1 v-if="error.statusCode===404">
        页面飘走了，你看看是否输错了呢
    </h1>
    <h1 v-else>接口请求失败</h1>
  </div>
</template>

<script>
export default {
  props:['error']
}
</script>