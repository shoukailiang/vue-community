export default ({ $axios }, inject) => {

  // 查询总用户
  inject('getUserTotal', id => $axios.$get(`/system/user/total`))


  // 查询总文章
  inject('getArticleTotal', id => $axios.$get(`/article/article/total`))

  // 查询总提问
  inject('getQuestionTotal', id => $axios.$get(`/question/question/total`))

  // 查询各分类下的文章数
  inject('getCategoryTotal', id => $axios.$get(`/article/article/category/total`))

  // 查询近6个月发布的文章数
  inject('getMonthArticleTotal', id => $axios.$get(`/article/article/month/total`))



}