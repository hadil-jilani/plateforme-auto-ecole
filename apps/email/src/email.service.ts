import { activationEmailDto, EcoleModel, ForgotPasswordDto } from '@app/shared';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as fs from 'fs';
import { resetPwdEmailDto } from '@app/shared/dtos/resetPwdEmail.dto';


@Injectable()
export class EmailService {
  constructor(private mailerservice: MailerService , 
    @InjectModel(EcoleModel.name) private Agent : mongoose.Model<EcoleModel>
  ) {}

  

  async SendActivationEmail({
    subject,
    email,
    name,
    activationCode}: activationEmailDto) {
      const templatePath = "libs/shared/src/templates/activation.ejs"
      let htmlContent = fs.readFileSync(templatePath, 'utf-8');
      htmlContent = htmlContent
      .replace('{{name}}', name || '')
      .replace('{{activationCode}}', activationCode)
      await this.mailerservice.sendMail({
        to : email,
        subject , 
        html : htmlContent
       
      });
      console.log("email sent")
  }



 async SendForgotPwdEmail({
    name,
    url,
    subject,
    email}: resetPwdEmailDto){
      const templatePath = "libs/shared/src/templates/forgot-pwd.ejs"
      let htmlContent = fs.readFileSync(templatePath, 'utf-8');
      htmlContent = htmlContent
      .replace('{{name}}', name || '')
      .replace('{{url}}', url)
    await this.mailerservice.sendMail({
      to : email,
      subject , 
      html: htmlContent,
      context: {
        name,
        url,
      },
    });
  }


//   async sendEmail({
//     subject,
//     emails,
//     text,
//     CampagneID,
//     redirectUrl,
//     template,
//     Image
//   } : MailerOptions2) {
//     const trackingUrl = `https://2e73-41-226-25-110.ngrok-free.app/api/email-clicked?id=${CampagneID}&redirect=${encodeURIComponent(redirectUrl)}`;
//     if(redirectUrl){
//       const templatePath = `libs/shared/src/templates/${template}.ejs`;
//     let htmlContent = fs.readFileSync(templatePath, 'utf-8');
//     htmlContent = htmlContent
//       .replace('{{text}}', text)
//       .replace('{{title}}', subject)
//       .replace('{{trackingUrl}}', trackingUrl)
//       .replace('{{imageURL}}', Image); 
//     try {
//       const info = await this.mailerservice.sendMail({
//         to: emails,
//         subject,
//         text,
//         html: htmlContent,
//       });
//       const successEmails = info.accepted.length;
//       const failedEmails = info.rejected.length;  
//       await this.updateCampagneData(CampagneID, successEmails, failedEmails);
//       return info;
//     } catch (error) {
//       console.error('Error sending email:', error);
//       throw error;
//     }
//     }else{
//     const templatePath = `libs/shared/src/templates/${template}_sansButton.ejs`;
//     let htmlContent = fs.readFileSync(templatePath, 'utf-8');
//     htmlContent = htmlContent
//       .replace('{{title}}', subject)  
//       .replace('{{text}}', text)  
//       .replace('{{imageURL}}', Image); 
//     try {
//       const info = await this.mailerservice.sendMail({
//         to: emails,
//         subject,
//         text,
//         html: htmlContent,
//       });
//       const successEmails = info.accepted.length;
//       const failedEmails = info.rejected.length; 
//       await this.updateCampagneData(CampagneID, successEmails, failedEmails);
//       return info;
//     } catch (error) {
//       console.error('Error sending email:', error);
//       throw error;
//     }
//     }
//   }
  
  






  async SendRequestEmail({name,subject,email}, status:string){
    let text = ""
    if (status==='refused') text=`<p>We regret to inform you that your registration request with our platform has not been accepted at this time.</p>
 
    <p>We appreciate your interest in our platform and value your consideration. If you have any questions or require further assistance, please don't hesitate to reach out to us.</p>
 
    <p>Thank you for your understanding.</p>`
    else {text= `<p>Thank you for registering with our platform.
          We are thrilled to inform you that your account registration request has been accepted! Welcome aboard!</p>
                    <p>You are now able login freely at any time on our platform!</p>
                `
              console.log("im in accepted function")}
    const templatePath = "libs/shared/src/templates/request-email.ejs"
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');
    htmlContent = htmlContent
    .replace('{{name}}', name || '')
    .replace('{{text}}', text || '')
  await this.mailerservice.sendMail({
    to : email,
    subject , 
    html: htmlContent,
    context: {
    name,
    text
      },
  });
  }

  }
