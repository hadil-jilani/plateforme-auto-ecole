import { PartialType } from "@nestjs/mapped-types";
import { newOccurrenceDto } from "./new-occurrence.dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { newPrestationDto } from "./new-prestation.dto";

export class UpdatePrestationDto extends PartialType(newPrestationDto) {
    @IsString()
    @IsOptional()
    id?: string;
}