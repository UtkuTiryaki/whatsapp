import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponseData{
 idToken: string;
 email: string;
 refreshToken: string;
 expiresIn: string;
 localId: string;
 registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService{

  user= new BehaviorSubject<User|null>(null);

 constructor( private http: HttpClient, private router: Router ){}

 signUp(email: string, password: string) : Observable<AuthResponseData>{
  return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCcBISAJbMj_6zLF5uTnmJx5jsX4NOV3tA', {
   email: email,
   password: password,
   returnSecureToken: true
  }).pipe(catchError(this.handleError), tap(resData=> {
    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
  }));
 }

 login(email: string, password: string): Observable<AuthResponseData> {
  return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCcBISAJbMj_6zLF5uTnmJx5jsX4NOV3tA', {
    email: email,
    password: password,
    returnSecureToken: true
  }).pipe(
    catchError(this.handleError), tap(resData=> {
    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
 }

 logout(){
  this.user.next(null);
  this.router.navigate(['']);
 }

 private handleError(errorRes: HttpErrorResponse){
  let errorMessage = 'An unknown error occurred';
  if (errorRes.error && errorRes.error.error) {
   switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS': 
     errorMessage = 'This email exists already';
     break;
    case 'EMAIL_NOT_FOUND':
     errorMessage = 'Email not found'
     break;
    case 'INVALID_PASSWORD':
     errorMessage = 'Invalid email or password';
     break;
    case 'USER_DISABLED':
     errorMessage = 'User account is disabled';
     break;
    }
   }
  return throwError(errorMessage);
 }

 private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  this.user.next(user);
 }

}