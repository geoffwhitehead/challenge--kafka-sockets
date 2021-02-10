import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import {
  ComponentStatus,
  DataService,
  Starship,
  StarshipComponent,
} from 'src/data/data.service';
import { AppGateway } from './app.gateway';
import { KAFKA_EVENTS, NAME_SERVICE_STARSHIP } from './consts';
import { EventsService } from './events/events.service';
import { IncomingMessage } from './types';

@Controller()
export class AppController {
  constructor(
    @Inject(NAME_SERVICE_STARSHIP) private client: ClientKafka,
    private readonly starshipService: DataService,
    private readonly appGateway: AppGateway,
    private readonly kafkaService: EventsService,
  ) {}

  async onModuleInit() {
    const events = Object.values(KAFKA_EVENTS);

    await events.forEach(async (event) => {
      await this.client.subscribeToResponseOf(event);
    });
  }

  /**
   * Routes
   */
  @Get('starships')
  getStarships(): Starship[] {
    return Object.values(this.starshipService.getStarships());
  }

  @Delete('starships/:id')
  deleteStarship(@Param('id') id) {
    this.starshipService.removeStarship(id);
    this.appGateway.onStarshipDeleted(id);
  }

  @Post('starships')
  createStarship(@Body() body: Omit<Starship, 'id'>): Omit<Starship, 'id'> {
    const { model, name } = body;

    const starship = {
      model,
      name,
    };

    this.client.emit(KAFKA_EVENTS.EVENT_STARSHIP_CREATED, starship);
    return starship;
  }

  /**
   * Event Handlers
   */

  /**
   * Event Handler - part of the creation process for a starship
   * @param payload Event
   */
  @MessagePattern(KAFKA_EVENTS.EVENT_STARSHIP_COMPONENT_CREATED)
  StarshipComponentCreated(
    @Payload()
    payload: IncomingMessage<{
      component: StarshipComponent;
      starshipId: string;
    }>,
  ) {
    const { component, starshipId } = payload.value;

    setTimeout(() => {
      const starship = this.starshipService.updateComponent(
        starshipId,
        component,
        ComponentStatus.complete,
      );

      if (starship) {
        this.appGateway.onComponentCreated(starship);
      }
    }, 1000 * Math.random() * 10);
  }

  @MessagePattern(KAFKA_EVENTS.EVENT_STARSHIP_CREATED)
  StarshipCreated(
    @Payload() payload: IncomingMessage<Omit<Starship, 'id'>>,
  ): any {
    const { name, model } = payload.value;
    const starship = this.starshipService.createStarship({ name, model });

    Object.keys(StarshipComponent).map((component) =>
      this.client.emit(KAFKA_EVENTS.EVENT_STARSHIP_COMPONENT_CREATED, {
        component,
        starshipId: starship.id,
      }),
    );

    this.appGateway.onStarshipCreated(starship);
  }
}
