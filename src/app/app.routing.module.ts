import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";


const appRoutes: Routes = [
{ path: '', redirectTo: '/auth', pathMatch: 'full'},
{ path: 'auth', component: AuthComponent},
{ path: 'home', component: HomeComponent, canActivate: [AuthGuard]}
];

@NgModule({ 
 imports: [RouterModule.forRoot(appRoutes)], 
 exports:[RouterModule]})

export class AppRoutingModule{}