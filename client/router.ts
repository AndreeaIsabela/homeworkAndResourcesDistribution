import login from './components/login/login.vue'
import notFound from './components/notFound/notFound.vue'
import home from './components/home/home.vue'
import VueRouter from "vue-router";


const Router = new VueRouter({
  // routes: routes // short for `routes: routes`
  routes: [
    {
      path: '/notFound',
      component: notFound
    },
    {
      path: '/home',
      component: home
    },
    {
      path: '/login',
      component: login
    },
    // {
    //   path: '/generated/:id',
    //   component: generated,
    //   props: true
    // },
  ]
});
export default Router
