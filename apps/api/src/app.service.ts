import { signupDto } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
export class AppService {
  constructor(
    @Inject('register') private register: ClientProxy,
    @Inject('demande') private demande: ClientProxy,
    @Inject('formateur') private formateur: ClientProxy,
    private jwtservice: JwtService
  ) { }

  async Signup(data: signupDto) {
    const result = this.register.send('sign-up', data)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }

  async ActivateAccount(activationToken) {
    console.log(activationToken)
    const result = this.register.send('activate-account', activationToken)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }


  async Login(data) {
    const result = this.register.send('login-user', data)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }

  async ForgetPassword(email) {
    const result = this.register.send('forget-pwd', email)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }

  async ResetPassword(data) {
    const result = this.register.send('reset-password', data)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }

  async Logout(req: Request) {
    const result = this.register.emit('logout-user', req)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return result
  }
  async AllRequests() {
    const response = await this.demande.send('get-all-requests', {})
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return response;
  }

  async AcceptRequest(id) {
    const response = await this.demande.emit('accept-request', id)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return response;
  }
  async RejectRequest(id) {
    const response = await this.demande.emit('reject-request', id)
      .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    return response;
  }

  async AddTrainer(req, formateurData) {
    const ecoleId = this.GetLoggedUserId(req)
    const response = await this.formateur.send('add-trainer',{ecoleId,formateurData})
    .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    console.log(response)
    return response;
  }
  async EditTrainer(id, formateurData) {
    const response = await this.formateur.send('edit-trainer',{id,formateurData})
    .pipe(catchError(error => throwError(() => new RpcException(error.response))))
    console.log(response)
    return response;
  }

  GetLoggedUserId(req) {
    const token = req.headers['accesstoken'];
    const decoded = this.jwtservice.decode(token);
    const id = decoded?.id
    return id
  }
}