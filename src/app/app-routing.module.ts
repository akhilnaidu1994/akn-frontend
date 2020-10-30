import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { RouteGuardService } from './services/route-guard.service';

const routes: Routes = [
  {
    path: "", component: HeaderComponent, children: [
      { path: "register", component: RegisterComponent },
      { path: "login", component: LoginComponent }
    ]
  },
  { path: "home", component: HomeComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
