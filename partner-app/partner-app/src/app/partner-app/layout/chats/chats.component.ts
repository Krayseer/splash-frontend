import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
//import {ChatWebSocketService} from "../../../services/chat-web-socket-service";
import {IMessage} from "@stomp/stompjs";
import {isPlatformBrowser} from "@angular/common";
import {ChatWebSocketService} from "../../../services/chat-web-socket-service";


export interface ChatMessage {
  sender: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent implements OnInit {

  messages: { sender: string; content: string }[] = [];
  messageContent: string = '';
  private subscription: any;
  private token: string | null = null;

  private socket!: WebSocket;

  constructor( @Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    // this.token = localStorage.getItem('token');
    // const socketUrl = 'http://localhost:8070/api/chat/ws';
    //
    // this.chatService.subscribe('/topic/yourTopic').subscribe(
    //   (response: any) => console.log(response)
    // );
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket('ws://localhost:8070/api/chat/ws');

    this.socket.onopen = (event) => {
      console.log('Connected to WebSocket', event);
    };

    this.socket.onclose = (event) => {
      console.log('Disconnected from WebSocket', event);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };
  }

  // sendMessage(): void {
  //   if (this.messageContent.trim() !== '') {
  //     const message = {
  //       sender: 'User1',
  //       content: this.messageContent
  //     };
  //
  //     // Отправка сообщения на сервер
  //     this.chatService.publish('/app/chat', message);
  //     this.messageContent = '';
  //   }
  // }
  //
  // ngOnDestroy(): void {
  //   if(this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  //   if (this.chatService) {
  //     this.chatService.deactivate();
  //   }
  // }

}
