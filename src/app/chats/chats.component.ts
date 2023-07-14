import { Component } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
  
  chats: User[] = []
  
}
