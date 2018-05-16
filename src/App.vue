<template>
  <div>
    <room-list v-bind:socket="socket" v-on:join-room="updateRoom"></room-list>
    <room v-if="room !== 'lobby'"></room>
  </div>
</template>

<script>
import io from 'socket.io-client';

const socket = io();

export default {
  name: 'app',
  data: function()  {
    return {
      'updateRoom': room => {
        this.room = room;
      },
      'room': 'lobby',
      'socket': socket
    };
  }
}
</script>

<style>
</style>
