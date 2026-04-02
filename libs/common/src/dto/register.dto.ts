import { IsEmail, IsNotEmpty, IsString, IsStrongPassword , } from "class-validator"

export class RegisterDto {

    @IsEmail({} , { message: 'Invalid email address'})
    @IsNotEmpty({ message: 'Email is required'})
    email: string

    @IsString({ message: 'Password must be a string'})
    @IsNotEmpty({ message: 'Password is required'})
    @IsStrongPassword({},{ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'})
    password: string


    @IsString({ message: 'Name must be a string'})
    @IsNotEmpty({ message: 'Name is required'})
    name: string
}