import Vue from 'vue'
import App from './App'
import router from './router'
import VueSocketio from 'vue-socket.io';
import Element from 'element-ui'
import './assets/style.scss';


Vue.use(Element)
//Vue.use(VueSocketio, 'http://localhost:3000');

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
