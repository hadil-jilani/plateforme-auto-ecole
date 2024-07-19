import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';
import { EventPattern } from '@nestjs/microservices';
import { acceptationEmailDto, activationEmailDto, ForgotPasswordDto } from '@app/shared'
import { resetPwdEmailDto } from '@app/shared/dtos/resetPwdEmail.dto';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('send-activation-email')
  Sendmail({name,activationCode,subject,email} :  activationEmailDto){
    return this.emailService.SendActivationEmail({name,activationCode,subject,email})
  }

  @EventPattern('forgot-pwd-email')
  SendForgotPwdEmail({name,url,subject,email} :  resetPwdEmailDto){
    return this.emailService.SendForgotPwdEmail({name,url,subject,email})
    }
  
    @EventPattern('send-acceptation-email')
  SendAcceptationEmail({name,subject,email} :  acceptationEmailDto){
    console.log("in email controller")
    return this.emailService.SendRequestEmail({name,subject,email}, 'accepted')
    }
    @EventPattern('send-rejection-email')
  SendRejectionEmail({name,subject,email} :  acceptationEmailDto){
    return this.emailService.SendRequestEmail({name,subject,email}, 'refused')
    }

}
