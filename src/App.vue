<template>
  <div>
    <p>Own ID {{ me }}</p>
    <room-list v-bind:socket="socket" v-on:join-room="updateRoom"></room-list>
    <room v-bind:me="me" v-bind:name="room" v-bind:socket="socket" v-if="room !== 'lobby'"></room>
  </div>
</template>

<script>
import io from 'socket.io-client';

const socket = io();

export default {
  name: 'app',
  data: function()  {
    socket.on('you', me => {
      this.me = me;
    });
    return {
      'me': '',
      'room': 'lobby',
      'socket': socket,
      'updateRoom': room => {
        this.room = room;
      }
    };
  }
}
</script>

<style>
</style>
