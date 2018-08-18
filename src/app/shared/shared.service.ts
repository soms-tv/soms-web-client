import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable()
export class SharedService {
  roomName: string;
  roomPassword: string;
  serverAddress: string;
  socket: any;
  socketObservable: Observable<any>;

  constructor() {
    this.socketObservable = webSocket(this.socket);
  }

  getSocket(): Observable<any> {
    return this.socketObservable;
  }
}
