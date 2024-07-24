import { IsNotEmpty, IsString, Matches } from "class-validator";
// import { IsTimeString } from "@app/shared";

export class duplicateOccurrenceDto {

    
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{2}-\d{2}$/gm)
    // @IsDateString('date')
    date:Date

    @IsNotEmpty()
    @Matches(/^([0-9]|[0-1][0-9]|2[0-3]):[0-5][0-9]$/gm)
    // @IsTimeString()
    heureDebut:string
    
    @IsNotEmpty()
    @Matches(/^([0-9]|[0-1][0-9]|2[0-3]):[0-5][0-9]$/gm)
    // @IsTimeString()
    heureFin:string

}