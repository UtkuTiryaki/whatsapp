import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Contact} from "../contact.model";


@Injectable({providedIn: 'root'})

export class ChatsService{


 constructor(private http: HttpClient){}

 searchContact(email: string){
  const params = new HttpParams().set('search', email);
  return this.http.get<{[key:string]: Contact}>('https://whatsapp-project-90961-default-rtdb.firebaseio.com/users.json', { params }).pipe(
    map(responseData =>{
   const chats: Contact[]= [];
   for(const key in responseData){
    if(responseData.hasOwnProperty(key)){
     chats.push({ ...responseData[email], id: key});
    }
    }
    return chats;
   })
   );
 }

}