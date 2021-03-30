export default ({ $axios }, inject) => {

    // 查询个人用户信息
    inject('getUserInfo', id => $axios.$get(`/system/user/${id}`))

    // 提交修改个人用户信息
    inject('updateUserInfo', data => $axios.$put(`/system/user`, data))

    // 查询个人公开或私密文章 isPublic
    inject('findUserArticle', query => $axios.$post(`/article/article/user`, query))

    // 查询我的提问
    inject('findUserQuestion', query => $axios.$post(`/question/question/user`, query))

    // 校验原密码是否正确
    inject('checkOldPassword', data => $axios.$post('/system/user/check/password', data))
    // 提交修改密码
    inject('updatePassword', data => $axios.$put('/system/user/password', data))

    // 关注用户
    inject('focusUser', data => $axios.$post(`/system/focus`, data))

    // 查询是否关注
    inject('isFocus', data => $axios.$post(`/system/focus/isfocus`, data))

    // 查询已关注的
    inject('getUserId', id => $axios.$get(`/system/focus/userId/${id}`))


     // 查询粉丝
    inject('getFocusId', id => $axios.$get(`/system/focus/focusId/${id}`))


}