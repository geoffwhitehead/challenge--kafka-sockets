import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { appConfig } from 'config';
import { SOCKET_EVENTS } from './consts';
import { Starship } from './data/data.service';

@WebSocketGateway(appConfig.WS_PORT)
export class AppGateway {
  @WebSocketServer() private server;

  onComponentCreated = (starship: Starship) =>
    this.server.emit(SOCKET_EVENTS.ON_COMPONENT_CREATED, starship);

  onStarshipDeleted = (starshipId: string) =>
    this.server.emit(SOCKET_EVENTS.ON_REMOVE, starshipId);

  onStarshipCreated = (starship: Starship) =>
    this.server.emit(SOCKET_EVENTS.ON_CREATE, starship);
}
