import Vue from 'vue'
/*global Vue*/
import Router from 'vue-router'
import Nav from '@/components/nav'
import ViewBind from '@/components/Bind'
import ViewHome from '@/components/Home'
import ViewReport from '@/components/Report'
import ViewBindList from '@/components/BindList'
import Login from '@/components/Login'
Vue.use(Router)
module.exports = new Router({
  routes: [
    {
      path: '/',
      redirect:'/login'
    },
    { 
      path: '/login', 
      component: Login
    },
    {
      path: '/nav', 
      component: Nav,
      redirect:'/bind',
      children:[
        { path: '/bind', component: ViewBind },
        { path: '/home', component: ViewHome },
        { path: '/report', component: ViewReport },
        { path: '/bindList', component: ViewBindList }
      ]
    },
  ]
})
