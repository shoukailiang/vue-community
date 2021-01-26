// common.js 应为不仅仅是文章模块用到，问答模块也会用到
export default ({ $axios }, inject) => {

    // 上传图片
    inject('uploadImg', data => $axios.$post(`/article/file/upload`, data))

    // 删除图片/article/file/delete?fileUrl=xxx
    inject('deleteImg', fileUrl =>
        $axios.$delete(`/article/file/delete`, { params: { fileUrl:fileUrl } }))
}
