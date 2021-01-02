import { Injectable } from '@angular/core';
import { observable, Observable, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import webstomp, { Client } from 'webstomp-client';
import { Message } from '../model/interfaces';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private baseUrl = environment.baseUrl;
  private jwtToken: string;
  private stompClient: Client;
  private message = new Subject<Message>();

  constructor() {
  }

  public connect() {
    this.jwtToken = localStorage.getItem('token');
    const socket = new SockJS(`${this.baseUrl}/akn-chat`);
    this.stompClient = webstomp.over(socket);
    this.stompClient.connect({
      'Authorization': this.jwtToken
    }, () => {
      console.log("CONNECTED");

      this.stompClient.subscribe(`/user/exchange/amq.direct/chat-updates`, (message) => {
        console.log(message);
        this.message.next(JSON.parse(message.body))
      });

    }, err => {
      console.log(err)
    });


  }

  public disconnect() {
    this.stompClient.disconnect();
  }

  public sendMessage(username: string, message: string) {
    this.stompClient.send(`/user/${username}/exchange/amq.direct/chat-updates`, message);
  }

  public getMessage() {
    return this.message.asObservable();
  }
}
