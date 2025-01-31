import { IsOptional, IsString, Matches, IsArray } from "class-validator";

export class occurrenceDto {
  @IsString()
  @IsOptional()
  schoolId?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/gm)
  date?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/gm)
  startDate?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/gm)
  endDate?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  trainersId?: string[];
  
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  learnersId?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  prestationsId?: string[];
}
