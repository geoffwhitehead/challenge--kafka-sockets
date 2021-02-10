import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
    @Inject(NAME_SERVICE_STARSHIP) private client: ClientKafka,


}
