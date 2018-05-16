import Vue from 'vue';

import Chat from './components/Chat.vue';
import Player from './components/Player.vue';
import Room from './components/Room.vue';
import RoomList from './components/RoomList.vue';

const components = [
  Chat,
  Player,
  Room,
  RoomList
];

for (const component of components) {
  Vue.component(component.name, component);
}

import App from './App.vue';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});
