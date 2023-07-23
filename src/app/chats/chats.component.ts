import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatsService } from './chats.service';
import { Chat } from '../chat.model';
import { Observable, Subject, Subscription, tap } from 'rxjs';
import { ChatData } from '../chatdata.model';
import { Router } from '@angular/router';
import { Message } from '../message.model';
import { AuthService } from '../auth/auth.service';
import { ChatService } from '../chat/chat.service';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})

export class ChatsComponent implements OnInit, OnDestroy{

  chatList: Chat[] = [];
  latestMessages: { [chatId: string]: Message | null } = {};
  private chatListSubscription: Subscription = new Subscription();
  chatData: ChatData;
  chatDataList : ChatData[] = [];
  selectedChatId: string | null = null;
  latestMessage$: Observable<Message | null>

  constructor(private chatsService: ChatsService, private router: Router, private authService: AuthService, private chatService: ChatService){
  }



  ngOnInit(): void {
    this.fetchChatList();
    this.chatListSubscription.add(
      this.chatsService.newChatEvent.subscribe((newMessage) => { // Change newChat to newMessage
        this.chatsService.getLatestMessage(newMessage.chatId).subscribe((latestMessage) => {
          const chatData: ChatData = {
            chatId: newMessage.chatId, // Change newChat to newMessage
            content: latestMessage?.content || '',
            sender: latestMessage?.sender || '',
            timeStamp: latestMessage?.timestamp || '',
            participant: Object.keys(newMessage.participants)[0], // Change newChat to newMessage
            name: ''
          };
          this.getNameOfChatData(newMessage).subscribe((name) => { // Change newChat to newMessage
            chatData.name = name || ''
          });
          this.chatDataList.push(chatData);
        })
      })
    );
  }


    
  ngOnDestroy(){
    this.chatListSubscription.unsubscribe();
  }


  emitChatId(chatId: string){
    this.chatsService.emitChatEvent(chatId);
  }

  private fetchChatList() {
    this.chatListSubscription.add(
      this.chatsService.fetchChat().subscribe((chats) => {
        this.chatList = chats;
        this.chatDataList = [];
        for (const chat of this.chatList) {
          const chatData: ChatData = {
            chatId: chat.chatId,
            content: chat.lastMessage.content,
            sender: chat.lastMessage.sender,
            timeStamp: chat.lastMessage.timeStamp, // Change timeStamp to timestamp
            participant: Object.keys(chat.participants)[0],
            name: '',
          };
          this.getNameOfChatData(chat).subscribe((name) => {
            chatData.name = name || ''
          });
          this.chatDataList.push(chatData);
          this.chatsService.getLatestMessage(chatData.chatId).subscribe((latestMessage: Message | null) => {
            if (latestMessage) {
              chatData.content = latestMessage.content || '';
              chatData.sender = latestMessage.senderName || '';
              chatData.timeStamp = latestMessage.timestamp || '';
            }
          });
        }
      })
    );
  }

  private getNameOfChatData(chat: Chat) : Observable<string>{
    const userData = this.authService.getCurrentUser();
    const userUid = userData?.uid;
    if(userUid){
      for(const uid of Object.keys(chat.participants)){
        if(uid !== userUid){
          return this.chatsService.getUserNameFromUid(uid);
        }
      }
    }
    return null;
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

}
