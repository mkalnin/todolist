require('./bootstrap');

window.Vue = require('vue');
window.Vuex = require('vuex');
window.axios = require('axios');

import VueRouter  from 'vue-router';
import Vuelidate  from 'vuelidate';
import {routes}   from './routes';
import MainApp    from './components/MainApp.vue';


Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Vuelidate);

const router = new VueRouter({
  routes,
  mode : 'history'
})

import todoGroups  from './todos/todo-groups';
import todos       from './todos/todos';

export const store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    todoGroups,
    todos
  }
})

/**
 * We will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    store,
    router,
    components: {
      MainApp
    }
});
