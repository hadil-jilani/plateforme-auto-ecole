import { IsString, IsEmail, MinLength, IsNotEmpty, IsNumber, IsOptional } from "class-validator";


export class NewformateurDto {
    @IsNotEmpty()
    ecoleId: string
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    email: string;
    @IsOptional()
    creneauxIndisponibles: string[];

}