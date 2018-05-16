<template>
  <div>
    <h3>Rooms</h3>
    <ul>
      <li v-for="room of rooms" v-on:click="joinRoom(room)">{{room}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  created: function() {
    console.log(this.socket);

    this.socket.on('rooms', rooms => {
      console.log(Object.keys(rooms));

      for (let room of Object.keys(rooms)) {
        this.rooms.push(room);
      }
    });

    this.socket.on('new room', newRoom => {
      this.rooms.push(newRoom);
    });
  },
  data: function() {
    return {
      joinRoom: function(room) {
        console.log(`Joining room ${room}`);
      },
      rooms: []
    };
  },
  name: 'room-list',
  props: ['socket']
}
</script>

<style>
</style>
