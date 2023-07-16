import { Component , OnInit, OnDestroy} from '@angular/core';
import { ChatService } from './chat.service';
import { Message } from '../message.model';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{
  
  message : string = "";
  chat: Message[] = [];

  constructor( private chatServive: ChatService){}

  ngOnInit(){
  /*this.fetchMessage();
  this.chatServive.newMessageEvent.subscribe(()=>{
    this.fetchMessage();
  })*/
 }

 /*
  sendMessage(){
    this.chatServive.sendingMessage(this.message);
    this.message = "";
  }

  fetchMessage(){
    this.chatServive.fetchMessage().pipe(map(responseData=>{
      const chat = [];
      for(const key in responseData){
        if(responseData.hasOwnProperty(key)){
          const post: Post ={
            message: responseData[key].message,
            timestamp: this.formatTimestamp(responseData[key].timestamp),
            id: key
          };
          chat.push(post);
        }
      }
      return chat;
    })).subscribe(chat=>{
      this.chat= chat;
    })
  }

  formatTimestamp(timestamp: string): string{
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Monate sind nullbasiert, daher +1
    const year = date.getFullYear().toString().slice(-2); // Nur die letzten beiden Ziffern des Jahres
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${day}/${month}/${year}, ${hour}:${minute}`;
  }
  */
  
}
