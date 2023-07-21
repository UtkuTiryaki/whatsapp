import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatsService } from './chats.service';
import { Chat } from '../chat.model';
import { Subject, Subscription, tap } from 'rxjs';
import { ChatData } from '../chatdata.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})

export class ChatsComponent implements OnInit, OnDestroy{

  chatList: Chat[] = [];
  private chatListSubscription: Subscription = new Subscription();
  chatData: ChatData;
  chatDataList : ChatData[] = [];
  selectedChatId: string | null = null;

  constructor(private chatsService: ChatsService, private router: Router){
  }



  ngOnInit(): void {
    this.fetchChatList();
    this.chatListSubscription.add(
      this.chatsService.newChatEvent.pipe(
        tap((newChat) => {
          this.chatList.push(newChat);
          this.fetchChatList();
        })
      ).subscribe()
    );
  } 
  
  ngOnDestroy(){
    this.chatListSubscription.unsubscribe();
  }


  emitChatId(chatId: string){
    this.chatsService.emitChatEvent(chatId);
    console.log(chatId);
  }

  private fetchChatList(){
    this.chatListSubscription.add(
      this.chatsService.fetchChat().subscribe((chats) => {
        this.chatList = chats;
        this.chatDataList = [];
        for(const chat of this.chatList){
          this.chatsService.getChatData(chat).subscribe((chatData) => {
            if(chatData){
              this.chatDataList.push(chatData);
            }
          });
        }
      })
    );
  }

}
