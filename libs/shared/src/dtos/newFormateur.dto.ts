import { IsString, IsEmail, MinLength, IsNotEmpty, IsNumber, IsOptional, IsNumberString } from "class-validator";


export class NewformateurDto {
    @IsNotEmpty()
    ecoleId: string
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    @IsNumberString()
    @MinLength(8)
    phoneNumber: string
    @IsOptional()
    creneauxIndisponibles: string[];

}