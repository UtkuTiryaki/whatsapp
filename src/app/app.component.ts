import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'whatsapp-project';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  }

}
