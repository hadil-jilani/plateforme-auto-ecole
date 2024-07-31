import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class occurrenceDto {
    @IsString()
    @IsOptional()
    ecoleId?:string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/gm)
    date?: string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/gm)
    startDate?: string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/gm)
    endDate?: string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    trainersId?: string[]

}