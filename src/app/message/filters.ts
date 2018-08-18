function handshakeFilter(buffer: any): boolean {
  return (new Uint8Array(buffer))[0] === 1;
}

function roomFilter(buffer: any): boolean {
  return (new Uint8Array(buffer))[0] === 0;
}

export { handshakeFilter, roomFilter };
