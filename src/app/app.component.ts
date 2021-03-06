import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  public ngOnInit(): void {
    const navigationPath = (this.userService.isLoggedIn) ? '/home' : '/login';
    this.router.navigate([navigationPath]);
  }

}
