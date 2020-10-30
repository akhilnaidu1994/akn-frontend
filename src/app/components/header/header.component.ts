import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.isLoggedInObservable.subscribe(loggenIn => {
      this.isLoggedIn = loggenIn;
    });
  }

  public openRegister() {
    this.router.navigate(['/register']);
  }

  public logout() {
    this.userService.logout();
    this.router.navigate(['']);
  }

}
