<template>
  <div>
    <p>Room {{ name }} The host is <span v-if="!host">not</span> us</p>
    <ul>
      <li v-for="other of others">{{ other }}</li>
    </ul>
  </div>
</template>

<script>
import { HostHandshake, ViewerHandshake } from '../crypto/handshakes.js';

export default {
  data: function() {
    this.socket.on('others', newOthers => {
      console.log(this.others);
      this.others = [];
      for (const other of newOthers) {
        this.others.push(other);
      }

      if (this.others.length === 1) {
        this.host = true;
        this.initializeHost.bind(this)().then(() => {}, err => console.log);
      } else {
        this.initializeViewer.bind(this)().then(() => {}, err => console.log);
      }
    });

    return {
      initializeTransports: function(roomKey, hostPublicKey, ownPrivateKey) {
        console.log('Completed handshakes');
      },
      host: false,
      initializeHost: async function() {
        const roomKey = await crypto.subtle.generateKey({
          name: 'AES-CBC',
          length: 256
        }, true, ['encrypt', 'decrypt']);

        const ownSigningPair = await window.crypto.subtle.generateKey({
          name: 'ECDSA',
          namedCurve: 'P-521'
        }, true, ['sign', 'verify']);

        this.initializeTransports(roomKey, ownSigningPair.publicKey, ownSigningPair.privateKey);
        // Handle handshake hellos from viewers
      },
      initializeViewer: async function() {
        this.handshake = new ViewerHandshake(this);
        this.handshake.start().then((roomKey, hostPublicKey, ownPrivateKey) => {
          console.log('Finished viewer handshake');
          this.initializeTransports(roomKey, hostPublicKey, ownPrivateKey);
        }, err => {
          console.log(err);
          this.$emit('disconnect');
        });
      },
      others: []
    };
  },
  name: 'room',
  props: ['me', 'name', 'socket']
}
</script>

<style>
</style>
