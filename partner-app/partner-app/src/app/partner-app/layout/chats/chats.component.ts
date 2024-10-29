import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {ChatWebSocketService} from "../../../services/chat-web-socket-service";
import {IMessage} from "@stomp/stompjs";
import {isPlatformBrowser} from "@angular/common";


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
export class ChatsComponent implements OnInit, OnDestroy {

  messages: { sender: string; content: string }[] = [];
  messageContent: string = '';
  private subscription: any;
  private token: string | null = null;

  constructor(private chatService: ChatWebSocketService, @Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    // Проверяем, выполняется ли код в браузере
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token');
      const socketUrl = 'http://localhost:8080/ws';

      this.chatService.initialize(socketUrl, this.token!);

      this.subscription = this.chatService.subscribe('/topic/messages', (message: IMessage) => {
        const messageBody = JSON.parse(message.body);
        this.messages.push({ sender: messageBody.sender, content: messageBody.content });
      });
    }
  }

  sendMessage(): void {
    if (this.messageContent.trim() !== '') {
      const message = {
        sender: 'User1',
        content: this.messageContent
      };

      // Отправка сообщения на сервер
      this.chatService.publish('/app/chat', message);
      this.messageContent = '';
    }
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.chatService) {
      this.chatService.deactivate();
    }
  }

}
