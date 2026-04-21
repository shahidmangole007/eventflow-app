import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Request, UseGuards } from "@nestjs/common";
import { EventsService } from "./events.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateEventDto, UpdateEventDto } from "@app/common";


@Controller('events')
export class EventsContoller {

    constructor(private readonly eventsService: EventsService) { }

    @Get()
    findAll() {
        return this.eventsService.findAll()
    }

    // protected 
    @UseGuards(AuthGuard('jwt'))
    @Get('my-events')
    findMyEvents(@Request() req: { user: { userId: string } }) {
        return this.eventsService.findMyevents(req.user.userId)
    }

    // public  
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.eventsService.findOne(id) 
    }
 
    // protected - create event
    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(
        @Body() createEventDto : CreateEventDto ,
        @Request() req: { user: { userId: string ; role? : string } }
    ) {

    
        return this.eventsService.create(
            createEventDto , 
            req.user.userId , 
            req.user.role || 'USER'
        );
    }

    // protected - update event
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(
        @Param('id' , ParseUUIDPipe) id : string ,
        @Body() updateEventDto : UpdateEventDto ,
        @Request() req: { user: { userId: string ; role? : string } }
    ) {
        return this.eventsService.update(
            id,
            updateEventDto , 
            req.user.userId , 
            req.user.role || 'USER'
        );
    }



    // protected - publish event
    @UseGuards(AuthGuard('jwt'))
    @Post(':id/publish')
    publish(
        @Param('id' , ParseUUIDPipe) id : string ,
        @Request() req: { user: { userId: string ; role? : string } }
    ) {
        return this.eventsService.publish(
            id,
            req.user.userId , 
            req.user.role || 'USER'
        );
    }


    // protected - cancel event
    @UseGuards(AuthGuard('jwt'))
    @Post(':id/cancel')
    cancel(
        @Param('id' , ParseUUIDPipe) id : string ,
        @Request() req: { user: { userId: string ; role? : string } }
    ) {
        return this.eventsService.cancel(
            id,
            req.user.userId , 
            req.user.role || 'USER'
        );
    }

}