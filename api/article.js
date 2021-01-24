export default ({ $axios }, inject) => {

    // 查询技术频道列表接口
    inject('getCategoryList', () => $axios.$get('/article/api/category/list'))
    // 获取指定位置的广告信息
    inject('getAdvertList', position =>
        $axios.$get(`/article/api/advert/show/${position}`))

    // 文章列表分页接口
    inject('getArticleList', query => $axios.$post('/article/api/article/list', query))
}
