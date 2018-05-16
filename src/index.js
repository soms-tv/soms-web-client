import io from 'socket.io-client';
import Vue from 'vue';

import App from './App.vue';

const socket = io();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});
