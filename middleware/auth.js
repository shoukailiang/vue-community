// 运行在服务端
export default ({ store, route, redirect, req }) => {

    // 权限判断，判断是否已经通过身份认证
    if (!store || !store.state.userInfo) {
        // 未认证，则跳转到认证中心
        // http://localhost:3000/aritcle/edit
        // 这种方式在生产环境还是获取的http://localhost:3000，而不能正确获取域名，
        // 比如说不能正确获取 http://blog.mengxuegu.com
        // const redirectURL = process.env._AXIOS_BASE_URL_.replace('api', '') + route.path

        // blog.mengxuegu.com:80/article/edit 
        // console.log('req.headers.host', req.headers.host)
        // 在生产环境可以正确的获取主机名（域名+端口号）
        const redirectURL = 'http://' + req.headers.host + route.path

        // 重定向
        redirect(`${process.env.authURL}?redirectURL=${redirectURL}`)
    }

}