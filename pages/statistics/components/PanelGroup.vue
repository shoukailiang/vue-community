<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <i class="el-icon-user"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总用户</div>
          <count-to
            :start-val="0"
            :end-val="userTotal"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <i class="el-icon-notebook-2"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总文章</div>
          <count-to
            :start-val="0"
            :end-val="articleTotal"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <i class="el-icon-chat-line-square"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总提问</div>
          <count-to
            :start-val="0"
            :end-val="questionTotal"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo,
  },

  props: {
    userTotal: {
      type: Number,
      default: 0,
    },
    articleTotal: {
      type: Number,
      default: 0,
    },
    questionTotal: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped>
.panel-group {
  margin-top: 18px;
}
.panel-group .card-panel-col {
  margin-bottom: 32px;
}
.panel-group .card-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.panel-group .card-panel:hover .card-panel-icon-wrapper {
  color: #fff;
}
.panel-group .card-panel:hover .icon-people {
  background: #40c9c6;
}
.panel-group .card-panel:hover .icon-message {
  background: #36a3f7;
}
.panel-group .card-panel:hover .icon-money {
  background: #f4516c;
}
.panel-group .card-panel:hover .icon-shopping {
  background: #34bfa3;
}
.panel-group .card-panel .icon-people {
  color: #40c9c6;
}
.panel-group .card-panel .icon-message {
  color: #36a3f7;
}
.panel-group .card-panel .icon-money {
  color: #f4516c;
}
.panel-group .card-panel .icon-shopping {
  color: #34bfa3;
}
.panel-group .card-panel .card-panel-icon-wrapper {
  padding: 20px;
  transition: all 0.38s ease-out;
  border-radius: 6px;
}
.panel-group .card-panel .card-panel-icon-wrapper i{
  font-size: 28px;
}
.panel-group .card-panel .card-panel-icon {
  float: left;
  font-size: 48px;
}
.panel-group .card-panel .card-panel-description {
  float: right;
  font-weight: bold;
  margin: 26px;
  margin-left: 0px;
}
.panel-group .card-panel .card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}
.panel-group .card-panel .card-panel-description .card-panel-num {
  font-size: 20px;
}
@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;
  }
}
</style>
