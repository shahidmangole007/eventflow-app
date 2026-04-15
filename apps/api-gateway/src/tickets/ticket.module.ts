import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TicketController } from "./ticket.controller";
import { TicketService } from "./ticket.service";

@Module({
  imports: [HttpModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketsModule {}