import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, concatAll, map } from "rxjs";
import { UserData } from "../userdata.model";
import { Chat } from "../chat.model";
import { AuthService } from "../auth/auth.service";



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

 fetchChat(){
  return this.http.get<{[key:string]: Chat}>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/chats.json').pipe(
    map(responseData =>{
   const chatList: Chat []= [];
   for(const key in responseData){
    if(responseData.hasOwnProperty(key)){
     chatList.push({ ...responseData[key]});
    }
    }
    return chatList;
   })
   );
 }

}

