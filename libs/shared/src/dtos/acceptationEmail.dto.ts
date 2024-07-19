import { IsString, IsEmail, MinLength, IsNotEmpty, IsNumber } from "class-validator";


export class acceptationEmailDto {
    @IsNotEmpty()
    subject: string;
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    name: string;
    
}