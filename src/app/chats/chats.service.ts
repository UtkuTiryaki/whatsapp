import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, map, catchError, of, switchMap } from "rxjs";
import { UserData } from "../userdata.model";
import { Chat } from "../chat.model";
import { AuthService } from "../auth/auth.service";
import { ChatData } from '../chatdata.model';



@Injectable({providedIn: 'root'})

export class ChatsService{

 private newChatSubject = new Subject<void>();
 public newChatEvent = this.newChatSubject.asObservable();


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
   participants: {
    [user.uid]: true,
    [recipient.uid]: true
   },
   lastMessage: {
    sender: user.uid,
    content: '',
    timeStamp: new Date()
   }
  };
  this.http.post<{ name: string }>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/chats.json', chatData).subscribe(responseData=>{
   console.log('Chat wurde erstellt:' ,responseData.name);
   this.newChatSubject.next();
  }, error => {
   console.error('Fehler beim Erstellen:', error);
  })
 }

 fetchChat(): Observable<Chat[]>{
      return this.http.get<{[key:string]: Chat}>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/chats.json').pipe(
    map(responseData =>{
   const chatList: Chat []= [];
   for(const key in responseData){
    const currentUser = this.authService.getCurrentUser();
    if(currentUser){
      if(responseData.hasOwnProperty(key)){
        const chat: Chat = responseData[key];
        if(chat.participants && chat.participants[currentUser.uid]){
        chatList.push({ ...responseData[key]});
        }
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
          name: senderName 
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

private getUserNameFromUid(uid: string): Observable<string | null> {
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
      return null;
    }),
    catchError(error => {
      console.error('Fehler beim fetchen vom Namen', error);
      return of(null);
    })
  );
}


}

