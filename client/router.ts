import login from './components/login/login.vue'
import notFound from './components/notFound/notFound.vue'
import studentHomework from './components/student/homework/homework.vue'
import teacherHomework from './components/teacher/homework/homework.vue'
import teacherHome from './components/teacher/home/home.vue'
import VueRouter from "vue-router";


const Router = new VueRouter({
  // routes: routes // short for `routes: routes`
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
      path: '/teacher/homework',
      component: teacherHomework
    },
    {
      path: '/teacher/home',
      component: teacherHome
    },
    {
      path: '/student/homework',
      component: studentHomework
    },
    // {
    //   path: '/student/home',
    //   component: studentHome
    // },
    // {
    //   path: '/generated/:id',
    //   component: generated,
    //   props: true
    // },
  ]
});
export default Router
