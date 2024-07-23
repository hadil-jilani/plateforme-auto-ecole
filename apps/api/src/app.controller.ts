import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { activationDto, AuthGuard, ForgotPasswordDto, loginDto, ResetPasswordDto, Role, Roles, RolesGuard, signupDto, UpdatePasswordDto, UpdateProfileDto } from '@app/shared';
import { UpdateFormateurDto } from '@app/shared';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post("/signup")
  Signup(@Body() data: signupDto) {
    const token = this.appService.Signup(data);
    return token
  }
  @Post('/signup/account-activation')
  ActivateUserAccount(@Body() activationToken: activationDto) {

    return this.appService.ActivateAccount(activationToken)
  }
  @Post('/login')

  Login(@Body() data: loginDto) {
    return this.appService.Login(data);
  }

  @Post('/login/forget-password')
  ForgetPassword(@Body() email: ForgotPasswordDto) {
    return this.appService.ForgetPassword(email);
  }

  @Post('/login/forget-password/reset-password')
  Resetpassword(@Body() data: ResetPasswordDto) {
    return this.appService.ResetPassword(data);
  }
  // pending
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Post('/serach-school')
  SearchSchool(@Body() data: string) {
    return this.appService.SearchSchool(data);
    }

  @Post('/logout')
  LogoutUser(req: Request) {
   console.log("controller")
    return this.appService.Logout(req)
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Get('/profile')
  FindProfile(@Req() req : Request) {
    console.group("controller")
    return this.appService.GetProfile(req);
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Put('/profile')
  UpdateProfile(@Req() req : Request, @Body() updateData: UpdateProfileDto) {
    console.group("controller")
    return this.appService.UpdateProfile(req,updateData);
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Delete('/profile')
  DeleteProfile(@Req() req : Request) {
    console.group("controller")
    return this.appService.DeleteProfile(req);
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Put('/profile/update-password')
  UpdatePassword(@Req() req : Request, @Body() UpdatePassword: UpdatePasswordDto) {
    console.group("controller")
    return this.appService.UpdatePassword(req,UpdatePassword);
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
  @Post('/trainer')
  AddTrainer(@Req() req : Request,@Body() formateurData: object){
    console.log(formateurData)
    return this.appService.AddTrainer(req,formateurData)
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.ECOLE)
  @Put('/trainer/:id')
  EditTrainer(@Param('id') id:string, @Body() data: object){
    console.log(data)
    return this.appService.EditTrainer(id, data)
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.ECOLE)
  @Delete('/trainer/:id')
  DeleteTrainer(@Req() req:Request,@Param('id') id:string){
    return this.appService.DeleteTrainer(req,id)
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.ECOLE)
  @Get('/trainer/:id')
  GetTrainer(@Param('id') id:string){
    return this.appService.GetTrainer(id)
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.ECOLE)
  @Get('/trainers')
  GetAllTrainer(@Req() req: Request){
    return this.appService.GetAllTrainers(req)
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.ECOLE)
  @Post('/learner')
  AddLearner(@Req() req : Request,@Body() apprenantData: object){
    console.log(apprenantData)
    return this.appService.AddLearner(req,apprenantData)
  }
  
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.ECOLE)
  @Put('/learner/:id')
  EditLearner(@Param('id') id:string, @Body() apprenantData: object){
    console.log(apprenantData)
    return this.appService.EditLearner(id, apprenantData)
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.ECOLE)
  @Delete('/learner/:id')
  DeleteLearner(@Req() req:Request,@Param('id') id:string){
    return this.appService.DeleteLearner(req,id)
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.ECOLE)
  @Get('/learner/:id')
  GetLearner(@Param('id') id:string){
    return this.appService.GetLearner(id)
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.ECOLE)
  @Get('/learners')
  GetAllLearners(@Req() req: Request){
    return this.appService.GetAllLearners(req)
  }

}
