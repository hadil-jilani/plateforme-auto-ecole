import { activationEmailDto, ApprenantModel, EcoleModel, ForgotPasswordDto, FormateurModel } from '@app/shared';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as fs from 'fs';
import { resetPwdEmailDto } from '@app/shared/dtos/resetPwdEmail.dto';


@Injectable()
export class EmailService {
  constructor(private mailerservice: MailerService , 
    @InjectModel(EcoleModel.name) private Ecole : mongoose.Model<EcoleModel>,
    @InjectModel(FormateurModel.name) private Formateur : mongoose.Model<FormateurModel>,
    @InjectModel(ApprenantModel.name) private Apprenant : mongoose.Model<ApprenantModel>
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
  async SendNewOccurrence({idApprenant, idFormateur, prestation, date, heureDebut, heureFin, lieuRDV}){
    const apprenant = await this.Apprenant.findById(idApprenant)
    const formateur = await this.Formateur.findById(idFormateur)
    const subject= "New Occurrence"
    
    const templatePath = "libs/shared/src/templates/nouvelle-occurrence.ejs"
    const htmlContent = fs.readFileSync(templatePath, 'utf-8')
    .replace('{{prestation}}', prestation || '')
    .replace('{{date}}', date || '')
    .replace('{{lieuRDV}}', lieuRDV || '')
    .replace('{{heureDebut}}', heureDebut || '')
    .replace('{{heureFin}}', heureFin || '')

  const mailToTrainer = await this.mailerservice.sendMail({
    to : formateur.email,
    subject , 
    html: htmlContent,
    context: {
    name1: formateur.name,
    name2: apprenant.name
      },
  });
  const mailToLearner = await this.mailerservice.sendMail({
    to : formateur.email,
    subject , 
    html: htmlContent,
    context: {
      name1: apprenant.name,
      name2: formateur.name,
      },
  });
  console.log(mailToLearner, mailToTrainer)
  }
  async SendUpdatedOccurrence({idApprenant, idFormateur, prestation, date, heureDebut, heureFin, lieuRDV}){
    const apprenant = await this.Apprenant.findById(idApprenant)
    const formateur = await this.Formateur.findById(idFormateur)
    const subject= "Occurrence Update"
    
   
    const templatePath = "libs/shared/src/templates/update-occurrence.ejs"
    const htmlContent = fs.readFileSync(templatePath, 'utf-8')
    .replace('{{prestation}}', prestation || '')
    .replace('{{date}}', date || '')
    .replace('{{lieuRDV}}', lieuRDV || '')
    .replace('{{heureDebut}}', heureDebut || '')
    .replace('{{heureFin}}', heureFin || '')

  const mailToTrainer = await this.mailerservice.sendMail({
    to : formateur.email,
    subject , 
    html: htmlContent,
    context: {
    name1: formateur.name,
    name2: apprenant.name
      },
  });
  const mailToLearner = await this.mailerservice.sendMail({
    to : formateur.email,
    subject , 
    html: htmlContent,
    context: {
      name1: apprenant.name,
      name2: formateur.name,
      },
  });
  console.log(mailToLearner, mailToTrainer)
  }
  async SendCancelledOccurrence({idApprenant, idFormateur, prestation, date, heureDebut, heureFin, lieuRDV}){
    const apprenant = await this.Apprenant.findById(idApprenant)
    const formateur = await this.Formateur.findById(idFormateur)
    const subject= "Occurrence Cancellation"
    
   
    const templatePath = "libs/shared/src/templates/cancel-occurrence.ejs"
    const htmlContent = fs.readFileSync(templatePath, 'utf-8')
    .replace('{{prestation}}', prestation || '')
    .replace('{{date}}', date || '')
    .replace('{{lieuRDV}}', lieuRDV || '')
    .replace('{{heureDebut}}', heureDebut || '')
    .replace('{{heureFin}}', heureFin || '')

  const mailToTrainer = await this.mailerservice.sendMail({
    to : formateur.email,
    subject , 
    html: htmlContent,
    context: {
    name1: formateur.name,
    name2: apprenant.name
      },
  });
  const mailToLearner = await this.mailerservice.sendMail({
    to : formateur.email,
    subject , 
    html: htmlContent,
    context: {
      name1: apprenant.name,
      name2: formateur.name,
      },
  });
  console.log(mailToLearner, mailToTrainer)
  }

  }
