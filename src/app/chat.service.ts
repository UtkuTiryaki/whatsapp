import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Post } from "./post.model";
import { Subject, map } from "rxjs";

@Injectable({providedIn: 'root'})

export class ChatService {

 private newMessageSubject = new Subject<void>();
 public newMessageEvent = this.newMessageSubject.asObservable();

 constructor(private http: HttpClient){}

 sendingMessage(message: string){
  const timestamp = new Date().toISOString();
  const Postdata: Post = { message: message, timestamp: timestamp}
  this.http.post<{ name: string }>
  ('https://whatsapp-project-90961-default-rtdb.firebaseio.com/messages.json', Postdata).subscribe(responseData => {
   console.log(responseData);
   this.newMessageSubject.next();
  },error => {
   console.log(error)
  });
 }

 fetchMessage(){
  return this.http.get<{[key:string]: Post}>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/messages.json').pipe(map(responseData =>{
   const chat: Post []= [];
   for(const key in responseData){
    if(responseData.hasOwnProperty(key)){
     chat.push({ ...responseData[key], id: key});
    }
   }
   return chat;
  }))
 }

}