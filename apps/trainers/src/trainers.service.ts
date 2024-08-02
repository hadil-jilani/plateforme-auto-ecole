import { TrainerModel, NewtrainerDto, AgendaModel } from '@app/shared';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}

  async addTrainer(data: NewtrainerDto) {
    const trainerData = data['trainerData'];
    const schoolId = data['schoolId'];
    const { name, email, phoneNumber, unavailableSlots } = trainerData;

    const isTrainerExist = await this.Trainer.findOne({ email });
    if (isTrainerExist) {
      throw new RpcException({
        message: "Cannot add new trainer, a trainer already exists with this email!",
        statusCode: 400
      });
    }

    const result = await this.Trainer.create({
      schoolId,
      name,
      email,
      phoneNumber,
      unavailableSlots
    });

    if (!result) {
      throw new RpcException({
        message: "You can't create a new trainer at this time. Please try again later!",
        statusCode: 400
      });
    } else {
      return result;
    }
  }

  async editTrainer(data) {
    const id: string = data['id'];
    const trainerData = data['trainerData'];
    const trainer = await this.Trainer.findByIdAndUpdate(id, trainerData, { new: true });
    if (!trainer) {
      throw new RpcException({
        message: `Trainer #${id} not found`,
        statusCode: 404
      });
    }
    return trainer;
  }

  async deleteTrainer(id, schoolId) {
    const Id = new ObjectId(id);
    const SchoolId = new ObjectId(schoolId);
    const trainer = await this.Trainer.findOne({ _id: Id, schoolId: SchoolId });

    if (!trainer) {
      throw new RpcException({
        message: "You can't delete a trainer at this time. Please try again later",
        statusCode: 404
      });
    }

    const result = await this.Trainer.deleteOne({ _id: Id, schoolId: SchoolId });
    if (!result) {
      throw new RpcException({
        message: "Something went wrong. Please try again!",
        statusCode: 400
      });
    }

    console.log("Trainer has been successfully deleted!");
  }

  async getTrainer(id) {
    const trainer = await this.Trainer.findById(id);
    if (!trainer) {
      throw new RpcException({
        message: "You can't get a trainer at this time. Please try again later",
        statusCode: 400
      });
    }
    return trainer;
  }

  async getAllTrainers(schoolId) {
    const trainers = await this.Trainer.find({ schoolId: schoolId });
    if (!trainers) {
      throw new RpcException({
        message: "You can't get trainers at this time. Please try again later",
        statusCode: 400
      });
    }
    return trainers;
  }

  async getTrainersByProfile(data) {
    const { schoolId, id } = data;
    const profile = await this.Profile.findById(id);
    if (!profile) {
      throw new RpcException({
        message: "No profile was found",
        statusCode: 404
      });
    }

    const idList = profile["trainersId"];
    const trainers = await this.Trainer.find({ _id: { $in: idList } }).select('-createdAt -updatedAt -schoolId -__v')
    if (!trainers) {
      throw new RpcException({
        message: "You can't get trainers at this time. Please try again later",
        statusCode: 400
      });
    }
    return trainers;
  }
}
