<template>
  <div>
    <el-form
      :rules="rules"
      ref="formData"
      :model="formData"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="标题：" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入标题"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="标签：" prop="labelIds">
        <el-cascader
          style="display: block"
          :options="labelOptions"
          :show-all-levels="false"
          :props="{
            multiple: true,
            emitPath: false,
            children: 'labelList',
            value: 'id',
            label: 'name',
          }"
          filterable
          clearable
          v-model="formData.labelIds"
          :disabled="disabled"
        >
        </el-cascader>
      </el-form-item>

      <el-form-item label="内容：" prop="content">
        <!-- 
                    ref 就是唯一标识，相关于id
                    v-model 绑定的markdown输入 框的内容
                 -->
        <mavon-editor
          :autofocus="false"
          ref="md"
          v-model="formData.mdContent"
          @change="getMdHtml"
          @imgAdd="uploadContentImg"
          @imgDel="delConentImg"
        />
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="submitForm('formData')"
        >发布问题</el-button
      >
    </el-row>
  </div>
</template>

<script>
export default {
  // 校验
  validate({ query }) {
    // 如果有传递id,则是修改
    if (query.id) {
      return /^\d+$/.test(query.id);
    }
    return true;
  },

  data() {
    const validateLable = (rule, value, callback) => {
      if (value && value.length > 5) {
        this.disabled = true; // 禁止选择
        callback(new Error("最多可选5个标签"));
      } else {
        this.disabled = false; // 可以选择
        callback(); // 校验通过，直接放行
      }
    };

    const validateContent = (rule, value, callback) => {
      if (this.formData.mdContent && this.formData.htmlContent) {
        callback(); // 校验通过，直接放行
      } else {
        callback(new Error("请输入文章内容"));
      }
    };

    return {
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        labelIds: [
          { required: true, message: "请选择标签", trigger: "blur" },
          { validator: validateLable, trigger: "change" },
        ],
        content: [{ validator: validateContent, trigger: "change" }],
      },
      formData: {
        userId: this.$store.state.userInfo.uid,
        userImage: this.$store.state.userInfo.imageUrl,
        nickName: this.$store.state.userInfo.nickName,
      },
      disabled: false, // 标签选择框： false可以选择，true不可选择
      // labelOptions: [
      //     {
      //         id: 1, // 类别id
      //         name: '前端', // 类别名称
      //         labelList: [ // 标签集合
      //             {
      //                 id: 1, // 标签id
      //                 name: 'html' // 标签名称
      //             },
      //             {
      //                 id: 2, // 标签id
      //                 name: 'js' // 标签名称
      //             },
      //             {
      //                 id: 3, // 标签id
      //                 name: 'vue.js' // 标签名称
      //             }
      //         ]
      //     },
      //     {
      //         id: 2, // 类别id
      //         name: 'Java', // 类别名称
      //         labelList: [ // 标签集合
      //             {
      //                 id: 4, // 标签id
      //                 name: 'spring' // 标签名称
      //             },
      //             {
      //                 id: 5, // 标签id
      //                 name: 'servlet' // 标签名称
      //             },
      //             {
      //                 id: 6, // 标签id
      //                 name: 'mybatis' // 标签名称
      //             }
      //         ]
      //     }
      // ]
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitData();
        } else {
          return false;
        }
      });
    },

    // 提交数据给后台
    async submitData() {
      let resp = null;
      // console.log('this.formData', this.formData)
      // 有文章id则修改，没有id则是新增
      if (this.formData.id) {
        // 修改
        resp = await this.$updateQuestion(this.formData);
      } else {
        // 新增
        resp = await this.$addQuestion(this.formData);
      }

      if (resp.code === 20000) {
        this.$message.success("发布成功");
        // 提交成功后，跳转到此问题的详情页,  resp.data获取的是此问题id
        this.$router.push(`/question/${resp.data}`);
      } else {
        this.$message.error("发布失败");
      }
    },

    uploadMainImg(file) {
      // 上传主图片
      // console.log('上传主图片file', file)
      // 封装上传图片的表单对象
      const data = new FormData();
      data.append("file", file.file);
      this.$uploadImg(data)
        .then((response) => {
          if (response.code === 20000) {
            // 删除原图片
            this.deleteImg();
            // 回显上传后的图片
            this.formData.imageUrl = response.data;
          }
        })
        .catch(() => {
          this.$message.error("上传图片失败");
        });
    },

    // 删除图片
    deleteImg() {
      if (this.formData.imageUrl) {
        // 如果有原图地址，则删除它，
        this.$deleteImg(this.formData.imageUrl);
      }
    },

    // mdContent md内容，htmlContent 转成html的内容
    getMdHtml(mdContent, htmlContent) {
      // console.log('mdContent', mdContent)
      // console.log('htmlContent', htmlContent)
      this.formData.mdContent = mdContent;
      this.formData.htmlContent = htmlContent;
    },

    // 上传内容图片（图片位置编号，File对象）
    uploadContentImg(pos, file) {
      // console.log('上传内容图片：', file)
      // 封装表单数据
      const fd = new FormData();
      fd.append("file", file);

      this.$uploadImg(fd).then((response) => {
        if (response.code === 20000) {
          // 上传成功，回显，
          this.$refs.md.$img2Url(pos, response.data);
        }
      });
    },

    delConentImg(urlAndFileArr) {
      const fileUrl = urlAndFileArr[0]; //图片url
      const file = urlAndFileArr[1]; //File对象
      // console.log('删除内容图片', fileUrl, file)
      // 删除内容图片
      this.$deleteImg(fileUrl);
    },
  },

  async asyncData({ app, query }) {
    // 查询分类和标签
    const { data } = await app.$getCategoryAndLabel();

    // 查询文章详情
    if (query.id) {
      const { data: formData } = await app.$getQuestionById(query.id);
      //   console.log('formData', formData)
      return { labelOptions: data, formData };
    }

    return { labelOptions: data };
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>