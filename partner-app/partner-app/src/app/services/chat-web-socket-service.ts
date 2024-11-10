import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService {
  private client: Client;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:64691/api/chat/ws', // Замените на ваш URL
      // Добавьте другие параметры, если необходимо
      debug: (str) => { console.log(str); },
      reconnectDelay: 5000,
    });

    this.client.activate();
  }

  subscribe(topic: string): Observable<any> {
    return new Observable(observer => {
      const subscription = this.client.subscribe(topic, message => {
        observer.next(JSON.parse(message.body));
      });

      // Возвращаем функцию отписки
      return () => subscription.unsubscribe();
    });
  }
}
