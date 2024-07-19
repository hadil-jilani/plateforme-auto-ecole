import { IsString  , MinLength , IsNotEmpty   } from "class-validator";


export class ResetPasswordDto {

   @IsString()
   @IsString()
   readonly forgotPasswordToken : string 

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    readonly  password : string
}