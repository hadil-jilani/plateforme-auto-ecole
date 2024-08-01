import { Controller } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { NewtrainerDto } from '@app/shared';

@Controller()
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @MessagePattern('add-trainer')
  async addTrainer(data: NewtrainerDto) {
    console.log("add", data)
    return this.trainersService.addTrainer(data);
    }
  @MessagePattern('edit-trainer')
  async editTrainer(data: object) {
    console.log("edit", data)
    return this.trainersService.editTrainer(data);
    }
  @EventPattern('delete-trainer')
  async deleteTrainer(data) {
    const id = data["id"]
    const schoolId = data["schoolId"]
    console.log("delete", data)
    return this.trainersService.deleteTrainer(id,schoolId);
    }
  @MessagePattern('get-trainer')
  async getTrainer(id) {
    // const id = data["id"]
    return this.trainersService.getTrainer(id);
    }
  @MessagePattern('get-all-trainers')
  async getAllTrainers(schoolId) {
    // const schoolId = data["schoolId"]
    return this.trainersService.getAllTrainers(schoolId);
    }
  @MessagePattern('get-trainers-profile')
  async getTrainersByProfile(data:any) {
    return this.trainersService.getTrainersByProfile(data);
    }
  // @EventPattern('new-occurrence-email')
  // async test(data:any) {
  //   console.log ("test");
  //   }
}
