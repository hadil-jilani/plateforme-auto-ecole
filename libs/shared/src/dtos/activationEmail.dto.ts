import { IsString, IsEmail, MinLength, IsNotEmpty, IsNumber } from "class-validator";


export class activationEmailDto {
    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    activationCode: string;

}