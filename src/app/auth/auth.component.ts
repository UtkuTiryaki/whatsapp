import { Component, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  
  isLoginMode = false;
  error : string | null = null;
  authForm : FormGroup;
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router){
      this.authForm = new FormGroup({
      'email' : new FormControl(null, [Validators.required, Validators.email]),
      'password' : new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'name' : new FormControl(null)
    })
    this.userSub = this.authService.user.subscribe(user=> {
      this.isAuthenticated = !!user;
    })
    if(this.isAuthenticated){
      this.router.navigate(['./home']);
    }
  }

  onSubmit() {
    console.log(this.authForm);
    if (this.authForm.valid) {
      const email = this.authForm.get('email')?.value;
      const password = this.authForm.get('password')?.value;
      const name = this.authForm.get('name')?.value;

      let authObs: Observable<AuthResponseData>;

      if (this.isLoginMode) {
        authObs= this.authService.signUp(email, password, name);
      } else {
        authObs= this.authService.login(email, password)
      }

      authObs.subscribe(resData => {
            console.log(resData);
            this.router.navigate(['./home']);
            this.authForm.reset();
          },
          errorMessage => {
            console.log(errorMessage);
            this.error = errorMessage;
          }
          );
    }
    this.authForm.reset();
  }

  toggleMode() {
  this.isLoginMode = !this.isLoginMode;
 }

 ngOnDestroy(): void {
  if(this.userSub){
    this.userSub.unsubscribe();
  }
 }
  
}
