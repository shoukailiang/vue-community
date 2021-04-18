<template>
  <el-row>
    <el-col :span="3" v-for="(item, index) in Data" :key="index">
      <el-card class="avatar-container" shadow="hover">
        <el-avatar shape="circle" :size="100" :src="item.imageUrl"></el-avatar>
        <div>
          <nuxt-link :to="'/user/' + item.id" target="_blank" class="nickname">
            {{ item.nickName }}
          </nuxt-link>
        </div>
      </el-card>
    </el-col>
    <p class="no-data">
      {{ Data == null ? "暂无数据" : "" }}
    </p>
  </el-row>
</template>

<script>
export default {
  props: {
    Data: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.avatar-container {
  padding: 0 14px;
  margin-right: 20px;
  display: flex;
  justify-content: center;
}

.avatar-container div {
  text-align: center;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.no-data{
  color: #909399;
  text-align: center;
  font-size: 14px;
}
</style>