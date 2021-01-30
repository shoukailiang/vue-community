<template>
  <div class="header header-fixed">
    <div class="nav">
      <el-row type="flex" justify="space-between">
        <!-- Logo， 任意宽度都是占4格-->
        <el-col class="logo" :xs="4" :sm="4" :md="4">
          <!-- Logo -->
          <nuxt-link to="/"
            ><img src="~/assets/images/logo.png" height="40px"
          /></nuxt-link>
        </el-col>
        <!-- 导航菜单， 手机与平板坚屏都占0格，也就是隐藏，其他10格-->
        <!-- <el-col :xs="0" :sm="0" :md="10"> 不行，隐藏后放大不显示 -->
        <el-col class="hidden-sm-and-down" :md="10">
          <!-- 导航菜单 ，horizontal 水平， router 开启 index 指定路由地址， default-active默认哪个被选中-->
          <el-menu
            mode="horizontal"
            router
            :default-active="defaultActive"
            active-text-color="#f45154"
            background-color="#fafafa"
          >
            <el-menu-item index="/">文章</el-menu-item>
            <el-menu-item index="/question">问答</el-menu-item>
            <el-menu-item index="/label">标签</el-menu-item>
          </el-menu>
        </el-col>
        <!-- 登录、注册/头像 手机与平板坚屏都占18格，其他占8格式-->
        <el-col class="nav-right" :xs="18" :sm="18" :md="8">
          <!-- 登录、注册/头像 -->
          <div class="nav-sign">
            <el-button type="text">管理后台</el-button>
            <el-button
              v-if="!userInfo"
              type="text"
              @click="$store.dispatch('LoginPage')"
              >登录</el-button
            >
            <el-button
              v-if="!userInfo"
              type="primary"
              size="small"
              round
              @click="$store.dispatch('LoginPage')"
              >注册</el-button
            >
          </div>
          <el-dropdown v-if="true" @command="handleCommand">
            <div class="el-dropdown-link">
              <el-avatar
                :src="userInfo ? userInfo.imageUrl : null"
                icon="el-icon-user-solid"
              >
              </el-avatar>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="article">写文章</el-dropdown-item>
              <el-dropdown-item command="question">提问题</el-dropdown-item>
              <el-dropdown-item command="user">我的主页</el-dropdown-item>
              <el-dropdown-item v-if="userInfo" command="logout"
                >退出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    // 高亮显示哪个导航标签
    defaultActive() {
      console.log("this.$route.path", this.$route.matched[0].path);
      // 是否存在多级子路由, 没有值，则是首页/
      let routePath = this.$route.matched[0].path || "/";

      // 如果是动态路由，则只取前面一级路由 /question/:id
      if (routePath.indexOf("/", 1) !== -1) {
        // 截图一级路由，/question
        routePath = routePath.substring(0, routePath.indexOf("/", 1));
      }

      // /article 转为 / 属性文章模块
      return routePath.indexOf("/article") !== -1 ? "/" : routePath;
    },
  },
  methods: {
    // 下拉点击后调用
    handleCommand(command) {
      // this.$message('click on item ' + command)
      // 未登录跳转登录页
      if (!this.userInfo) {
        // 调用了计算属性中的方法，如果没有信息，就跳转到登录页
        return this.$store.dispatch("LoginPage");
      }
      switch (command) {
        case "article":
          // 打开新窗口
          let routeData = this.$router.resolve("/article/edit");
          window.open(routeData.href, "_blank");
          break;
        case "question":
          // 打开新窗口
          routeData = this.$router.resolve("/question/edit");
          window.open(routeData.href, "_blank");
          break;
        case "user":
          routeData = this.$router.resolve("/user");
          window.open(routeData.href, "_blank");
          break;
        case "logout":
          // 触发UserLogout
          this.$store.dispatch("UserLogout");
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.header {
  width: 100%;
  height: 60px;
  border-top: 3px solid #f45154;
  background-color: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  z-index: 1501;
}
.header-fixed {
  position: fixed;
}

/* 导航 */
.header .nav {
  max-width: 1140px;
  /* 居中 */
  margin: auto;
  padding: 10px;
}

.el-menu.el-menu--horizontal {
  /* 去除底部边框 */
  border-bottom: 0px;
  margin-top: -10px;
}

/* 导航右侧 */
.nav-right {
  text-align: right;
}
.nav-sign {
  position: absolute;
  right: 0;
  margin-right: 50px;
}

/* 防止点击头像有边框 */
div:focus {
  outline: none;
}
</style>