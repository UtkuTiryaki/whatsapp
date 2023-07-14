import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";

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

 constructor( private http: HttpClient ){}

 signUp(email: string, password: string) : Observable<AuthResponseData>{
  return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCcBISAJbMj_6zLF5uTnmJx5jsX4NOV3tA', {
   email: email,
   password: password,
   returnSecureToken: true
  }).pipe(catchError(this.handleError));
 }

 login(email: string, password: string): Observable<AuthResponseData> {
  return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY', {
    email: email,
    password: password,
    returnSecureToken: true
  }).pipe(
    catchError(this.handleError));
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

}