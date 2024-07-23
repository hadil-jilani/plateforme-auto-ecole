import { Controller, Get } from '@nestjs/common';
import { ApprenantsService } from './apprenants.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { NewApprenantDto } from '@app/shared';

@Controller()
export class ApprenantsController {
  constructor(private readonly apprenantsService: ApprenantsService) {}

  @MessagePattern('add-learner')
  async addLearner(data: NewApprenantDto) {
    console.log("add", data)
    return this.apprenantsService.addLearner(data);
    }


  @MessagePattern('edit-learner')
  async editLearner(data: object) {
    console.log("edit", data)
    return this.apprenantsService.editLearner(data);
    }
  @EventPattern('delete-learner')
  async deleteLearner(data) {
    const id = data["id"]
    const ecoleId = data["ecoleId"]
    console.log("delete", data)
    return this.apprenantsService.deleteLearner(id,ecoleId);
    }
  @MessagePattern('get-learner')
  async getLearner(id) {
    // const id = data["id"]
    console.log("get", id)
    return this.apprenantsService.getLearner(id);
    }
  @MessagePattern('get-all-learners')
  async getAllLearners(ecoleId) {
    // const ecoleId = data["ecoleId"]
    console.log("get", ecoleId)
    return this.apprenantsService.getAllLearners(ecoleId);
    }
}
