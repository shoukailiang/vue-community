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
        state.userInfo = null
        state.accessToken = null
        state.refreshToken = null
    },

    // 更新状态
    UPDATE_ALL_STATE(state, data) {
        state.userInfo = data.userInfo
        state.accessToken = data.accessToken
        state.refreshToken = data.refreshToken
    }
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
    LoginPage ({commit}) {
        // 重置用户状态
        commit('RESET_USER_STATE')
        window.location.href = `${process.env.authURL}?redirectURL=${window.location.href}`
    },

    UserLogout({commit}) {
        commit('RESET_USER_STATE')
        window.location.href = `${process.env.authURL}/logout?redirectURL=${window.location.href}`
    }
}

export default {
    state,
    mutations,
    actions
}