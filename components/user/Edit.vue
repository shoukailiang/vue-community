<template>
  <div>
    <el-row
      type="flex"
      justify="center"
      style="padding-top: 30px; background: #fcf8e3"
    >
      <el-form
        :rules="rules"
        ref="formData"
        :model="formData"
        label-width="100px"
        style="width: 400px"
        status-icon
      >
        <el-form-item label="昵称：" prop="nickName">
          <el-input
            v-model="formData.nickName"
            maxlength="30"
            placeholder="真实姓名或昵称"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input
            v-model="formData.mobile"
            maxlength="11"
            placeholder="11 位手机号码"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input
            v-model="formData.email"
            maxlength="40"
            placeholder="用于收取通知邮件"
          >
          </el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button
            size="mini"
            type="primary"
            :loading="loading"
            @click="submitForm('formData')"
            >确 定</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { isvalidUsername, isvalidMobile, isvalidEmail } from "@/utils/validate";
export default {
  props: {
    loading: {
      // 是否点击确定按钮
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => {
        return {
          username: "",
          nickName: "",
          mobile: "",
          email: "",
        };
      },
    },
  },

  methods: {
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 校验通过，提交数据
          this.$emit("submitForm");
        } else {
          // 验证不通过
          return false;
        }
      });
    },
  },

  data() {
    var checkNickName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("昵称不能为空"));
      } else if (value.length > 30) {
        callback(new Error("最多30个字符"));
      } else if(!isvalidUsername(value)){
        callback(new Error("用户名不合法"));
      }else {
        callback();
      }
    };
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error("手机号不能为空"));
      } else if (!isvalidMobile(value)) {
        callback(new Error("手机号不合法"));
      } else {
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error("邮箱不能为空"));
      } else if (!isvalidEmail(value)) {
        callback(new Error("邮箱不合法"));
      } else {
        callback();
      }
    };

    return {
      rules: {
        nickName: [
          { required: true, validator: checkNickName, trigger: "blur" },
        ],
        mobile: [{ required: true, validator: checkMobile, trigger: "blur" }],
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
      },
    };
  },
};
</script>