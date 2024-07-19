import { IsString , IsEmail , MinLength , IsNotEmpty,   } from "class-validator";
export class loginDto {

   @IsNotEmpty()
   @IsString()
   @IsEmail()
   readonly email : string 

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    readonly  password : string 
}