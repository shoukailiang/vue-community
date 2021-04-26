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
      <el-form-item label="主图：" prop="imageUrl">
        <!-- 
          action 上传图片的调用地址，不用它，
          accept 接收上传的类型，图片
          show-file-list 是否列表展示上传的文件，因为只传一张图片，不要显示列表
        -->
        <el-upload
          class="avatar-uploader"
          action=""
          accept="image/*"
          :show-file-list="false"
          :http-request="uploadMainImg"
        >
          <img
            v-if="formData.imageUrl"
            :src="formData.imageUrl"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否公开：" prop="ispublic">
        <el-radio-group v-model="formData.ispublic">
          <el-radio :label="0">不公开</el-radio>
          <el-radio :label="1">公开</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="简介：" prop="summary">
        <el-input
          type="textarea"
          v-model="formData.summary"
          placeholder="请输入标题"
          maxlength="2000"
          show-word-limit
          :autosize="{ minRows: 3 }"
        />
      </el-form-item>

      <el-form-item label="内容：" prop="content">
        <!-- 
          ref 就是唯一标识，相关于id
          v-model 绑定的markdown输入 框的内容
          @change   获得md的html的内容
        -->
        <client-only>
          <mavon-editor
            ref="md"
            v-model="formData.mdContent"
            @change="getMdHtml"
            @imgAdd="uploadContentImg"
            @imgDel="delConentImg"
          />
        </client-only>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="submitForm('formData')"
        >提交审核</el-button
      >
    </el-row>
  </div>
</template>

<script>
export default {
    middleware: 'auth',
  // 校验 query   http://localhost:3000/article/edit?id=10
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
        this.disabled = true; 
        callback(new Error("最多可选5个标签"));
      } else {
        this.disabled = false; 
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
        title: [{ required: true, message: "请查看是否忘了标题？", trigger: "blur" }],
        labelIds: [
          { required: true, message: "请查看是否忘了标签", trigger: "blur" },
          { validator: validateLable, trigger: "change" },
        ],
        ispublic: [
          { required: true, message: "请查看选择是否公开", trigger: "change" },
        ],
        summary: [{ required: true, message: "请查看是否忘了简介", trigger: "blur" }],
        content: [{ validator: validateContent, trigger: "change" }],
      },
      formData: {
        imageUrl: null, // 写出来，不写出来不会被渲染图片
        userId: this.$store.state.userInfo.uid, // 在提问题中，修复了此bug，要提交当前用户信息
        userImage: this.$store.state.userInfo.imageUrl,
        nickName: this.$store.state.userInfo.nickName
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
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        // 校验通过，提交数据
          this.submitData();
        } else {
          // 校验不通过
          return false;
        }
      });
    },

    // 异步提交数据给后台
    async submitData() {
      let resp = null;
      // 有文章id则修改，没有id则是新增
      if (this.formData.id) {
        // 修改
        resp = await this.$updateArticle(this.formData);
      } else {
        // 新增
        resp = await this.$addArticle(this.formData);
      }

      if (resp.code === 20000) {
        this.$message.success("提交成功");
        // 提交成功后，跳转到此文章的详情页,  resp.data获取的是此文章id
        this.$router.push(`/article/${resp.data}`);
      } else {
        this.$message.error("提交失败");
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
            this.$message.success("上传成功")
          }
        })
        .catch(() => {
          this.$message.error("上传图片失败");
        });
    },

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
      // console.log(pos)
      // console.log('上传内容图片：', file)
      const fd = new FormData();
      fd.append("file", file);

      this.$uploadImg(fd).then((response) => {
        if (response.code === 20000) {
          // 上传成功，回显，
          this.$refs.md.$img2Url(pos, response.data);
          this.$message.success("上传成功")
        }
      });
    },

    delConentImg(urlAndFileArr) {
      const fileUrl = urlAndFileArr[0]; //图片url
      // const file = urlAndFileArr[1]; //File对象
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
      const { data: formData } = await app.$getArticleById(query.id);
      //   console.log('formData', formData)
      return { labelOptions: data, formData };
    }

    return { labelOptions: data };
  },
};
</script>

<style scoped>
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