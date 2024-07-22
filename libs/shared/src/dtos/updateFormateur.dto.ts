import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsEmail, IsOptional } from "class-validator";
import { NewformateurDto } from "./newFormateur.dto";

export class UpdateFormateurDto extends PartialType(NewformateurDto) {}

/* export class UpdateformateurDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsOptional()
    creneauxIndisponibles?: string[];

} */