import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { activationDto, AuthGuard, ForgotPasswordDto, loginDto, ResetPasswordDto, Role, Roles, RolesGuard, signupDto } from '@app/shared';
import { UpdateformateurDto } from '@app/shared/dtos/updateFormateur.dto';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  // tkhdm
  @Post("/signup")
  Signup(@Body() data: signupDto) {
    const token = this.appService.Signup(data);
    return token
  }
  // tkhdm
  @Post('/signup/account-activation')
  ActivateUserAccount(@Body() activationToken: activationDto) {

    return this.appService.ActivateAccount(activationToken)
  }
  // tkhdm
  @Post('/login')

  Login(@Body() data: loginDto) {
    return this.appService.Login(data);
  }

  // tkhdm
  @Post('/login/forget-password')
  ForgetPassword(@Body() email: ForgotPasswordDto) {
    return this.appService.ForgetPassword(email);
  }

  // tkhdm
  @Post('/login/forget-password/reset-password')
  Resetpassword(@Body() data: ResetPasswordDto) {
    return this.appService.ResetPassword(data);
  }

  // tkhdm
  @Post('/logout')
  LogoutUser(req: Request) {
    return this.appService.Logout(req)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Get('/all-requests')
  AllRequests() {
    return this.appService.AllRequests()
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Post('/accept-request')
  AcceptRequest(@Body('id') id: string) {
    const Id: string = id.toString()
    return this.appService.AcceptRequest(Id)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Post('/reject-request')
  RejectRequest(@Body('id') id: string) {
    const Id: string = id.toString()
    return this.appService.RejectRequest(Id)
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.ECOLE)
  @Post('/add-trainer')
  AddTrainer(@Req() req : Request,@Body() formateurData: object){
    console.log(formateurData)
    return this.appService.AddTrainer(req,formateurData)
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.ECOLE)
  @Post('/edit-trainer')
  EditTrainer(@Body() {id, formateurData}: {id:string, formateurData: UpdateformateurDto}){
    console.log(formateurData)
    return this.appService.EditTrainer(id, formateurData)
  }

}
