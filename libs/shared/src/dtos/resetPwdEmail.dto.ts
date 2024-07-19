import { IsString, IsEmail, MinLength, IsNotEmpty, IsNumber } from "class-validator";


export class resetPwdEmailDto {
    @IsNotEmpty()
    subject: string;
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    url: string;
    
}