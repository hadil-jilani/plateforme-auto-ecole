import { Controller, Get } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AgendaController {
  constructor(private readonly AgendaService: AgendaService) {}

  @MessagePattern('add-agenda')
  AddProfile(data){
    return this.AgendaService.addProfile(data);
  }
  @MessagePattern('edit-agenda')
  async editProfile(data: object) {
    console.log("edit", data)
    return this.AgendaService.editProfile(data);
    }
  @EventPattern('delete-agenda')
  async deleteProfile(data) {
    const id = data["id"]
    const schoolId = data["schoolId"]
    console.log("delete", data)
    return this.AgendaService.deleteProfile(id,schoolId);
    }
  @MessagePattern('get-agenda')
  async getProfile(id) {
    // const id = data["id"]
    console.log("delete", id)
    return this.AgendaService.getProfile(id);
    }
  @MessagePattern('get-all-agendas')
  async getAllProfiles(schoolId) {
    // const schoolId = data["schoolId"]
    console.log("delete", schoolId)
    return this.AgendaService.getAllProfiles(schoolId);
    }
}
