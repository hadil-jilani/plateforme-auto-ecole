import { IsString, IsEmail, MinLength, IsNotEmpty, IsNumber, IsOptional, IsNumberString } from "class-validator";


export class NewtrainerDto {
    @IsOptional()
    schoolId: string
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    @IsNumberString()
    @MinLength(8)
    phoneNumber: string
    @IsOptional()
    unavailableSlots: string[];

}