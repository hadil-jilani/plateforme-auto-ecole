import { IsString, IsEmail, MinLength, IsNotEmpty, IsNumber, IsOptional, IsNumberString, isNotEmpty } from "class-validator";


export class NewApprenantDto {

    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsNumberString()
    @MinLength(8)
    phoneNumber: string

}