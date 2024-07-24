import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { OccurrencesService } from './occurrences.service';

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
  @MessagePattern('get-all-occurrences')
  GetAllOccurrences(ecoleId){
    console.log("here")
    return this.occurrencesService.getAllOccurrences(ecoleId);
  }
  @EventPattern('delete-occurrence')
  DeleteOccurrence(id){
    return this.occurrencesService.deleteOccurrence(id);
  }
  @EventPattern('duplicate-occurrence')
  DuplicateOccurrence(data){
    return this.occurrencesService.duplicateOccurrence(data);
  }

}
