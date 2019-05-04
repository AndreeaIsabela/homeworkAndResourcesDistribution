import login from './components/login/login.vue'
import notFound from './components/notFound/notFound.vue'
import homework from './components/homework/homework.vue'
import addResources from './components/addResources/addResources.vue'
import addHomework from './components/addHomework/addHomework.vue'
import resources from './components/resources/resources.vue'
import assigment from './components/assigment/assigment.vue'
import home from './components/home/home.vue'
import VueRouter from "vue-router";


const Router = new VueRouter({
  routes: [
    {
      path: '/notFound',
      component: notFound
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/homework',
      component: homework
    },
    {
      path: '/resources',
      component: resources
    },
    {
      path: '/home',
      component: home
    },
    {
      path: '/addResources',
      component: addResources
    },
    {
      path: '/addHomework',
      component: addHomework
    },
    {
      path: '/assigment',
      component: assigment
    },


    // {
    //   path: '/generated/:id',
    //   component: generated,
    //   props: true
    // },
  ]
});
export default Router
