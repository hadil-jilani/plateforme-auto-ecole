import { AgendaModel } from '@app/shared';
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class AgendaService {
  constructor(
    @InjectModel(AgendaModel.name) private profile: mongoose.Model<AgendaModel>
  ) {}

  async addProfile(data) {
    const ecoleId: string = data['ecoleId']
    const {name,trainersId} = data['agendaData']
    const isProfileExist = await this.profile.findOne({name:name})
    if(isProfileExist){
      throw new HttpException(new BadRequestException('agenda already exist'), 400)
    }
    const result = await this.profile.create({
      ecoleId,
      name,
      formateursId:trainersId
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
    const profile = await this.profile.findByIdAndUpdate(id, agendaData, { new: true });
    if (!profile) {
      throw new NotFoundException(`Profile #${id} not found`);
    }
    return profile;

  }
  async deleteProfile(id,ecoleId) {
    console.log("service")
    const Id = new ObjectId(id)
    const EcoleId = new ObjectId(ecoleId)
    console.log(id, " ", ecoleId)
    const profile = await this.profile.findOne({_id:Id, ecoleId: EcoleId})

    if (!profile) {
      throw new HttpException(new NotFoundException("You cant delete a profile at this time please try again later"), 404);
    }
    const result = await  this.profile.deleteOne({_id:Id, ecoleId: EcoleId})
  if (!result){
    throw new HttpException(new NotFoundException("somthing went wrong please try again ! "),400)
  }
  console.log(profile)
  console.log("profile has beed successfully deleted ! ")
}
  

  async getProfile(id) {
    const profile = await this.profile.findById(id);
    if (!profile) {
      throw new HttpException(new NotFoundException("You cant get a profile at this time please try again later"),400)
    }
    return profile
  }

  async getAllProfiles(ecoleId) {
const profiles = await this.profile.find({ecoleId:ecoleId})
if (!profiles) {
  throw new HttpException(new NotFoundException("You cant get profiles at this time please try again later"),404)
    }
    return profiles
}
}
