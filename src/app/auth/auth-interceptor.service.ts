import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { HttpHandler, HttpParams, HttpRequest } from "@angular/common/http";
import { exhaustMap, take } from "rxjs";

@Injectable()
export class AuthInterceptorService{

 constructor(private authService: AuthService) {}

 intercept(req: HttpRequest<any>, next: HttpHandler){
  return this.authService.user.pipe(
   take(1),
   exhaustMap(user =>{
    if(!user){
     return next.handle(req);
    }
    const modifiedRequest= req.clone({
     params: new HttpParams().set('auth', user.token || '')
    })
    return next.handle(modifiedRequest);
   })
  )

 }

}