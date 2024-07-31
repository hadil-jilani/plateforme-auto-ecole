import { AgendaModel } from '@app/shared';
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class AgendaService {
  constructor(
    @InjectModel(AgendaModel.name) private agenda: mongoose.Model<AgendaModel>
  ) {}

  async addProfile(data) {
    const ecoleId: string = data['ecoleId']
    const {name,trainersId} = data['agendaData']
    const isProfileExist = await this.agenda.findOne({name:name})
    if(isProfileExist){
      throw new HttpException(new BadRequestException('agenda already exist'), 400)
    }
    const result = await this.agenda.create({
      ecoleId,
      name,
      trainersId:trainersId
    })
    return result
    // if (!result) {
    //   throw new HttpException (new NotFoundException("You cant create a new agenda at this time please try again later ! "),400)
    // }
    // else {
    //   return "agenda has beed successfully created ! "
    // }
    
  }
  async editProfile(data) {
    const id: string = data['id']
    const agendaData = data['agendaData']
    const agenda = await this.agenda.findByIdAndUpdate(id, agendaData, { new: true });
    if (!agenda) {
      throw new NotFoundException(`Profile #${id} not found`);
    }
    return agenda;

  }
  async deleteProfile(id,ecoleId) {
    console.log("service")
    const Id = new ObjectId(id)
    const EcoleId = new ObjectId(ecoleId)
    console.log(id, " ", ecoleId)
    const agenda = await this.agenda.findOne({_id:Id, ecoleId: EcoleId})

    if (!agenda) {
      throw new HttpException(new NotFoundException("You cant delete a agenda at this time please try again later"), 404);
    }
    const result = await  this.agenda.deleteOne({_id:Id, ecoleId: EcoleId})
  if (!result){
    throw new HttpException(new NotFoundException("somthing went wrong please try again ! "),400)
  }
  console.log(agenda)
  console.log("agenda has beed successfully deleted ! ")
}
  

  async getProfile(id) {
    const agenda = await this.agenda.findById(id);
    if (!agenda) {
      throw new HttpException(new NotFoundException("You cant get a agenda at this time please try again later"),400)
    }
    return agenda
  }

  async getAllProfiles(ecoleId) {
const agendas = await this.agenda.find({ecoleId:ecoleId})
if (!agendas) {
  throw new HttpException(new NotFoundException("You cant get agendas at this time please try again later"),404)
    }
    return agendas
}
}
