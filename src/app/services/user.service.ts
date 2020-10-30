import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { observeOn, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../model/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.baseUrl;

  private jwtToken: string = null;

  private refreshToken: string = null;

  private $isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  public registerUser(user: User) {
    return this.http.post<User>(`${this.baseUrl}/user/register`, user);
  }

  public login(user: User) {
    console.log(user);
    return this.http
      .post(`${this.baseUrl}/login`, user, { observe: 'response' })
      .pipe(
        tap(response => {
          this.jwtToken = response.headers.get('token');
          this.refreshToken = response.headers.get('refresh_token');
          this.$isLoggedInSubject.next(true);
        })
      );
  }

  public logout() {
    this.jwtToken = null;
    this.refreshToken = null;
    this.$isLoggedInSubject.next(false);
  }

  get getJwtToken() {
    return this.jwtToken;
  }

  get regreshToken() {
    return this.refreshToken;
  }

  get isLoggedIn() {
    return (this.jwtToken) ? true : false;
  }

  get isLoggedInObservable() {
    return this.$isLoggedInSubject.asObservable();
  }
}
