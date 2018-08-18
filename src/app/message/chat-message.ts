import { Message } from './message';

import { CHAT_MESSAGE_CODE } from './message-codes';

declare var TextEncoder: any;

export class ChatMessage implements Message<string> {
  textEncoder: any;

  constructor() {
    this.textEncoder = new TextEncoder();
  }

  encapsulate(message: string): any {
    const buffer = this.textEncoder.encode(` ${message}`);
    buffer[0] = CHAT_MESSAGE_CODE;
    return buffer;
  }

  decapsulate(buffer: any): string {
    return this.textEncoder.decode(new Uint8Array(buffer, 1));
  }

  filter(): (buffer: any) => boolean {
    return buffer => (new Uint8Array(buffer))[0] === CHAT_MESSAGE_CODE;
  }
}
