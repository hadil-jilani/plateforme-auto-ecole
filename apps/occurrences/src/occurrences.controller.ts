import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { OccurrencesService } from './occurrences.service';
import { DateRangeDto } from '@app/shared';
import { occurrenceDto } from '@app/shared/dtos/occurrence.dto';

@Controller()
export class OccurrencesController {
  constructor(private readonly occurrencesService: OccurrencesService) {}

  @EventPattern('add-occurrence')
  AddOccurrence(data){
    return this.occurrencesService.addOccurrence(data);
  }
  @MessagePattern('edit-occurrence')
  EditOccurrence(data){
    return this.occurrencesService.editOccurrence(data);
  }
  @MessagePattern('get-occurrence')
  GetOccurrence(id){
    return this.occurrencesService.getOccurrence(id);
  }

  @EventPattern('delete-occurrence')
  DeleteOccurrence(id){
    return this.occurrencesService.deleteOccurrence(id);
  }
  @EventPattern('duplicate-occurrence')
  DuplicateOccurrence(data){
    return this.occurrencesService.duplicateOccurrence(data);
  }
  @MessagePattern('get-occurrences')
  GetOccurrences(data:occurrenceDto){
    console.log(data)
    return this.occurrencesService.GetOccurrences(data);
  }

  // PRESTATION
  @EventPattern('add-prestation')
  AddPrestation(data){
    return this.occurrencesService.addPrestation(data);
  }
  @MessagePattern('edit-prestation')
  EditPrestation(data){
    return this.occurrencesService.editPrestation(data);
  }
  @MessagePattern('get-occurrence')
  GetPrestation(id){
    return this.occurrencesService.getPrestation(id);
  }
  @MessagePattern('get-all-occurrences')
  GetAllPrestations(ecoleId){
    console.log("here")
    return this.occurrencesService.getAllPrestations(ecoleId);
  }
  @EventPattern('delete-occurrence')
  DeletePrestation(id){
    return this.occurrencesService.deletePrestation(id);
  }
  
}