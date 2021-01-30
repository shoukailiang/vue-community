
export default {
  mode: 'universal',
  env: {
    // 认证客户端URL， process.env.authURL
    authURL: process.env.NODE_ENV === 'dev' ? '//localhost:7000' : '//login.shoukailiang.com'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    // 1. elementui各组件样式
    'element-ui/lib/theme-chalk/index.css',
    // 自适应隐藏显示
    'element-ui/lib/theme-chalk/display.css',
    // 自动离主题样式
    '@/assets/theme/index.css',
    //  全局自定义样式  
    '@/assets/css/global.css',
    // 加上 mavon-editor 组件要使用的样式 
    'mavon-editor/dist/css/index.css'


  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/interceptor.js',
    '@/api/article',
    '@/api/common',
    '@/api/question',
    '@/api/user',
    // 客户端渲染，
    { src: '@/plugins/mavon-editor', mode: 'client' },

  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    'cookie-universal-nuxt', // 针对服务端操作cookie
  ],
  axios: { // 对 象
    proxy: true, // 开启代理
    prefix: '/api' // 请求前缀

  },
  proxy: { // 对 象
    // 将 /api 替换为 '', 然后代理转发到 target 指定的 url
    '/api': {
      target: 'https://mock.mengxuegu.com/mock/5ff2987b5b350029c77ca07f/vue-community', pathRewrite: { '^/api': '' }
    }
  }, // 逗 号

  /*
  ** Build configuration
  */
  build: {
    // 4. 将位于node_modules的模块导出  
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
