
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional , IsString, isString, max, MaxLength, Min } from "class-validator";


export class CreateEventDto {

    @IsNotEmpty({ message: "Title is required" })
    @IsString(  { message: "Title must be a string" })
    @MaxLength(255, { message: "Title must be less than or equal to 255 characters" })
    title : string;


    @IsOptional()
    @IsString(  { message: "Description must be a string" })
    description? : string;

    @IsDate({ message: "Date must be a valid date" })
    @IsNotEmpty({ message: "Date is required" })
    date : string;

    @IsString(  { message: "Location must be a string" })
    @IsNotEmpty({ message: "Location is required" })
    @MaxLength(255, { message: "Location must be less than or equal to 255 characters" })
    location : string;

    @IsNumber({}, { message: "Capacity must be a number" })
    @Min(1, { message: "Capacity must be at least 1" })
    capacity : number;



    @IsInt({ message: "Price must be an integer" })
    @Min(0, { message: "Price must be a positive number" })
    @IsOptional()
    price : number;
}
