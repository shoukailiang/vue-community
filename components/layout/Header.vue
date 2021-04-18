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
        <el-col class="hidden-sm-and-down" :md="8">
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
        <!-- 搜索 -->
        <el-col class="hidden-sm-and-down" :md="6">
          <el-autocomplete
            class="inline-input"
            v-model.trim="state1"
            :fetch-suggestions="querySearch"
            placeholder="输入您想搜索的文章"
            @select="handleSelect"
            @change="getSearchText"
          >
          </el-autocomplete>
          <el-button icon="el-icon-search" @click="handleSearch"></el-button>
        </el-col>

        <el-col :md="1" class="message-icon-container hidden-sm-and-down">
          <el-badge :value="20" :max="99" class="item">
            <i class="el-icon-message message-icon" ></i>
          </el-badge>
        </el-col>
        <!-- 登录、注册/头像 手机与平板坚屏都占18格，其他占8格式-->
        <el-col class="nav-right" :xs="10" :sm="10" :md="3">
          <!-- 登录、注册/头像 -->
          <div class="nav-sign">
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
          <el-dropdown v-if="userInfo" @command="handleCommand">
            <div class="el-dropdown-link">
              <el-avatar
                :src="this.avatar ? this.avatar : null"
                icon="el-icon-user-solid"
              >
              </el-avatar>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="article">写文章</el-dropdown-item>
              <el-dropdown-item command="question">提问题</el-dropdown-item>
              <el-dropdown-item command="user">我的主页</el-dropdown-item>
              <el-dropdown-item command="admin">后台管理</el-dropdown-item>
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
  data() {
    return {
      // 搜索
      articleData: [],
      state1: "",
      searchReq: {
        title: "",
        current: 1,
        size: 8,
      },
      avatar:""
    };
  },
  async created () {
    if(this.$store.state.userInfo){
      const { data: userInfo1 } = await this.$getUserInfo(this.$store.state.userInfo.uid);
      this.avatar = userInfo1.imageUrl
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    // 高亮显示哪个导航标签
    defaultActive() {
      // console.log("this.$route.path", this.$route.matched[0].path);
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
        case "admin":
          window.open("http://localhost:9528", "_blank");
          break;
        case "logout":
          // 触发UserLogout
          this.$store.dispatch("UserLogout");
          break;
        default:
          break;
      }
    },
    // 搜索
    querySearch(queryString, cb) {
      var articleData = this.articleData;
      var results = queryString
        ? articleData.filter(this.createFilter(queryString))
        : articleData;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (articleData) => {
        return (
          articleData.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      return [{ value: "java" }, { value: "html" }];
    },
    handleSelect(item) {
      this.searchReq.title = item.value;
    },
    async handleSearch() {
      if(this.searchReq.title===""||this.searchReq.title===null){
        this.$message.error("请输入内容");
        return;
      }
      this.$router.push({
        path: "/search",
        query: {
          title: `${this.searchReq.title}`,
          current: `${this.searchReq.current}`,
          size: `${this.searchReq.size}`,
        },
      });
    },
    getSearchText() {
      this.searchReq.title = this.state1;
    },
  },
  mounted() {
    this.articleData = this.loadAll();
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
  display: flex;
  justify-content: space-between;
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
.message-icon-container{
  display: flex;
  align-items: center;
}
.message-icon {
  font-size: 28px;
}
.message-icon:hover {
  color: #f45154;
  cursor: pointer;
}
</style>