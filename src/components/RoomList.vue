<template>
  <div>
    <h3>Rooms</h3>
    <ul>
      <li v-for="room of rooms" v-on:click="joinRoom(room)">{{room}}</li>
    </ul>
    <input v-model="newRoom" placeholder="New Room" />
    <button v-on:click="createRoom()">Create Room</button>
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
      createRoom: function() {
        const newRoom = this.newRoom;
        if (this.rooms.indexOf(newRoom) !== -1) {
          return;
        }
        this.rooms.push(newRoom);
        this.socket.emit('room', newRoom);
        this.$emit('join-room', newRoom);
      },
      joinRoom: function(room) {
        console.log(`Joining room ${room}`);
        this.$emit('join-room', room);
      },
      newRoom: '',
      rooms: []
    };
  },
  name: 'room-list',
  props: ['socket']
}
</script>

<style>
</style>
