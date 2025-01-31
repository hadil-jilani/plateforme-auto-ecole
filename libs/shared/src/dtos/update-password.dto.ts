import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class UpdatePasswordDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    NewPassword : string
    

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    OldPassword : string
}
