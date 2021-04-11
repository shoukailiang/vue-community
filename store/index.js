// nuxt 声明状态，必须是function
const state = () => ({
    userInfo: null,
    accessToken: null,
    refreshToken: null
})

// 改变状态值
const mutations = {
    // 状态置空
    RESET_USER_STATE(state) {
        // 状态置空
        state.userInfo = null
        state.accessToken = null
        state.refreshToken = null
    },

    // 更新状态
    UPDATE_ALL_STATE(state, data) {
        state.userInfo = data.userInfo
        state.accessToken = data.accessToken
        state.refreshToken = data.refreshToken
    },
}


// 定义行为
const actions = {
    // nuxt提供的，每次发送请求都会先调用此方法 ，并且第1个参数store, 该方法的第2个参数是context, 
    nuxtServerInit({commit}, {app}) {
        // console.log('nuxtServerInit', app)
        const data = {}
        data.userInfo = app.$cookies.get('userInfo')
        data.accessToken = app.$cookies.get('accessToken')
        data.refreshToken = app.$cookies.get('refreshToken')
        // console.log('data', data)
        // 更新状态值
        commit('UPDATE_ALL_STATE', data)
    },
   // 跳转登录页
    LoginPage ({commit}) {
        // 重置用户状态
        commit('RESET_USER_STATE')
        // 跳转到认证客户端（登录页）， redirectURL 作为请求参数，参数值是引发跳转的地址
        // window 是属于浏览器的对象，所以在触发这个action时，只能在客户端中进行触发 ，不能在服务端进行触发（asyncData）
        window.location.href = `${process.env.authURL}?redirectURL=${window.location.href}`
    },

    UserLogout({commit}) {
        // 1. 重置状态
        commit('RESET_USER_STATE')
        // 2. 跳转认证客户端实现退出
        window.location.href = `${process.env.authURL}/logout?redirectURL=${window.location.href}`
    },
}

// 不要忘记
export default {
    state,
    mutations,
    actions
}