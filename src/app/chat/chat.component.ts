import { Component , OnInit, OnDestroy} from '@angular/core';
import { ChatService } from './chat.service';
import { Message } from '../message.model';
import { Subscription, map } from 'rxjs';
import { Chat } from '../chat.model';
import { ChatData } from '../chatdata.model';
import { ChatsService } from '../chats/chats.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy{
  
  message : string = "";
  chat: Chat[] = [];
  chatListSubscription: Subscription = new Subscription;
  chatDataList: ChatData[] = []; // Hinzugefügt

  constructor( private chatService: ChatService, private chatsService: ChatsService){}

 
  ngOnInit() {
    this.chatListSubscription.add(
      this.chatService.newMessageEvent.subscribe(() => {
        this.fetchMessage();
      })
    );
    this.fetchMessage();
  }

  ngOnDestroy() {
    this.chatListSubscription.unsubscribe();
  }

  sendMessage() {
    this.chatService.sendingMessage(this.message);
    this.message = '';
  }

  fetchMessage() {
    this.chatService.fetchChat().subscribe(chats => {
      this.chat = chats;
      this.chatDataList = [];

      for (const chat of this.chat) {
        this.chatsService.getChatData(chat).subscribe(chatData => {
          if (chatData) {
            this.chatDataList.push(chatData);
          }
        });
      }

      console.log(this.chatDataList);
    });
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Monate sind nullbasiert, daher +1
    const year = date.getFullYear().toString().slice(-2); // Nur die letzten beiden Ziffern des Jahres
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${day}/${month}/${year}, ${hour}:${minute}`;
  }

    loadChatMessages(chatId: string) {
    // Hier implementieren wir die Logik, um die Chat-Nachrichten für den angegebenen chatId abzurufen
    // und die Nachrichten im Chat anzuzeigen.
  }

}
  
  

