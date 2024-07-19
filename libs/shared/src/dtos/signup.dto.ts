import { IsString , IsEmail , MinLength , IsNotEmpty, IsNumber } from "class-validator";


export class signupDto {

   @IsNotEmpty()
   @IsString()
   readonly name : string 


   @IsNotEmpty()
   @IsString()
   @IsEmail()
   readonly email : string 
 
   @IsNotEmpty()
   @IsNumber()  
    readonly phoneNumber : number 

    
   @IsNotEmpty()
   @IsString()
   readonly adresse : string 


   @IsString()
   @IsNotEmpty()
   @MinLength(8)
   readonly  password : string 
 

}