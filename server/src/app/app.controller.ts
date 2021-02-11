import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import {
  ClientKafka,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { KAFKA_EVENTS, NAME_SERVICE_STARSHIP } from '../consts';
import {
  ComponentStatus,
  DataService,
  Starship,
  StarshipComponent,
} from '../data/data.service';
import { SocketsGateway } from '../sockets/sockets.gateway';
import { IncomingMessage } from '../types';

@Controller()
export class AppController {
  constructor(
    @Inject(NAME_SERVICE_STARSHIP) private kafkaClient: ClientKafka,
    private readonly dataService: DataService,
    private readonly socketsGateway: SocketsGateway,
  ) {}

  async onModuleInit() {
    const events = Object.values(KAFKA_EVENTS);

    events.forEach((event) => this.kafkaClient.subscribeToResponseOf(event));

    await this.kafkaClient.connect();
  }

  @Get('starships/:id')
  getStarship(@Param('id') id: string): Starship {
    return this.dataService.getStarship(id);
  }

  @Get('starships')
  getStarships(): Starship[] {
    return this.dataService.getStarships();
  }

  @Delete('starships/:id')
  deleteStarship(@Param('id') id: string) {
    this.dataService.removeStarship(id);
    this.socketsGateway.onStarshipDeleted(id);
  }

  @Post('starships')
  createStarship(@Body() body: Pick<Starship, 'name' | 'model'>) {
    const { model, name } = body;

    const starship = {
      model,
      name,
    };

    this.kafkaClient.emit(KAFKA_EVENTS.EVENT_STARSHIP_CREATED, starship);
  }

  @MessagePattern(
    KAFKA_EVENTS.EVENT_STARSHIP_COMPONENT_CREATED,
    Transport.KAFKA,
  )
  StarshipComponentCreated(
    @Payload()
    payload: IncomingMessage<{
      component: StarshipComponent;
      starshipId: string;
    }>,
  ) {
    const { component, starshipId } = payload.value;

    setTimeout(() => {
      const starship = this.dataService.updateComponent(
        starshipId,
        component,
        ComponentStatus.complete,
      );

      if (starship) {
        this.socketsGateway.onComponentCreated(starship);
      }
    }, 1000 * Math.random() * 10);
  }

  @MessagePattern(KAFKA_EVENTS.EVENT_STARSHIP_CREATED, Transport.KAFKA)
  StarshipCreated(
    @Payload() payload: IncomingMessage<Omit<Starship, 'id'>>,
  ): any {
    const { name, model } = payload.value;
    const starship = this.dataService.createStarship({ name, model });

    if (starship) {
      Object.keys(StarshipComponent).map((component) =>
        this.kafkaClient.emit(KAFKA_EVENTS.EVENT_STARSHIP_COMPONENT_CREATED, {
          component,
          starshipId: starship.id,
        }),
      );

      this.socketsGateway.onStarshipCreated(starship);
    }
  }
}
