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
    const schoolId = data["schoolId"]
    console.log("delete", data)
    return this.learnersService.deleteLearner(id,schoolId);
    }
  @MessagePattern('get-learner')
  async getLearner(id) {
    // const id = data["id"]
    console.log("get", id)
    return this.learnersService.getLearner(id);
    }
  @MessagePattern('get-all-learners')
  async getAllLearners(schoolId) {
    // const schoolId = data["schoolId"]
    console.log("get", schoolId)
    return this.learnersService.getAllLearners(schoolId);
    }
}
