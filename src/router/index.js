import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '../components/pages/SignIn.vue'
import SignUp from '../components/pages/SignUp.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'signIn',
      component: SignIn
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: SignUp
    }
]})    

