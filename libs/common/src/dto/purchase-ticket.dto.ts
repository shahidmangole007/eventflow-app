import { IsEnum, IsInt, IsNotEmpty, IsUUID, Max, Min } from "class-validator";


export class PurchaseTicketDto {


    @IsUUID(4, { message: "eventId must be a valid UUID v4" })
    @IsNotEmpty({ message: "eventId is required" })
    eventId!: string;

    @IsInt({ message: "quantity must be an integer" })
    @Max(10, { message: "quantity cannot exceed 10" })
    @Min(1, { message: "quantity must be at least 1" })
    @IsNotEmpty({ message: "quantity is required" })
    quantity!: number;


    @IsNotEmpty({ message: "status is required" })
    @IsEnum(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CANCELED'], { message: "status must be one of: PENDING, CONFIRMED, CHECKED_IN, CANCELED" })
    status!: string;







}
