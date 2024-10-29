// socket-client.service.ts
import { Injectable } from '@angular/core';
import { Client, IMessage, StompConfig } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class ChatWebSocketService {
  private client: Client;
  private token!: string;

  constructor() {
    this.client = new Client();
  }

  initialize(url: string, jwt: string) {
    this.token = jwt;

    this.client.configure({
      brokerURL: url,
      connectHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
      onConnect: () => {
        console.log('Connected!');
      },
      webSocketFactory: () => new SockJS(url),
    });

    this.client.activate();
  }

  publish(destination: string, body: any) {
    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  deactivate() {
    this.client.deactivate();
  }

  subscribe(topic: string, callback: (message: IMessage) => void, ...forMessageTypes: string[]) {
    return this.client.subscribe(topic, (message: IMessage) => {
      const messageBody = JSON.parse(message.body);
      if (!forMessageTypes || forMessageTypes.includes(messageBody.messageType)) {
        callback(message);
      }
    });
  }

  async awaitConnect(awaitConnectConfig?: { retries?: number; curr?: number; timeinterval?: number }) {
    const { retries = 3, curr = 0, timeinterval = 100 } = awaitConnectConfig || {};
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (this.connected) {
          resolve();
        } else {
          console.log('Failed to connect! Retrying...');
          if (curr >= retries) {
            console.log('Failed to connect within the specified time interval');
            reject();
          } else {
            this.awaitConnect({ retries, curr: curr + 1, timeinterval });
          }
        }
      }, timeinterval);
    });
  }

  get connected() {
    return this.client.connected;
  }

  get jwt() {
    return this.token;
  }

  set jwt(value: string) {
    this.token = value;
  }
}
