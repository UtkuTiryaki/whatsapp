import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, map, catchError, of, switchMap } from "rxjs";
import { UserData } from "../userdata.model";
import { Chat } from "../chat.model";
import { AuthService } from "../auth/auth.service";
import { ChatData } from '../chatdata.model';
import { Message } from "../message.model";
import { ChatService } from "../chat/chat.service";




@Injectable({providedIn: 'root'})

export class ChatsService{

 private newChatSubject = new Subject<Chat>();
 public newChatEvent = this.newChatSubject.asObservable();

 private chatEventSubject: Subject<any> = new Subject<any>();
 chatEvent$ = this.chatEventSubject.asObservable();

 constructor(private http: HttpClient, private authService: AuthService){}

 searchAndAddContact(email: string) {
       const params = new HttpParams().set('search', email);
       this.http.get<{ [key: string]: UserData }>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/users.json', { params }).pipe(
         map(responseData => {
           const foundContacts: UserData[] = [];
           for (const key in responseData) {
             if (responseData.hasOwnProperty(key)) {
               const contact: UserData = responseData[key];
               if (contact.email === email) {
                 foundContacts.push({ ...contact});
               }
             }
           }
           return foundContacts;
         })
       ).subscribe(contacts => {
         console.log('Gefundene Kontakte:', contacts);
         const currentUser = this.authService.getCurrentUser();
         if (contacts.length > 0) {
           const currentUser = this.authService.getCurrentUser();
           if(currentUser){
            const contactId = contacts[0].uid;
           console.log(contacts[0]);
           this.createChat(currentUser, contacts[0]);
           }
         }
       }, error => {
         console.error('Fehler bei der Suche nach Kontakten', error);
       });
     } 

 createChat(user: UserData, recipient: UserData){
  const chatData: Chat = {
   chatId: '',
   participants: {
    [user.uid]: true,
    [recipient.uid]: true
   },
   lastMessage: {
    sender: user.uid,
    content: '',
    timeStamp: ''
   }
  };
  this.http.post<{ name: string }>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/chats.json', chatData).subscribe(responseData=>{
   console.log('Chat wurde erstellt:' ,responseData.name);
   chatData.chatId= responseData.name;
   this.newChatSubject.next(chatData);
  }, error => {
   console.error('Fehler beim Erstellen:', error);
  })
 }

  fetchChat(): Observable<Chat[]> {
    return this.http.get<{ [key: string]: Chat }>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/chats.json').pipe(
      map(responseData => {
        const currentUserUid = this.authService.getCurrentUser()?.uid;
        const chatList: Chat[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            const chat: Chat = {
              chatId: key, // Setze den chatId
              participants: responseData[key].participants,
              lastMessage: {
                sender: responseData[key].lastMessage.sender,
                content: responseData[key].lastMessage.content,
                timeStamp: responseData[key].lastMessage.timeStamp
              }
            };
            if(currentUserUid && chat.participants[currentUserUid]){
              chatList.push(chat);
            }
          }
        }
        return chatList;
      })
    );
  }

  getChatData(chat: Chat): Observable<ChatData | null> {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.uid) {
      const participantUid = Object.keys(chat.participants).find((uid) => uid !== currentUser.uid);
      if (!participantUid) {
        return of(null);
      }
      return this.getUserNameFromUid(participantUid).pipe(
        switchMap((senderName: string | null) => {
          if (senderName === null) {
            return of(null); // Wenn kein Name gefunden wurde, gib null zurück
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
    }
    return of(null);
  }


  emitChatEvent(chatId: string){
    this.chatEventSubject.next(chatId);
  }


  getUserNameFromUid(uid: string): Observable<string> {
    return this.http.get<{ [key: string]: UserData }>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/users.json').pipe(
      map(responseData => {
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            const user = responseData[key];
            if (user.uid === uid) {
              return user.name;
            }
          }
        }
        return 'Unknown';
      }),
      catchError(error => {
        console.error('Fehler beim fetchen vom Namen', error);
        return of('Unknown');
      })
    );
  }

  getLatestMessage(chatId: string) : Observable<Message | null>{
    return this.fetchChatMessages(chatId).pipe(
      map((messages: Message[]) => {
        if (messages.length === 0){
          return null;
        }
        const sortedMessages = messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        console.log(sortedMessages);
        return sortedMessages[0];
      })
    );
  }

   private fetchChatMessages(chatId: string): Observable<Message[]> {
    return this.http
      .get<{ [key: string]: Message }>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/messages.json')
      .pipe(
        map((responseData) => {
          const messages: Message[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              const message: Message = responseData[key];
              if (message.chatId === chatId) {
                messages.push(message);
              }
            }
          }
          return messages;
        }),
        catchError((error) => {
          console.error('Error fetching messages:', error);
          return of([]);
        })
      );
  }

  

}

