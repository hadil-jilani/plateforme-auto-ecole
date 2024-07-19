import { IsString  , MinLength , IsNotEmpty, IsNumberString,  } from "class-validator";
export class activationDto {

   @IsNotEmpty()
   @IsString()
   readonly activationToken : string 

    @IsNumberString()
    @IsNotEmpty()
    @MinLength(4)
    readonly  activationCode : string  
}