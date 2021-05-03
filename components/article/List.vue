<template>
  <div>
    <el-table
      class="label-list"
      :show-header="false"
      :data="listData"
      style="width: 100%"
    >
      <el-table-column width="100">
        <template slot-scope="scope">
          <el-tag class="count"> {{ scope.row.viewCount }} <br />浏览 </el-tag>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <h2 class="title">
            <nuxt-link :to="'/article/' + scope.row.id" >
              {{ scope.row.title }}
            </nuxt-link>
          </h2>
          <div class="info">
            <i class="el-icon-user"></i>{{ scope.row.nickName }} &nbsp;
            <i class="el-icon-date"></i>
            {{ scope.row.updateDate|getDateFormat }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" justify="center">
      <!-- current-change 事件是当前页码变动时候触发的事件 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-size="page.size"
        :total="page.total"
        background
        layout="prev, pager, next"
        prev-text=" 上一页 "
        next-text=" 下一页 "
      >
      </el-pagination>
    </el-row>
  </div>
</template>
<script>
import { dateFormat } from "@/utils/date";

export default {
  props: {
    name: {
      // 标签页名字
      type: String,
      default: "hot", // 默认热门
    },
    listData: {
      // 列表数据
      type: Array,
      default: () => {
        return [
          {
            id: "11",
            viewCount: 100,
            title: "热门头条配置动态的代理域名",
            nickName: " 梦者1",
            updateDate: new Date(),
          },
          {
            id: "12",
            viewCount: 80,
            title: "使用配置动态的代理域名",
            nickName: " 梦者2",
            updateDate: new Date(),
          },
        ];
      },
    },
    page: {
      // 分页对象
      type: Object,
      default: () => {
        return {
          size: 20,
          total: 1,
          current: 1,
        };
      },
    },
  },

  methods: {
    handleCurrentChange(current) {
      // 触发父组件事件查询数据(父组件事件名，标签页名称, 当前页码)
      this.$emit("fetch-data", this.name, current);
    },


  },
  filters:{
    getDateFormat(date) {
      return dateFormat(date);
    },
  }
};
</script>

<style scoped>
.label-breadcrumb {
  margin: 10px;
}
.label-tab {
  margin-top: 30px;
}
.label-list .count {
  text-align: center;
  height: 100%;
  line-height: 20px;
}
.label-list .info {
  color: #999;
  font-size: 13px;
}
.label-list .title {
  display: inline-block;
  margin: 0 5px 0 0;
  font-size: 16px;
  height: 22px;
  line-height: 22px;
}
a:hover {
  text-decoration-line: underline;
}
.el-row {
  margin-top: 30px;
}
</style>