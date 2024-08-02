import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EventPattern, MessagePattern, RpcException } from '@nestjs/microservices';
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
    @MessagePattern('refresh-token')
    async refresh(refreshToken:string) {
        console.log("here")
        console.log(refreshToken)
        if (!refreshToken) {
          throw new RpcException({
            message: "'Refresh token not provided!'",
            statusCode: 400
          })
        }
        return this.authservice.refresh(refreshToken);
        
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
    logoutUser(userId:string){
    return this.authservice.logout(userId);
    }

   
}
