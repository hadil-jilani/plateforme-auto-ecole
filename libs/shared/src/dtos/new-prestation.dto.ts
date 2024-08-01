import { IsNotEmpty, IsOptional, isString, IsString, Matches, Validate } from "class-validator";
import {  IsDateString, IsDateStringConstraint, prestation } from "@app/shared";

export class newPrestationDto {

    @IsString()
    @IsOptional()
    ecoleId: string

    @IsNotEmpty()
    @IsString()
    type: string

    @IsOptional()
    @IsString()
    comments?: string
    
}