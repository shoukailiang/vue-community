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

    // 查询已关注的个数
    inject('getUserId', id => $axios.$get(`/system/focus/userId/${id}`))


    // 查询粉丝个数
    inject('getFocusId', id => $axios.$get(`/system/focus/focusId/${id}`))

    // 查询我的粉丝列表
    inject('getMyFans', id => $axios.$get(`/system/focus/fans/${id}`))

    // 查询我关注的列表
    inject('getMyFocus', id => $axios.$get(`/system/focus/myfocus/${id}`))



}