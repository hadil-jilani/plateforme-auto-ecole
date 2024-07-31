import { Controller, Get } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @MessagePattern('get-all-requests')
  AllDemands(){
    return this.requestsService.GetRequests();
  }
 
  @EventPattern('accept-request')
  AcceptRequest( id : string ){
    return this.requestsService.Accept_request(id)
  }

  @EventPattern('reject-request')
  DeleteRequest( id : string){
    return this.requestsService.DeleteRequest(id)
  }


  // @MessagePattern('number-requests')
  // Nbrequests(){
  //   return this.requestsService.NbRequests();
  // }
}
