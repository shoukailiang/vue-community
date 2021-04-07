<template>
  <el-row>
    <el-col
      :span="3"
      v-for="(item, index) in Data"
      :key="index"
      :offset="index > 0 ? 1 : 0"
    >
      <el-card :body-style="{ padding: '0px' }">
        <img :src="item.imageUrl" class="image" />
        <div style="padding: 14px">
          <nuxt-link :to="'/user/' + item.id" target="_blank" class="nickname">
            {{ item.nickName }}
          </nuxt-link>
        </div>
      </el-card>
    </el-col>
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

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>