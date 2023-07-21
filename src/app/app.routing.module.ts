import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { ChatComponent } from "./chat/chat.component";


const appRoutes: Routes = [
{ path: '', redirectTo: '/auth', pathMatch: 'full'},
{ path: 'auth', component: AuthComponent},
{ path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
{ path: 'home/:chatId', component: HomeComponent, canActivate: [AuthGuard] }
];

@NgModule({ 
 imports: [RouterModule.forRoot(appRoutes)], 
 exports:[RouterModule]})

export class AppRoutingModule{}