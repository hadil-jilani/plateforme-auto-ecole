import { IsNotEmpty, IsOptional, IsString, Matches, Validate } from "class-validator";
import {  IsDateString, IsDateStringConstraint, prestation } from "@app/shared";

export class newOccurrenceDto {

    @IsNotEmpty()
    @IsString()
    trainerId: string

    
    @IsNotEmpty()
    @IsString()
    learnerId: string

    @IsNotEmpty()
    @IsString()
    prestationId: string
    
    
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{2}-\d{2}$/gm)
    date: string

    @IsNotEmpty()
    @Matches(/^([0-9]|[0-1][0-9]|2[0-3]):[0-5][0-9]$/gm)
    startHour: string
    
    @IsNotEmpty()
    @Matches(/^([0-9]|[0-1][0-9]|2[0-3]):[0-5][0-9]$/gm)
    // @IsTimeString()
    endHour: string

    @IsNotEmpty()
    @IsString()
    place: string

    @IsOptional()
    @IsString()
    comments: string
    
}