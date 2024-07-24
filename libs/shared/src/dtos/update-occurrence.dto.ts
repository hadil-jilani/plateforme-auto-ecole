import { PartialType } from "@nestjs/mapped-types";
import { newOccurrenceDto } from "./new-occurrence.dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateOccurrenceDto extends PartialType(newOccurrenceDto) {
    @IsString()
    @IsOptional()
    id?: string;
}