import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from "../message.model";
import { Observable, Subject, exhaustMap, map , take} from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Chat } from "../chat.model";

@Injectable({providedIn: 'root'})

export class ChatService {

 private newMessageSubject = new Subject<void>();
 public newMessageEvent = this.newMessageSubject.asObservable();

 constructor(private http: HttpClient, private authService: AuthService){}

 sendingMessage(message: string){
  const timestamp = new Date().toISOString();
  const sender = this.authService.getCurrentUser()?.uid;
  if(!sender){
    console.error('Sender UID not availiable');
    return;
  }

  const messageData: Message = { sender, content: message, timestamp: timestamp}
  this.http.post<{ name: string }>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/messages.json', messageData).subscribe(responseData => {
   console.log(responseData);
   this.newMessageSubject.next();
  },error => {
   console.log(error)
  });
 }

  fetchChat(): Observable<Chat[]> {
    return this.http.get<{ [key: string]: Chat }>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/chats.json').pipe(
      map(responseData => {
        const chatList: Chat[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            const chat: Chat = {
              chatId: key, // Setze den chatId
              participants: responseData[key].participants,
              lastMessage: {
                sender: responseData[key].lastMessage.sender,
                content: responseData[key].lastMessage.content,
                timeStamp: new Date(responseData[key].lastMessage.timeStamp)
              }
            };
            chatList.push(chat);
          }
        }
        return chatList;
      })
    );
  }
  
 }


