import Vue from 'vue'
import Router from 'vue-router'

import Main from '../components/Main'
import Account from '../components/Account'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
    },
    {
      path: '/account',
      name: 'Account',
      component: Account,
    }
  ]
})
