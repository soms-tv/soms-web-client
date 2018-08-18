import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

import { CryptoService } from '../crypto.service';
import { handshakeFilter, roomFilter } from '../message/filters';

declare var TextEncoder: any;

@Injectable()
export class SharedService {
  roomName: string;
  roomPassword: string;
  serverAddress: string;
  socket: any;
  socketObservable: Observable<any>;
  private textEncoder: any;

  constructor(private cryptoService: CryptoService) {
    this.socketObservable = webSocket(this.socket);
    this.textEncoder = new TextEncoder();
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

        const sender = this.textEncoder.decode(senderBuffer).trim();
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
}
