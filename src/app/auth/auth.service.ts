import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, catchError, tap, throwError } from "rxjs";
import { User } from "../user.model";
import { Router } from "@angular/router";
import { UserData } from "../userdata.model";

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
userData= new BehaviorSubject<UserData|null>(null);

private tokenExpirationTimer : any;

 constructor( private http: HttpClient, private router: Router ){}

signUp(email: string, password: string, name: string) : Observable<AuthResponseData>{
  return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCcBISAJbMj_6zLF5uTnmJx5jsX4NOV3tA', {
   email: email,
   password: password,
   returnSecureToken: true
  }).pipe(catchError(this.handleError), tap(resData=> {
    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    const newUser: UserData = {
      uid: resData.localId,
      email: resData.email,
      name: name
    };
    this.addUser(newUser).subscribe(()=> {
      console.log('Benutzer wurde der Datenbank hinzugefügt')
    }, error=> {
      console.error('Fehler beim Hinzufügen');
    })
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
  localStorage.removeItem('userData');
  if(this.tokenExpirationTimer){
    clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer= null;
  }
 }

 autoLogin(){
  const userDataString = localStorage.getItem('userData');
  let userData: {
    email: string;
    id: string;
    _token: string;
    _tokenExpirationDate: string;
  }
  if(userDataString){
    userData = JSON.parse(userDataString);
  } else{
    return;
  }
  const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate),'');
  if(loadedUser.token){
    this.user.next(loadedUser);
    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
  }
 }

 autoLogout(expirationDuration: number){
  this.tokenExpirationTimer = setTimeout(()=> {
    this.logout();
  }, expirationDuration);
 }

 getCurrentUser(){
  const userDataString = localStorage.getItem('userData');
  let userData: {
    email: string;
    id: string;
    _token: string;
    _tokenExpirationDate: string;
    name: string;
  }
  if(userDataString){
    userData = JSON.parse(userDataString);
  } else{
    return null;
  }
  const loadedUser : UserData = {
    uid: userData.id,
    email: userData.email,
    name: userData.name
  }
  return loadedUser;
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
  const user = new User(email, userId, token, expirationDate, '');
  this.user.next(user);
  this.autoLogout(expiresIn* 1000);
  localStorage.setItem('userData', JSON.stringify(user));
 }

  private addUser(user: UserData): Observable<any>{
  return this.http.post('https://whatsapp-project-90961-default-rtdb.firebaseio.com/users.json', user);
 }
}

