import { LearnerModel, NewLearnerDto } from '@app/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class LearnersService {
  constructor(
    @InjectModel(LearnerModel.name) private Learner: mongoose.Model<LearnerModel>
  ) {}

  async addLearner(data: NewLearnerDto) {
    const learnerData = data['learnerData'];
    const schoolId = data['schoolId'];
    const { name, email, phoneNumber } = learnerData;

    const isLearnerExist = await this.Learner.findOne({ email });
    if (isLearnerExist) {
      throw new RpcException({
        message: "Cannot add new learner, a learner already exists with this email!",
        statusCode: 400
      });
    }

    const result = await this.Learner.create({
      schoolId,
      name,
      email,
      phoneNumber
    });

    if (!result) {
      throw new RpcException({
        message: "You can't create a new learner at this time. Please try again later!",
        statusCode: 400
      });
    } else {
      return result;
    }
  }

  async editLearner(data) {
    const id: string = data['id'];
    const learnerData = data['learnerData'];
    const learner = await this.Learner.findByIdAndUpdate(id, learnerData, { new: true });
    if (!learner) {
      throw new RpcException({
        message: `Learner #${id} not found`,
        statusCode: 404
      });
    }
    return learner;
  }

  async deleteLearner(id, schoolId) {
    const Id = new ObjectId(id);
    const SchoolId = new ObjectId(schoolId);
    const learner = await this.Learner.findOne({ _id: Id, schoolId: SchoolId });
    if (!learner) {
      throw new RpcException({
        message: "You can't delete a learner at this time. Please try again later",
        statusCode: 404
      });
    }

    const result = await this.Learner.deleteOne({ _id: Id, schoolId: SchoolId });
    if (!result) {
      throw new RpcException({
        message: "Something went wrong. Please try again!",
        statusCode: 400
      });
    }

    console.log("Learner has been successfully deleted!");
  }

  async getLearner(id) {
    const learner = await this.Learner.findById(id);
    if (!learner) {
      throw new RpcException({
        message: "You can't get a learner at this time. Please try again later",
        statusCode: 400
      });
    }
    return learner;
  }

  async getAllLearners(schoolId) {
    const learners = await this.Learner.find({ schoolId: schoolId });
    if (!learners) {
      throw new RpcException({
        message: "You can't get learners at this time. Please try again later",
        statusCode: 400
      });
    }
    return learners;
  }
}
