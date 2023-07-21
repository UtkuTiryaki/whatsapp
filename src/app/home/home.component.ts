import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ChatsService } from '../chats/chats.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  

  isAuthenticated = false;
  isFormModalOpen = false;
  newContactForm: FormGroup = new FormGroup({
    email: new FormControl('')
  });
  private selectedChatIdSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private chatsService: ChatsService,
    private router: Router
  ) {
    this.newContactForm = this.formBuilder.group({
      email: ['']
    });
  }

  ngOnInit(): void {
    this.selectedChatIdSubscription = this.chatsService.chatEvent$.subscribe((newChatId) => {
      if (newChatId) {
        this.navigateToChat(newChatId);
      }
    });
  }

  ngOnDestroy(): void {
    this.selectedChatIdSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

  openFormModal() {
    this.isFormModalOpen = true;
  }

  closeFormModal() {
    this.isFormModalOpen = false;
  }

  newContact() {
    if (this.newContactForm.valid) {
      const email = this.newContactForm.value.email;
      this.chatsService.searchAndAddContact(email);
      this.closeFormModal();
    }
  }

  navigateToChat(chatId: string) {
    if (chatId) {
      this.router.navigate(['/home', chatId]);
    } else {
      this.router.navigate(['/home']);
    }
  }
}

