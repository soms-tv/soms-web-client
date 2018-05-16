<template>
  <div>
    <p>Room {{ name }}</p>
    <ul>
      <li v-for="other of others">{{ other }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data: function() {
    this.socket.on('others', newOthers => {
      console.log(this.others);
      this.others = [];
      for (const other of newOthers) {
        this.others.push(other);
      }
      console.log(this.others);
    });

    return {
      others: []
    };
  },
  name: 'room',
  props: ['name', 'socket']
}
</script>

<style>
</style>
