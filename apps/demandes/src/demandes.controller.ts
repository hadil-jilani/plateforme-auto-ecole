import { Controller, Get } from '@nestjs/common';
import { DemandesService } from './demandes.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('requests')
export class DemandesController {
  constructor(private readonly demandesService: DemandesService) {}

  @MessagePattern('get-all-requests')
  AllDemands(){
    return this.demandesService.GetRequests();
  }
 
  @EventPattern('accept-request')
  AcceptDemande( id : string ){
    return this.demandesService.Accept_demande(id)
  }

  @EventPattern('reject-request')
  DeleteDemande( id : string){
    return this.demandesService.DeleteRequest(id)
  }


  // @MessagePattern('number-requests')
  // Nbdemandes(){
  //   return this.demandesService.NbRequests();
  // }
}
