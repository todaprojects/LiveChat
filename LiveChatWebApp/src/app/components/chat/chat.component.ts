import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { HubConnection } from '@aspnet/signalr';
import { Message } from '../../interfaces/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('messageInput') inputElement: ElementRef;

  public user: string;
  public message: string;
  public errorMsg: string;
  public errorUser: string;
  public messages: Array<Message> = [];
  public nubConnection: HubConnection;

  constructor() {
  }

  ngOnInit(): void {
    this.nubConnection = new signalR.HubConnectionBuilder().withUrl('http://localhost:5000/chat').build();

    this.nubConnection.on('ReceiveMessage', (user, message, time) => {
      this.messages.unshift({user, message, time});
    });

    this.nubConnection.start().then(() => {
      console.log('Connection started');
    }).catch(err => {
      console.error(err.toString());
    });
  }

  async send(): Promise<void> {
    this.assignInputDefaultValues();
    this.inputElement.nativeElement.focus();
    if (this.areValidInputs()) {
      const time = (new Date()).toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ');
      this.nubConnection.invoke('SendMessage', this.user, this.message, time).catch((err) => {
        console.error(err.toString());
      });
      this.message = undefined;
    }
  }

  areValidInputs(): boolean {
    this.errorUser = this.user !== undefined ? undefined : 'should not be empty';
    this.errorMsg = this.message !== undefined ? undefined : 'should not be empty';
    return (this.errorUser === undefined && this.errorMsg === undefined);
  }

  assignInputDefaultValues(): void {
    this.user = this.user !== '' && this.user !== undefined ? this.user : undefined;
    this.message = this.message !== '' && this.message !== undefined ? this.message : undefined;
    this.errorMsg = undefined;
    this.errorUser = undefined;
  }
}
