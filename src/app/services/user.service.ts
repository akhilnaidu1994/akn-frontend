import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../model/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public registerUser(user: User){
    return this.http.post<User>(`${this.baseUrl}/user/register`,user);
  }
}
