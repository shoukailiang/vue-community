export default ({ store, route, redirect, $axios }) => {

    $axios.onRequest(config => {
        const accessToken = store.state.accessToken
        if (accessToken) {
            // Authorization: Bearer token
            config.headers.Authorization = 'Bearer ' + accessToken
        }
        // 请求头添加token
        return config
    })

    $axios.onResponse(response => {
        return response
    })


    $axios.onError(error => {
        if (error.response.status != 401) {
            return Promise.reject(error)
        }
        // 401 发送刷新获取新令牌
        sendRefreshRequest(route, store, redirect)
        return Promise.reject('令牌过期，重新登录')
    })

}

let isLock = true // 防止并发重复发送刷新令牌请求， true 还未发送，false正在请求刷新

const sendRefreshRequest = (route, store, redirect) => {

    if (isLock && store.state.refreshToken) {// 还未发送，并且refreshToken有值
        isLock = false
        // 发送请求到认证客户端，通过刷新令牌获取新令牌;redirect在客户端和服务端都可以使用
        redirect(`${process.env.authURL}/refresh?redirectURL=${redirectURL(route)}`)
    } else {
        isLock = true
        // 没有刷新令牌，跳转到登录页
        // 重置用户状态
        store.commit('RESET_USER_STATE')
        // 跳转到登录页

        redirect(`${process.env.authURL}?redirectURL=${redirectURL(route)}`)
    }
}

// 获取重定向地址
const redirectURL = (route) => {
    // 客户端
    if (process.client) {
        return window.location.href
    }
    // 服务端 process.env._AXIOS_BASE_URL_  http://localhost:3000/api  有api是应为加了前缀qpi
    return process.env._AXIOS_BASE_URL_.replace('api', '') + route.path // route.path =>label;blog
}