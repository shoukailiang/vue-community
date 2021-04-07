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
        >
          {{ this.isFocus ? "已关注" : "关注" }}
        </el-button>
      </el-row>
    </el-card>
  </section>
</template>

<script>
export default {
  async created() {
    var focusData = {
      name: 111,
    };
    focusData.userId = this.$store.state.userInfo
      ? this.$store.state.userInfo.uid
      : "";
    focusData.focusId = this.user ? this.user.userId : "";
    if (this.$store.state.userInfo) {
      const { data } = await this.$isFocus(focusData);
      if (data) {
        this.isFocus = true;
      } else {
        this.isFocus = false;
      }
    }
  },
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      isFocus: false,
      isFocusData: "",
    };
  },
  methods: {
    async handleFocus() {
      var focusData = {
        name: 111,
      };
      // 取消关注或者关注
      this.isFocus = !this.isFocus;
      focusData.userId = this.$store.state.userInfo
        ? this.$store.state.userInfo.uid
        : "";
        console.log(this.user)
      focusData.focusId = this.user ? this.user.userId : "";
      const { code } = await this.$focusUser(focusData);
      if (code === 20000) {
        console.log("关注成功");
      }
    },
  },
};
</script>

<style scoped>
</style>