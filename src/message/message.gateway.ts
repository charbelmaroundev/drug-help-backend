import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { MessageService } from './message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messagesService: MessageService) {}

  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer() server;

  afterInit(server: any) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(client: any, data: { room: string }) {
    client.join(data.room);
    client.broadcast.to(data.room).emit('user joined');
  }

  @SubscribeMessage('message')
  handleChat(
    client: any,
    data: { room: string; user: string; message: string },
  ) {
    this.server
      .in(data.room)
      .emit('new message', { user: data.user, message: data.message });

    return this.messagesService.createMessage(data);
  }
}
