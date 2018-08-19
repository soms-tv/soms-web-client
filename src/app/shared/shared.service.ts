import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { CryptoService } from '../crypto.service';
import { handshakeFilter, roomFilter } from '../message/filters';
import { Message } from '../message/message';

declare var TextEncoder: any;
declare var TextDecoder: any;

@Injectable()
export class SharedService {
  ownName: string;
  roomName: string;
  roomPassword: string;
  serverAddress: string;
  socket: any;
  socketObservable: WebSocketSubject;
  private textEncoder: any;

  constructor(private cryptoService: CryptoService) {
    this.socketObservable = webSocket(this.socket);
    this.textEncoder = new TextEncoder();
    this.textDecoder = new TextDecoder();
  }

  getHandshakeMessages(): Observable<any> {
    return this.socketObservable.pipe(filter(handshakeFilter));
  }

  getRoomMessages(): Observable<any> {
    return this.socketObservable.pipe(
      filter(roomFilter),
      flatMap(buffer => {
        const senderBuffer = new Uint8Array(buffer, 0, 24);
        const signature = new Uint8Array(buffer, 24, 132);
        const message = new Uint8Array(buffer, 156);

        const sender = this.textDecoder.decode(senderBuffer).trim();
        return this.cryptoService.verify(message, signature, sender).pipe(
          map(valid => [buffer, valid])
        );
      }),
      filter(pair => pair[1]),
      map(pair => pair[0]),
      flatMap(buffer => {
        const iv = new Uint8Array(buffer, 156, 16);
        const ciphertext = new Uint8Array(buffer, 172);
        return this.cryptoService.decryptRoom(ciphertext, iv);
      })
    );
  }

  sendRoomMessage(toSend: Message<any>) {
    Observable.of(toSend).pipe(
      map(message => message.toBuffer()),
      flatMap(messageBuffer => this.cryptoService.encryptRoom(messageBuffer)),
      map(pair => {
        const ciphertext = pair[0];
        const iv = pair[1];
        const combined = new Uint8Array(ciphertext.length + iv.length);
        combined.set(iv);
        combined.set(ciphertext, iv.length);
        return combined;
      }),
      flatMap(encryptedMessage => {
        return this.cryptoService.sign(message).pipe(map(signature => [encryptedMessage, signature]));
      }),
      map(pair => {
        const encryptedMessage = pair[0];
        const signature = pair[1];
        const finalBuffer = new Uint8Array(encryptedMessage.length + signature.length + 24);

        const senderBuffer = this.textEncoder.encode(ownName);
        if (senderBuffer.length > 23) {
          throw new Error('Own name too long');
        }
        // Room message type
        finalBuffer.set(0, 0);
        finalBuffer.set(senderBuffer, 1);
        finalBuffer.set(signature, 24);
        finalBuffer.set(encryptedMessage, 156);
      })
    ).subscribe(bufferToSend => {
      this.socketObservable.next(bufferToSend);
    });
  }
}
