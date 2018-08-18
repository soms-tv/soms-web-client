import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';

import { ChatMessage } from './message/chat-message';
import { SharedService } from './shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatMessageObservable: Observable<ChatMessage>;

  constructor(private sharedService: SharedService) {
    this.chatMessageObservable = this.sharedService.getRoomMessages();
  }

  getChatMessages(): Observable<ChatMessage> {
    return this.chatMessageObservable;
  }
}
