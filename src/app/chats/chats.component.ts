import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatsService } from './chats.service';
import { Chat } from '../chat.model';
import { Subscription } from 'rxjs';
import { ChatData } from '../chatdata.model';


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

  constructor(private chatsService: ChatsService){
  }



ngOnInit(): void {
  this.chatListSubscription.add(
    this.chatsService.newChatEvent.subscribe(() => {
      this.chatsService.fetchChat();
    })
  );
  this.chatsService.fetchChat();

  this.chatListSubscription.add(
    this.chatsService.fetchChat().subscribe((chats) => {
      this.chatList = chats;
      this.chatDataList = [];

      for (const chat of this.chatList) {
        this.chatsService.getChatData(chat).subscribe((chatData) => {
          if (chatData) {
            this.chatDataList.push(chatData);
          }
        });
      }

      console.log(this.chatDataList);
    })
  );
}



  ngOnDestroy(){
    this.chatListSubscription.unsubscribe();
  }


  fetchChat(){
    this.chatsService.fetchChat().subscribe(chats => {
      this.chatList = chats;
      console.log('Chatliste:', this.chatList);
    }, error => {
      console.error('Fehler beim Abrufen der Chatliste:', error);
    })
  }

}
