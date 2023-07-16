import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatsService } from './chats.service';
import { Chat } from '../chat.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit, OnDestroy{

  chatList: Chat[] = [];
  private chatListSubscription: Subscription = new Subscription();

  constructor(private chatsService: ChatsService){}



  ngOnInit(): void {
    this.fetchChat();
    this.chatListSubscription = this.chatsService.newChatEvent.subscribe(()=>{
    this.fetchChat();
  })
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

  getParticipantUids(chat: Chat):string[] {
    return Object.keys(chat.participants);
  }

}
