<template>
  <div class="question-container">
    <el-row>
      <el-tabs value="hot" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="热门回答" name="hot">
          <List
            name="hot"
            :page="page"
            :listData="listData"
            @fetch-data="fetchData"
          />
        </el-tab-pane>
        <el-tab-pane label="最新问答" name="new">
          <List
            name="new"
            :page="page"
            :listData="listData"
            @fetch-data="fetchData"
          />
        </el-tab-pane>
        <el-tab-pane label="等待回答" name="wait">
          <List
            name="wait"
            :page="page"
            :listData="listData"
            @fetch-data="fetchData"
          />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>
<script>
// 回答列表组件
import List from "@/components/question/List";

export default {
  components: {
    List,
  },
  // 默认查询热门问答
  async asyncData({ app }) {
    const page = {
      total: 0, // 总记录数
      current: 1, // 当前页码
      size: 8, // 每页显示8条数据
    };
    // 查询热门问答
    const { data } = await app.$getHotList(page);
    // 赋值总记录数
    page.total = data.total;

    return { page, listData: data.records };
  },

  methods: {
    // 点击标签时触发
    handleClick(tab) {
      this.fetchData(tab.paneName,1);
    },
    // 获取数据，子组件List会传递参数(标签名，当前页码)
    async fetchData(paneName, current) {
      this.page.current = current;
      // 请求接口响应对象
      let response = null;
      switch (paneName) {
        case "hot":
          response = await this.$getHotList(this.page);
          break;
        case "new":
          response = await this.$getNewList(this.page);
          break;
        case "wait":
          // 查询等待，0条回复数
          response = await this.$getWaitList(this.page);
          break;
      }
      if (response && response.code === 20000) {
        this.page.total = response.data.total;
        this.listData = response.data.records;
      }
    },
  },
};
</script>
<style scoped>
.question-container {
  margin: 10px;
}
</style>
