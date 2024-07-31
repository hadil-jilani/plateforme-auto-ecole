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
  @MessagePattern('get-day-occurrences')
  getOccurrencesForOneDay(data: occurrenceDto){
    console.log("here")
    return this.occurrencesService.getOccurrencesForOneDay(data);
  }
  @MessagePattern('get-range-occurrences')
  getOccurrencesForDateRange(data:DateRangeDto){
    console.log("here")
    return this.occurrencesService.getOccurrencesForDateRange(data);
  }
  @MessagePattern('get-trainers-day')
  getByTrainersAndDay(data:any){
    console.log("here")
    return this.occurrencesService.getByTrainersAndDay(data);
  }
  @MessagePattern('get-trainers-range')
  getByTrainersAndRange(data:any){
    console.log("here")
    return this.occurrencesService.getByTrainersAndRange(data);
  }

}
