import { Controller, Get } from '@nestjs/common';
import { FormateursService } from './formateurs.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { NewformateurDto, signupDto } from '@app/shared';

@Controller()
export class FormateursController {
  constructor(private readonly formateursService: FormateursService) {}

  @MessagePattern('add-trainer')
  async addTrainer(data: NewformateurDto) {
    console.log(data)
    return this.formateursService.addTrainer(data);
    }
  @MessagePattern('edit-trainer')
  async editTrainer(data: NewformateurDto) {
    console.log(data)
    return this.formateursService.editTrainer(data);
    }
}
