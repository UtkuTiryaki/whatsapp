import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  
  isAuthenticated = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {

  }

  

  logout(){
    this.authService.logout();
  }



}
