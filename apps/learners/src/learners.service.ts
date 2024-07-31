import { LearnerModel, NewLearnerDto } from '@app/shared';
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class LearnersService {
 constructor(
  @InjectModel(LearnerModel.name) private Learner : mongoose.Model<LearnerModel>
 ) {}

 async addLearner(data: NewLearnerDto) {

  const learnerData = data['learnerData']
  const ecoleId = data['ecoleId']
  const { name, email, phoneNumber } = learnerData;

  const isLearnerExist = await this.Learner.findOne({ email })
  if (isLearnerExist) {
    throw new HttpException(new BadRequestException("Cannot add new learner , a learner already exist with this email ! "),400)
  }
  const result = await this.Learner.create({
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
  const learnerData = data['learnerData']
  const learner = await this.Learner.findByIdAndUpdate(id, learnerData, { new: true });
  if (!learner) {
    throw new NotFoundException(`Learner #${id} not found`);
  }
  return learner;


}
async deleteLearner(id,ecoleId) {
  console.log("service")
  const Id = new ObjectId(id)
  const EcoleId = new ObjectId(ecoleId)
  console.log(id, " ", ecoleId)
  const learner = await this.Learner.findOne({_id:Id, ecoleId: EcoleId})
  if (!learner) {
    throw new HttpException(new NotFoundException("You cant delete a learner at this time please try again later"), 404);
  }
  const result = await  this.Learner.deleteOne({_id:Id, ecoleId: EcoleId})
if (!result){
  throw new HttpException(new NotFoundException("somthing went wrong please try again ! "),400)
}
console.log(learner)
console.log("Learner has beed successfully deleted ! ")
}


async getLearner(id) {
  const learner = await this.Learner.findById(id);
  if (!learner) {
    throw new HttpException(new NotFoundException("You cant get a learner at this time please try again later"),404)
  }
  return learner
}

async getAllLearners(ecoleId) {
const learners = await this.Learner.find({ecoleId:ecoleId})
if (!learners) {
throw new HttpException(new NotFoundException("You cant get trainers at this time please try again later"),404)
  }
  return learners
}
}
