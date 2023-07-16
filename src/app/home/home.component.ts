import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ChatsService } from '../chats/chats.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isAuthenticated = false;
  isFormModalOpen = false;
  newContactForm: FormGroup = new FormGroup({
  email: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private chatsService: ChatsService) {
    this.newContactForm = this.formBuilder.group({
      email: ['']
    });
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
  }

