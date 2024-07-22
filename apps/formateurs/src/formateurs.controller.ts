import { Controller } from '@nestjs/common';
import { FormateursService } from './formateurs.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { NewformateurDto } from '@app/shared';

@Controller()
export class FormateursController {
  constructor(private readonly formateursService: FormateursService) {}

  @MessagePattern('add-trainer')
  async addTrainer(data: NewformateurDto) {
    console.log("add", data)
    return this.formateursService.addTrainer(data);
    }


  @MessagePattern('edit-trainer')
  async editTrainer(data: object) {
    console.log("edit", data)
    return this.formateursService.editTrainer(data);
    }
  @EventPattern('delete-trainer')
  async deleteTrainer(data) {
    const id = data["id"]
    const ecoleId = data["ecoleId"]
    console.log("delete", data)
    return this.formateursService.deleteTrainer(id,ecoleId);
    }
  @MessagePattern('get-trainer')
  async getTrainer(id) {
    // const id = data["id"]
    console.log("delete", id)
    return this.formateursService.getTrainer(id);
    }
  @MessagePattern('get-all-trainers')
  async getAllTrainers(ecoleId) {
    // const ecoleId = data["ecoleId"]
    console.log("delete", ecoleId)
    return this.formateursService.getAllTrainers(ecoleId);
    }
}
