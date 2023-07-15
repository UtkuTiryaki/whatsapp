import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { User } from "../user.model";

@Injectable({providedIn: 'root'})

export class ChatsService{

 constructor(private http: HttpClient){}

}