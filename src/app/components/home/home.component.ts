import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { Message, TYPE, User } from 'src/app/model/interfaces';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: User;
  message: string;
  messages: Message[] = [];
  TYPE = TYPE;
  lastMessageType: TYPE = null;
  @ViewChild(NgScrollbar) scrollbarRef: NgScrollbar;

  constructor(
    private router: Router,
    private userService: UserService,
    private websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.user = user;
    });

    this.messages.push({
      message: 'how are you',
      time: new Date(),
      type: TYPE.RECEIVER
    });
    this.messages.push({
      message: 'i am fine',
      time: new Date(),
      type: TYPE.SENDER
    });
  }

  public logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  public connect() {
    this.websocketService.connect();
  }

  public sendMessage() {
    // this.websocketService.sendMessage('akhilnaidu1994@gmail.com', this.message);
    this.messages.push({
      message: this.message,
      time: new Date(),
      type: TYPE.SENDER
    });
    this.scrollbarRef.scrollTo({
      bottom: -50
    });
    this.message = "";
  }

  public getMessageType(message: Message) {
    let messageType = undefined;
    if (message.type === TYPE.RECEIVER) {
      messageType = this.lastMessageType === TYPE.RECEIVER ? 'receiver' : 'receiver-first';
      this.lastMessageType = TYPE.RECEIVER
      return messageType
    } else {
      messageType = this.lastMessageType === TYPE.SENDER ? 'sender' : 'sender-first';
      this.lastMessageType = TYPE.SENDER;
      return messageType;
    }
  }

}
