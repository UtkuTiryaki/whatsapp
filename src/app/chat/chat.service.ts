import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from "../message.model";
import { Observable, Subject, catchError, exhaustMap, map , of, switchMap, take} from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Chat } from "../chat.model";
import { User } from "../user.model";
import { UserData } from "../userdata.model";
import { ChatsService } from "../chats/chats.service";
import { ChatData } from "../chatdata.model";

@Injectable({providedIn: 'root'})

export class ChatService {

 private newMessageSubject = new Subject<void>();
 public newMessageEvent = this.newMessageSubject.asObservable();

 constructor(private http: HttpClient, private authService: AuthService, private chatsService: ChatsService){}

 sendingMessage(message: string, chatId: string){
  const timestamp = new Date().toISOString();
  const sender = this.authService.getCurrentUser()?.uid;
  if(!sender){
    console.error('Sender UID not availiable');
    return;
  }
  const senderName$ = this.chatsService.getUserNameFromUid(sender);
  senderName$.pipe(
    switchMap(senderName => {
      const messageData: Message = {
        sender,
        content: message,
        timestamp: timestamp,
        chatId: chatId,
        senderName: senderName 
      };
      return this.http.post<{ name: string }>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/messages.json', messageData);
    })
  ).subscribe(
    responseData => {
      console.log(responseData);
      this.newMessageSubject.next();
    },
    error => {
      console.error(error);
    }
  );
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

  getChatData(chatId: string): Observable<ChatData | null> {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.uid) {
      return this.getChatById(chatId).pipe(
        switchMap((chat: Chat | null) => {
          if(!chat){
            return of(null);
          }
      const participantUid = Object.keys(chat.participants).find((uid) => uid !== currentUser.uid);
      if (!participantUid) {
        return of(null);
      }

      return this.chatsService.getUserNameFromUid(participantUid).pipe(
        switchMap((senderName: string | null) => {
          if (senderName === null) {
            return of(null);
          }
          const chatData: ChatData = {
            content: chat.lastMessage.content,
            sender: chat.lastMessage.sender,
            timeStamp: chat.lastMessage.timeStamp,
            participant: participantUid,
            name: senderName,
            chatId: chat.chatId
          };
          return of(chatData);
        }),
        catchError(error => {
          console.error('Fehler beim fetchen vom Namen', error);
          return of(null);
        })
      );
    }), catchError(error => {
      console.error('Error fetching chat by ID:', error);
      return of(null);
    })
    );
  }
  return of(null);
  }

  private getChatById(chatId: string): Observable<Chat | null> {
    return this.http.get<{ [key: string]: Chat }>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/chats.json').pipe(
      map(responseData => {
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            const chat = responseData[key];
            if (key === chatId) {
              return chat;
            }
          }
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching chat by ID:', error);
        return of(null);
      })
    );
  }



 }



