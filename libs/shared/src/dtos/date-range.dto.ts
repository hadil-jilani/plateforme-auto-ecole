import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class DateRangeDto {
    @IsString()
    @IsOptional()
    ecoleId?:string

    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/gm)
    startDate: string


    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/gm)
    endDate: string
}