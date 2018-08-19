import { CHAT_MESSAGE_CODE } from './message-codes';

declare var TextEncoder: any;
const textEncoder = new TextEncoder();

declare var TextDecoder: any;
const textDecoder = new TextDecoder();

export class ChatMessage {
  static fromBuffer(buffer: any): ChatMessage {
    return new ChatMessage(textDecoder.decode(new Uint8Array(buffer, 1)));
  }

  static is(buffer: any): boolean {
    return (new Uint8Array(buffer))[0] === CHAT_MESSAGE_CODE;
  }

  constructor(public content: string) { }

  toBuffer(): any {
    const buffer = textEncoder.encode(` ${this.content}`);
    buffer[0] = CHAT_MESSAGE_CODE;
    return buffer;
  }
}
