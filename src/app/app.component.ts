import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'whatsapp-project';

  isLoginMode = false;
  error : string | null = null;
  authForm : FormGroup;

  constructor(private authService: AuthService){
      this.authForm = new FormGroup({
      'email' : new FormControl(null, [Validators.required, Validators.email]),
      'password' : new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {
    console.log(this.authForm);
    if (this.authForm.valid) {
      const email = this.authForm.get('email')?.value;
      const password = this.authForm.get('password')?.value;

      let authObs: Observable<AuthResponseData>;

      if (this.isLoginMode) {
        authObs= this.authService.login(email, password);
      } else {
        authObs= this.authService.signUp(email, password)
      }

      authObs.subscribe(resData => {
            console.log(resData);
          },
          errorMessage => {
            console.log(errorMessage);
            this.error = errorMessage;
          });
    }
    this.authForm.reset();
  }

  toggleMode() {
  this.isLoginMode = !this.isLoginMode;
 }

  

}
