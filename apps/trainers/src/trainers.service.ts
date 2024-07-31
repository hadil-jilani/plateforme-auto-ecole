import { TrainerModel, NewtrainerDto, AgendaModel } from '@app/shared';
import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class TrainersService {
  constructor(
    @InjectModel(TrainerModel.name) private Trainer: mongoose.Model<TrainerModel>,
    @InjectModel(AgendaModel.name) private Profile: mongoose.Model<AgendaModel>,
    @Inject('test2') private test: ClientProxy
  ) { }


  async addTrainer(data: NewtrainerDto) {

    const trainerData = data['trainerData']
    const ecoleId = data['ecoleId']
    const { name, email, phoneNumber, creneauxIndisponibles } = trainerData;

    const isTrainerExist = await this.Trainer.findOne({ email })
    if (isTrainerExist) {
      throw new HttpException(new BadRequestException("Cannot add new trainer , a trainer already exist with this email ! "),400)
    }
    const result = await this.Trainer.create({
      ecoleId,
      name,
      email,
      phoneNumber,
      creneauxIndisponibles
    })
    if (!result) {
      throw new HttpException (new NotFoundException("You cant create a new trainer at this time please try again later ! "),400)
    }
    else {
      return "Trainer has beed successfully created ! "
    }
  }

  async editTrainer(data) {
    const id: string = data['id']
    const trainerData = data['trainerData']
    const trainer = await this.Trainer.findByIdAndUpdate(id, trainerData, { new: true });
    if (!trainer) {
      throw new NotFoundException(`Trainer #${id} not found`);
    }
    return trainer;

  }
  async deleteTrainer(id,ecoleId) {
    console.log("service")
    const Id = new ObjectId(id)
    const EcoleId = new ObjectId(ecoleId)
    console.log(id, " ", ecoleId)
    const trainer = await this.Trainer.findOne({_id:Id, ecoleId: EcoleId})

    if (!trainer) {
      throw new HttpException(new NotFoundException("You cant delete a trainer at this time please try again later"), 404);
    }
    const result = await  this.Trainer.deleteOne({_id:Id, ecoleId: EcoleId})
  if (!result){
    throw new HttpException(new NotFoundException("somthing went wrong please try again ! "),400)
  }
  console.log(trainer)
  console.log("trainer has beed successfully deleted ! ")
}
  

  async getTrainer(id) {
    const trainer = await this.Trainer.findById(id);
    if (!trainer) {
      throw new HttpException(new NotFoundException("You cant get a trainer at this time please try again later"),400)
    }
    return trainer
  }

  async getAllTrainers(ecoleId) {
const trainers = await this.Trainer.find({ecoleId:ecoleId})
if (!trainers) {
  throw new HttpException(new NotFoundException("You cant get trainers at this time please try again later"),404)
    }
    this.test.emit('test2', {})
    return trainers
}
  async getTrainersByProfile(data) {
    const {ecoleId, id} = data
    const profile = await this.Profile.findById(id)
    if(!profile) {
      throw new HttpException(new NotFoundException("No profile was found"),404)
    }
    console.log(profile)
    const idList = profile["trainersId"]
    console.log(idList)
    const trainers = await this.Trainer.find({_id: {$in:idList}})
if (!trainers) {
  throw new HttpException(new NotFoundException("You cant get trainers at this time please try again later"),404)
    }
    return trainers
}
}
