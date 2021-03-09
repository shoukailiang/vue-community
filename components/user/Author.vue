<template>
  <section id="author">
    <el-card class="" shadow="never">
      <div slot="header">
        <span class="has-text-weight-bold">👨‍💻 关于作者</span>
      </div>
      {{ user.nickName }}
      <el-row>
        <el-button
          :disabled="!$store.state.userInfo"
          :plain="!isFocus"
          @click="handleFocus"
          type="primary"
          size="medium"
          >关注
        </el-button>
      </el-row>
    </el-card>
  </section>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
    },
  },
  methods:{
    async handleFocus() {

    }
  },
  data(){
    return{
      isFocus:false
    }
  }
};
</script>

<style scoped>
</style>