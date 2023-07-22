import { Component , OnInit, OnDestroy, Input} from '@angular/core';
import { ChatService } from './chat.service';
import { Message } from '../message.model';
import { Observable, Subscription, map, of, catchError, switchMap } from 'rxjs';
import { Chat } from '../chat.model';
import { ChatData } from '../chatdata.model';
import { ChatsService } from '../chats/chats.service';
import { ActivatedRoute, Router } from '@angular/router';
import { splitNsName } from '@angular/compiler';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy{
  
  message : string = '';
  chatListSubscription: Subscription = new Subscription();
  chatMessages: Message[] = [];
  selectedChatId: string | null = null;
  chatData$: Observable<ChatData | null>;

  constructor( private chatService: ChatService, private chatsService: ChatsService, private route: ActivatedRoute, private router: Router, private authService: AuthService){}

 
  ngOnInit() {
    this.route.params.subscribe((params) => {
      const chatId = params['chatId'];
      if(chatId){
        this.chatData$ = this.chatService.getChatData(chatId);
        this.loadChatMessages(chatId);
        this.selectedChatId = chatId;
      }
    });
    this.chatListSubscription.add(
      this.chatService.newMessageEvent.subscribe(() => {
        if(this.selectedChatId){
          this.loadChatMessages(this.selectedChatId);
        }
      })
    );
    if(this.selectedChatId){
      this.loadChatMessages(this.selectedChatId);
    }
  }

  ngOnDestroy() {
    this.chatListSubscription.unsubscribe();
  }

  sendMessage() {
  if (!this.selectedChatId) {
      console.error('No chat selected.');
      return;
    }
    this.chatService.sendingMessage(this.message, this.selectedChatId);
    this.message = '';
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
    this.chatService.fetchChatMessages(chatId).subscribe((messages) => {
      this.chatMessages = messages;
    });
  }

  isCurrentUser(senderId: string): boolean {
    const currentUserUid = this.chatService.getSenderFromLocalStorage();
    return senderId === currentUserUid;
  }

}
  
  

