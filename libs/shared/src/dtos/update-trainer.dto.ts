import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsEmail, IsOptional } from "class-validator";
import { NewtrainerDto } from "@app/shared";

export class UpdateTrainerDto extends PartialType(NewtrainerDto) {}

/* export class UpdatetrainerDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsOptional()
    creneauxIndisponibles?: string[];

} */