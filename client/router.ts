import login from './components/login/login.vue'
import notFound from './components/notFound/notFound.vue'
import home from './components/home/home.vue'
import teacherHomework from './components/student/homework/homework.vue'
import studentHomework from './components/teacher/homework/homework.vue'
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
    {
      path: '/teacher/homework',
      component: teacherHomework
    },
    {
      path: '/student/homework',
      component: studentHomework
    },
    // {
    //   path: '/generated/:id',
    //   component: generated,
    //   props: true
    // },
  ]
});
export default Router
