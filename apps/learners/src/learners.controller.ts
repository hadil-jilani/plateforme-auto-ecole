import { Controller, Get } from '@nestjs/common';
import { LearnersService } from './learners.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { NewLearnerDto } from '@app/shared';

@Controller()
export class LearnersController {
  constructor(private readonly learnersService: LearnersService) {}

  @MessagePattern('add-learner')
  async addLearner(data: NewLearnerDto) {
    console.log("add", data)
    return this.learnersService.addLearner(data);
    }


  @MessagePattern('edit-learner')
  async editLearner(data: object) {
    console.log("edit", data)
    return this.learnersService.editLearner(data);
    }
  @EventPattern('delete-learner')
  async deleteLearner(data) {
    const id = data["id"]
    const ecoleId = data["ecoleId"]
    console.log("delete", data)
    return this.learnersService.deleteLearner(id,ecoleId);
    }
  @MessagePattern('get-learner')
  async getLearner(id) {
    // const id = data["id"]
    console.log("get", id)
    return this.learnersService.getLearner(id);
    }
  @MessagePattern('get-all-learners')
  async getAllLearners(ecoleId) {
    // const ecoleId = data["ecoleId"]
    console.log("get", ecoleId)
    return this.learnersService.getAllLearners(ecoleId);
    }
}
