import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, pluck, switchMap, tap } from 'rxjs/operators';
import { Message, TYPE, User } from 'src/app/model/interfaces';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  user: User;
  contacts: User[] = [];
  message: string;
  TYPE = TYPE;
  @ViewChild(NgScrollbar, { static: false }) scrollbarRef: NgScrollbar;
  searchResults: User[] = [];
  selectedContact: User;
  hideChatHistory = false;
  hideChatDisplay = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private websocketService: WebsocketService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBarService: SnackBarService) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.websocketService.connect();
    });

    this.websocketService.getMessage().subscribe(message => {
      message.type = TYPE.RECEIVER;
      const contact = this.contacts.find(contact => contact.id === message.senderId);
      if (contact) {
        contact.messages.push(message);
        (this.selectedContact) ? this.scrollToBottom() : undefined;
      } else {
        this.userService.getUserById(message.senderId).subscribe(user => {
          user.messages = [];
          user.messages.push(message);
          user.newChat = true;
          this.contacts.push(user);
          this.snackBarService.openSnackBar(`New message received from ${user.firstName}`, 3000, 'center', 'bottom');
        });
      }
    });

  }

  ngAfterViewInit() {
    this.searchPeople();
  }

  public logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  public connect() {
    this.websocketService.connect();
  }

  public sendMessage(contact: User) {
    if (this.message !== "") {
      const message: Message = {
        senderId: this.user.id,
        receiverId: this.selectedContact.id,
        message: this.message,
        timestamp: new Date(),
        type: TYPE.SENDER
      };
      this.websocketService.sendMessage(contact.email, JSON.stringify(message));
      this.selectedContact.messages.push(message);
      this.message = "";
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    this.scrollbarRef.scrollTo({
      bottom: -50
    });
  }

  public selectUser(user: User) {
    user.newChat = false;
    this.selectedContact = user;
    this.changeDetectorRef.detectChanges();
    this.scrollToBottom();
  }

  public searchPeople() {
    let searchInput = document.getElementById("search-people");
    let searchText = "";
    fromEvent(searchInput, 'input')
      .pipe(
        pluck<any, string>('target', 'value'),
        tap(searchInput => {
          searchText = searchInput;
        }),
        filter(searchTerm => searchTerm.length > 2),
        debounceTime(800),
        distinctUntilChanged(),
        switchMap(searchTerm => this.userService.searchUsers(searchTerm))
      ).subscribe(data => {
        this.searchResults = (searchText.length > 2) ? data : [];
      });

    window.onclick = () => {
      this.searchResults = [];
    }

  }

  public getMessageType(message: Message, lastMessage: Message) {
    let messageType = undefined;
    if (message.type === TYPE.RECEIVER) {
      messageType = (lastMessage && lastMessage.type === TYPE.RECEIVER) ? 'receiver' : 'receiver-first'
      return messageType
    } else {
      messageType = (lastMessage && lastMessage.type === TYPE.SENDER) ? 'sender' : 'sender-first'
      return messageType;
    }
  }

  public initiateChat(user: User) {
    console.log("cliced");
    this.hideChatHistory = true;
    this.hideChatDisplay = false;
    user.messages = [];
    const exists = this.contacts.map(contact => contact.id).includes(user.id);
    if (!exists) {
      this.contacts.push(user);
      this.selectedContact = user;
    }
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }

}
