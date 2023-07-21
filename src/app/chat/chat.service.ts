import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from "../message.model";
import { Observable, Subject, catchError, exhaustMap, map , of, take} from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Chat } from "../chat.model";

@Injectable({providedIn: 'root'})

export class ChatService {

 private newMessageSubject = new Subject<void>();
 public newMessageEvent = this.newMessageSubject.asObservable();

 constructor(private http: HttpClient, private authService: AuthService){}

 sendingMessage(message: string, chatId: string){
  const timestamp = new Date().toISOString();
  const sender = this.authService.getCurrentUser()?.uid;
  if(!sender){
    console.error('Sender UID not availiable');
    return;
  }

  const messageData: Message = { sender, content: message, timestamp: timestamp, chatId: chatId}
  this.http.post<{ name: string }>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/messages.json', messageData).subscribe(responseData => {
   console.log(responseData);
   this.newMessageSubject.next();
  },error => {
   console.log(error)
  });
 }


  fetchChatMessages(chatId: string): Observable<Message[]> {
    return this.http.get<{[key: string]: Message}>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/messages.json')
    .pipe(
      map(
        responseData => {
          const messages: Message[] = [];
          for(const key in responseData){
            if(responseData.hasOwnProperty(key)){
              const message: Message = responseData[key];
              if(message.chatId === chatId){
                messages.push(message);
              } 
            }
          }
          return messages;
        }), 
        catchError(error => {
        console.error('Error fetching messages:', error);
        return of([]);
      })
    );
  }

  getSenderFromLocalStorage(): string | null {
    const currentUser = this.authService.getCurrentUser();
    if(currentUser){
      return currentUser.uid;
    }
    return null;
  } 

 }



