import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { EventsContoller } from "./events.controller";
import { EventsService } from "./events.service";



@Module({
    imports : [HttpModule],
    controllers : [EventsContoller],
    providers :[EventsService]
})
export class EventsModule{

}