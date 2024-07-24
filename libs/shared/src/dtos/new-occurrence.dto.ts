import { IsNotEmpty, IsOptional, IsString, Matches, Validate } from "class-validator";
import {  IsDateString, IsDateStringConstraint, prestation } from "@app/shared";

export class newOccurrenceDto {

    @IsNotEmpty()
    @IsString()
    idFormateur: string

    
    @IsNotEmpty()
    @IsString()
    idApprenant: string

    @IsNotEmpty()
    @IsString()
    prestation: prestation
    
    
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{2}-\d{2}$/gm)
    date: string

    @IsNotEmpty()
    @Matches(/^([0-9]|[0-1][0-9]|2[0-3]):[0-5][0-9]$/gm)
    heureDebut: string
    
    @IsNotEmpty()
    @Matches(/^([0-9]|[0-1][0-9]|2[0-3]):[0-5][0-9]$/gm)
    // @IsTimeString()
    heureFin: string

    @IsNotEmpty()
    @IsString()
    lieuRDV: string

    @IsOptional()
    @IsString()
    commentaires: string
    
}