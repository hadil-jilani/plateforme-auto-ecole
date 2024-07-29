import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { signupDto } from '@app/shared';
import { activationDto } from '@app/shared';
import { loginDto } from '@app/shared';
import { ForgotPasswordDto } from '@app/shared';
import { ResetPasswordDto } from '@app/shared';

@Controller()
export class AuthController {
    userService: any;
    constructor(private readonly authservice : AuthService,
) {}


    @MessagePattern('sign-up')
    Signup(data : signupDto){
        const token =  this.authservice.signup(data);
        console.log(data)
        return token  
    }


    @MessagePattern('activate-account')
    ActivateUserAccount(activationToken : activationDto ){
        return  this.authservice.Activate_Account(activationToken)
    }
    
  //sqdqsdqs
    
    @MessagePattern('login-user')
    Login(data: loginDto) : Promise<{
        userRole: string,
        accessToken : string , 
        refreshToken : string         
    }>{
        return this.authservice.login(data);  
    }
    
    @MessagePattern('forget-pwd')
    Forgotpassword(email : ForgotPasswordDto){
    return this.authservice.Forgotpassword(email); 
    }


    @MessagePattern('reset-password')
    resetpassword( data : ResetPasswordDto){ 
    return this.authservice.Reset_Password(data); 
    }



    @EventPattern('logout-user')
    logoutUser(serializedReq: { body: any; headers: any }){
        console.log("controller auth")
        return this.authservice.logout(serializedReq)
    }
   
}
