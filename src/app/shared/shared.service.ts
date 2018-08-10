import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  roomName: string;
  roomPassword: string;
  serverAddress: string;
  socket: any;
}
