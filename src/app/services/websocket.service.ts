import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import webstomp, { Client } from 'webstomp-client';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private baseUrl = environment.baseUrl;
  private jwtToken: string;
  private stompClient: Client;

  constructor() {
    this.jwtToken = localStorage.getItem('token');
  }

  public connect() {
    const socket = new SockJS(`${this.baseUrl}/akn-chat`);
    this.stompClient = webstomp.over(socket);
    this.stompClient.connect({
      'Authorization': this.jwtToken
    }, () => {
      console.log("CONNECTED");

      this.stompClient.subscribe(`/user/exchange/amq.direct/chat-updates`, (message) => {
        console.log(message);
      });

    });


  }

  public sendMessage(username: string, message: string) {
    this.stompClient.send(`/user/${username}/exchange/amq.direct/chat-updates`, message);
  }
}
