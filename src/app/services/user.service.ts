import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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

  constructor(private http: HttpClient) {
    this.jwtToken = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refresh_token');
    if (this.jwtToken && this.refreshToken)
      this.$isLoggedInSubject.next(true);
  }

  public registerUser(user: User) {
    return this.http.post<User>(`${this.baseUrl}/user/register`, user);
  }

  public login(user: User) {
    return this.http
      .post(`${this.baseUrl}/login`, user, { observe: 'response' })
      .pipe(
        tap(response => {
          this.jwtToken = response.headers.get('token');
          this.refreshToken = response.headers.get('refresh_token');
          this.$isLoggedInSubject.next(true);
          localStorage.setItem("token", this.jwtToken);
          localStorage.setItem("refresh_token", this.refreshToken);
        })
      );
  }

  public getUser() {
    return this.http.get<User>(`${this.baseUrl}/user`);
  }

  public refreshUserToken() {

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'text/plain; charset=utf-8');
    return this.http
      .post(`${this.baseUrl}/user/token/refresh`, {}, { headers, responseType: 'text' })
      .pipe(
        tap(data => this.jwtToken = data),
        tap(data => localStorage.setItem('token', data)),
        catchError(err => { this.logout(); return err })
      );
  }

  public logout() {
    this.jwtToken = null;
    this.refreshToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    this.$isLoggedInSubject.next(false);
  }

  get getJwtToken() {
    return this.jwtToken;
  }

  get getRefreshToken() {
    return this.refreshToken;
  }

  get isLoggedIn() {
    return (this.jwtToken) ? true : false;
  }

  get isLoggedInObservable() {
    return this.$isLoggedInSubject.asObservable();
  }
}
