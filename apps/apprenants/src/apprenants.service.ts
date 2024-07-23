import { ApprenantModel, NewApprenantDto } from '@app/shared';
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class ApprenantsService {
 constructor(
  @InjectModel(ApprenantModel.name) private Apprenant : mongoose.Model<ApprenantModel>
 ) {}

 async addLearner(data: NewApprenantDto) {

  const apprenantData = data['apprenantData']
  const ecoleId = data['ecoleId']
  const { name, email, phoneNumber } = apprenantData;

  const isLearnerExist = await this.Apprenant.findOne({ email })
  if (isLearnerExist) {
    throw new HttpException(new BadRequestException("Cannot add new learner , a learner already exist with this email ! "),400)
  }
  const result = await this.Apprenant.create({
    ecoleId,
    name,
    email,
    phoneNumber
  })
  if (!result) {
    throw new HttpException(new NotFoundException("You cant create a new learner at this time please try again later ! "),400)
  }
  else {
    return "Learner has beed successfully created ! "
  }
}

async editLearner(data) {
  const id: string = data['id']
  const apprenantData = data['apprenantData']
  const apprenant = await this.Apprenant.findByIdAndUpdate(id, apprenantData, { new: true });
  if (!apprenant) {
    throw new NotFoundException(`Learner #${id} not found`);
  }
  return apprenant;


}
async deleteLearner(id,ecoleId) {
  console.log("service")
  const Id = new ObjectId(id)
  const EcoleId = new ObjectId(ecoleId)
  console.log(id, " ", ecoleId)
  const apprenant = await this.Apprenant.findOne({_id:Id, ecoleId: EcoleId})
  if (!apprenant) {
    throw new HttpException(new NotFoundException("You cant delete a learner at this time please try again later"), 404);
  }
  const result = await  this.Apprenant.deleteOne({_id:Id, ecoleId: EcoleId})
if (!result){
  throw new HttpException(new NotFoundException("somthing went wrong please try again ! "),400)
}
console.log(apprenant)
console.log("Learner has beed successfully deleted ! ")
}


async getLearner(id) {
  const apprenant = await this.Apprenant.findById(id);
  if (!apprenant) {
    throw new HttpException(new NotFoundException("You cant get a learner at this time please try again later"),404)
  }
  return apprenant
}

async getAllLearners(ecoleId) {
const apprenants = await this.Apprenant.find({ecoleId:ecoleId})
if (!apprenants) {
throw new HttpException(new NotFoundException("You cant get trainers at this time please try again later"),404)
  }
  return apprenants
}
}
