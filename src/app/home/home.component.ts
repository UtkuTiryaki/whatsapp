import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  
  newContactForm: FormGroup;
  isFormModalOpen= false;
  isAuthenticated = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.newContactForm = this.formBuilder.group({
      name: ['', Validators.required],
      id: ['', Validators.required]
   });
  }

  openFormModal(){
    this.isFormModalOpen = true;
  }

  closeFormModal(){
    this.isFormModalOpen = false;
  }

  saveForm(){
    if(this.newContactForm.valid){
      console.log(this.newContactForm.value);
      this.closeFormModal();
    }
  }

  logout(){
    this.authService.logout();
  }



}
