import { IsString, IsEmail, MinLength, IsNotEmpty, IsNumber, IsOptional } from "class-validator";


export class UpdateformateurDto {
    @IsNotEmpty()
    name?: string;
    @IsNotEmpty()
    email?: string;
    @IsOptional()
    creneauxIndisponibles?: string[];

}