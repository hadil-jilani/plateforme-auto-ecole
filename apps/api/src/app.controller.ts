import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { activationDto, AuthGuard, DateRangeDto, duplicateOccurrenceDto, ForgotPasswordDto, loginDto, NewtrainerDto, ResetPasswordDto, Role, Roles, RolesGuard, signupDto, UpdateOccurrenceDto, UpdatePasswordDto, UpdatePersonnalProfileDto } from '@app/shared';
import { newOccurrenceDto } from '@app/shared';
import { newPrestationDto } from '@app/shared/dtos/new-prestation.dto';
import { UpdatePrestationDto } from '@app/shared/dtos/update-prestation.dto';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }
  /* 
  **********

    AUTH

  **********
  */
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
  
  @Post('/logout')
  LogoutUser(@Req() req: Request) {
    console.log("controller")
    return this.appService.Logout(req)
  }
  // pending
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.SUPERADMIN)
  // @Post('/serach-school')
  // SearchSchool(@Body() data: string) {
  //   return this.appService.SearchSchool(data);
  // }
  /* 
  **********

    Profiles

  **********
  */
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/profile')
  FindProfile(@Req() req: Request) {
    console.group("controller")
    return this.appService.GetProfile(req);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/profile')
  UpdateProfile(@Req() req: Request, @Body() updateData: UpdatePersonnalProfileDto) {
    console.group("controller")
    return this.appService.UpdateProfile(req, updateData);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/profile')
  DeleteProfile(@Req() req: Request) {
    console.group("controller")
    return this.appService.DeleteProfile(req);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/profile/update-password')
  UpdatePassword(@Req() req: Request, @Body() UpdatePassword: UpdatePasswordDto) {
    console.group("controller")
    return this.appService.UpdatePassword(req, UpdatePassword);
  }

  /* 
  **********

    Requests

  **********
  */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Get('/all-requests')
  AllRequests() {
    return this.appService.AllRequests()
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Post('/accept-request/:id')
  AcceptRequest(@Param('id') id: string) {
    const Id: string = id.toString()
    return this.appService.AcceptRequest(Id)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Post('/reject-request/:id')
  RejectRequest(@Param('id') id: string) {
    const Id: string = id.toString()
    return this.appService.RejectRequest(Id)
  }

  /* 
  **********

    TRAINERSS

  **********
  */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Post('/trainer')
  AddTrainer(@Req() req: Request, @Body() trainerData: NewtrainerDto) {
    console.log(trainerData)
    return this.appService.AddTrainer(req, trainerData)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Put('/trainer/:id')
  EditTrainer(@Param('id') id: string, @Body() data: object) {
    console.log(data)
    return this.appService.EditTrainer(id, data)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Delete('/trainer/:id')
  DeleteTrainer(@Req() req: Request, @Param('id') id: string) {
    return this.appService.DeleteTrainer(req, id)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Get('/trainer/:id')
  GetTrainer(@Param('id') id: string) {
    return this.appService.GetTrainer(id)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Get('/trainers')
  GetAllTrainer(@Req() req: Request) {
    return this.appService.GetAllTrainers(req)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Get('/trainers/by-profile/:id')
  GetTrainersByProfile(@Req() req: Request, @Param('id') id: string) {
    return this.appService.GetTrainersByProfile(req, id)
  }

  /* 
    **********
  
      LEARNERSS
  
    **********
    */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Post('/learner')
  AddLearner(@Req() req: Request, @Body() learnerData: object) {
    console.log(learnerData)
    return this.appService.AddLearner(req, learnerData)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Put('/learner/:id')
  EditLearner(@Param('id') id: string, @Body() learnerData: object) {
    console.log(learnerData)
    return this.appService.EditLearner(id, learnerData)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Delete('/learner/:id')
  DeleteLearner(@Req() req: Request, @Param('id') id: string) {
    return this.appService.DeleteLearner(req, id)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Get('/learner/:id')
  GetLearner(@Param('id') id: string) {
    return this.appService.GetLearner(id)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Get('/learner/all')
  GetAllLearners(@Req() req: Request) {
    return this.appService.GetAllLearners(req)
  }

  /* 
  **********

    OCCURRENCES

  **********
  */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Post('/occurrence')
  AddOccurrence(@Req() req: Request, @Body() occurrenceData: newOccurrenceDto) {
    console.log(occurrenceData)
    return this.appService.AddOccurrence(req, occurrenceData)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Post('/occurrence/:id')
  DuplicateOccurrence(@Param('id') id: string, @Body() occurrenceData: duplicateOccurrenceDto) {
    console.log(occurrenceData)
    return this.appService.DuplicateOccurrence(id, occurrenceData)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Put('/occurrence/:id')
  EditOccurrence(@Param('id') id: string, @Body() occurrenceData: UpdateOccurrenceDto) {
    console.log(occurrenceData)
    return this.appService.EditOccurrence(id, occurrenceData)
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Delete('/occurrence/:id')
  DeleteOccurrence(@Param('id') id: string) {
    return this.appService.DeleteOccurrence(id)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Get('/occurrence/:id')
  GetOccurrence(@Param('id') id: string) {
    return this.appService.GetOccurrence(id)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Get('/occurrences')
  GetOccurrences(@Req() req: Request, @Body() data: object) {
    return this.appService.GetOccurrences(req, data)
  }

  /* 
  
  ***************
  PRESTATION 
  ***************

  */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Post('/prestation')
  AddPrestation(@Req() req: Request, @Body() prestationData: newPrestationDto) {
    return this.appService.AddPrestation(req, prestationData)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Put('/prestation/:id')
  EditPrestation(@Param('id') id: string, @Body() prestationData: UpdatePrestationDto) {
    return this.appService.EditPrestation(id, prestationData)
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Delete('/prestation/:id')
  DeletePrestation(@Param('id') id: string) {
    return this.appService.DeletePrestation(id)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Get('/prestation/:id')
  GetPrestation(@Param('id') id: string) {
    return this.appService.GetPrestation(id)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Get('/prestations')
  GetPrestations(@Req() req: Request) {
    return this.appService.GetPrestations(req)
  }
  /* 
  **********

    AGENDA

  **********
  */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Post('/agenda')
  AddAgenda(@Req() req: Request, @Body() agendaData: object) {
    console.log(agendaData)
    return this.appService.AddAgenda(req, agendaData)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Put('/agenda/:id')
  EditAgenda(@Param('id') id: string, @Body() data: object) {
    console.log(data)
    return this.appService.EditAgenda(id, data)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Delete('/agenda/:id')
  DeleteAgenda(@Req() req: Request, @Param('id') id: number) {
    return this.appService.DeleteAgenda(req, id)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Get('/agenda/:id')
  GetAgenda(@Param('id') id: string) {
    return this.appService.GetAgenda(id)
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SCHOOL)
  @Get('/agendas')
  GetAllAgendas(@Req() req: Request) {
    console.log("here")
    return this.appService.GetAllAgendas(req)
  }



}
