import { signupDto, UpdatePasswordDto, UpdatePersonnalProfileDto } from '@app/shared';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LiteralExpressionOperator } from 'mongoose';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
export class AppService {
  constructor(
    @Inject('auth') private auth: ClientProxy,
    @Inject('request') private request: ClientProxy,
    @Inject('trainer') private trainer: ClientProxy,
    @Inject('learner') private learner: ClientProxy,
    @Inject('profile') private profile: ClientProxy,
    @Inject('occurrence') private occurrence: ClientProxy,
    @Inject('agenda') private agenda: ClientProxy,
    private jwtservice: JwtService
  ) { }

  async Signup(data: signupDto) {
    const result = this.auth.send('sign-up', data)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return result
  }

  async ActivateAccount(activationToken) {
    console.log(activationToken)
    const result = this.auth.send('activate-account', activationToken)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return result
  }


  async Login(data) {
    console.log("here")
    console.log("data  ", data)
    const result = this.auth.send('login-user', data)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return result
  }

  async ForgetPassword(email) {
    const result = this.auth.send('forget-pwd', email)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return result
  }

  async ResetPassword(data) {
    const result = this.auth.send('reset-password', data)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return result
  }
  // pending
  async SearchSchool(data) {
    const result = this.auth.send('search-school', data)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return result
  }

  async Logout(req) {
    console.log("service")
    console.log(req)
    console.log(typeof(req))
    const serializedReq = {
      body: req.body,
      headers: req.headers,
    };
    //   req.headers['refreshtoken'] = null
    // const result = this.auth.emit('logout-user', {req})
    const result = this.auth.emit('logout-user',serializedReq)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return result
  }

  // PROFILE
  async GetProfile(req: Request) {
    console.group("service")
    const id = this.GetLoggedUserId(req)
    const result = this.profile.send('get-personnal-profile', id)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return result
  }

  async UpdateProfile(req: Request, updateData: UpdatePersonnalProfileDto) {
    console.group("service")
    const id = this.GetLoggedUserId(req)
    const result = this.profile.send('update-personnal-profile', { id, updateData })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return result
  }
  async DeleteProfile(req: Request) {
    console.group("service")
    const id = this.GetLoggedUserId(req)
    const result = this.profile.emit('delete-personnal-profile', id)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return result
  }
  async UpdatePassword(req: Request, updatePassword: UpdatePasswordDto) {
    console.group("service")
    const id = this.GetLoggedUserId(req)
    const result = this.profile.emit('update-password', { id, updatePassword })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return result
  }
  GetLoggedUserId(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found!');
    }
  
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format!');
    }
  
    const decoded = this.jwtservice.decode(token);
    const id = decoded?.id;
    
    return id;
  }
  

  // REQUESTS
  async AllRequests() {
    const response = await this.request.send('get-all-requests', {})
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return response;
  }

  async AcceptRequest(id) {
    const response = await this.request.emit('accept-request', id)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return response;
  }
  async RejectRequest(id) {
    const response = await this.request.emit('reject-request', id)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return response;
  }

  //TRAINERS
  async AddTrainer(req, trainerData) {
    const schoolId = this.GetLoggedUserId(req)
    const response = await this.trainer.send('add-trainer', { schoolId, trainerData })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async EditTrainer(id, trainerData) {
    const response = await this.trainer.send('edit-trainer', { id, trainerData })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async DeleteTrainer(req, id) {
    const schoolId = this.GetLoggedUserId(req)
    const response = await this.trainer.emit('delete-trainer', { schoolId, id })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async GetTrainer(id) {
    const response = await this.trainer.send('get-trainer', id)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async GetAllTrainers(req) {
    const schoolId = this.GetLoggedUserId(req)
    const response = await this.trainer.send('get-all-trainers', schoolId)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async GetTrainersByProfile(req, id) {
    const schoolId = this.GetLoggedUserId(req)
    const response = await this.trainer.send('get-trainers-profile', { schoolId, id })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }

  // LEARNERS
  async AddLearner(req, learnerData) {
    const schoolId = this.GetLoggedUserId(req)
    const response = await this.learner.send('add-learner', { schoolId, learnerData })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async EditLearner(id, learnerData) {
    const response = await this.learner.send('edit-learner', { id, learnerData })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async DeleteLearner(req, id) {
    const schoolId = this.GetLoggedUserId(req)
    const response = await this.learner.emit('delete-learner', { schoolId, id })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async GetLearner(id) {
    const response = await this.learner.send('get-learner', id)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }

  async GetAllLearners(req) {
    const schoolId = this.GetLoggedUserId(req)
    const response = await this.learner.send('get-all-learners', schoolId)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }

  // OCCURRENCES
  async AddOccurrence(req, occurrenceData) {
    const schoolId = this.GetLoggedUserId(req)
    const response = await this.occurrence.send('add-occurrence', { schoolId, occurrenceData })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async EditOccurrence(id, occurrenceData) {
    const response = await this.occurrence.send('edit-occurrence', { id, occurrenceData })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async DuplicateOccurrence(id, occurrenceData) {
    const response = await this.occurrence.send('duplicate-occurrence', { id, occurrenceData })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async DeleteOccurrence(id) {
    const response = await this.occurrence.emit('delete-occurrence', id)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async GetOccurrence(id) {
    const response = await this.occurrence.send('get-occurrence', id)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }

  async GetOccurrences(req, data) {
    const { trainersId, startDate, endDate, date } = data
    const schoolId = this.GetLoggedUserId(req)
    console.log(schoolId)
    const response = await this.occurrence.send('get-occurrences', { schoolId, trainersId, startDate, endDate, date })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log("here")
    return response;
  }
    // PRESTATION

  async AddPrestation(req, prestationData) {
    const schoolId = this.GetLoggedUserId(req)
    const response = await this.occurrence.send('add-prestation', { schoolId, prestationData })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    return response;
  }
  
  
  async EditPrestation(id, prestationData) {
    const response = await this.occurrence.send('edit-prestation', { id, prestationData })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async DeletePrestation(id) {
    const response = await this.occurrence.emit('delete-prestation', id)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async GetPrestation(id) {
    const response = await this.occurrence.send('get-prestation', id)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }

  async GetPrestations(req) {
    const schoolId = this.GetLoggedUserId(req)
    console.log(schoolId)
    const response = await this.occurrence.send('get-all-prestations', schoolId)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log("here")
    return response;
  }

  //Agendas
  async AddAgenda(req, agendaData) {
    const schoolId = this.GetLoggedUserId(req)
    const response = await this.agenda.send('add-agenda', { schoolId, agendaData })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async EditAgenda(id, agendaData) {
    const response = await this.agenda.send('edit-agenda', { id, agendaData })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async DeleteAgenda(req, id) {
    const schoolId = this.GetLoggedUserId(req)
    const response = await this.agenda.emit('delete-agenda', { schoolId, id })
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async GetAgenda(id) {
    const response = await this.agenda.send('get-agenda', id)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
  async GetAllAgendas(req) {
    const schoolId = this.GetLoggedUserId(req)
    const response = await this.agenda.send('get-all-agendas', schoolId)
      .pipe(catchError(error => throwError(() => new RpcException(error))))
    console.log(response)
    return response;
  }
}