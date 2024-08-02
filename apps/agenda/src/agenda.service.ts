import { AgendaModel, TrainerModel } from '@app/shared';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class AgendaService {
  constructor(
    @InjectModel(AgendaModel.name) private agenda: mongoose.Model<AgendaModel>,
    @InjectModel(TrainerModel.name) private trainer: mongoose.Model<TrainerModel>
  ) { }

  async addProfile(data) {
    const schoolId: string = data['schoolId']
    const { name, trainersId } = data['agendaData']
    const isProfileExist = await this.agenda.findOne({ name: name })
    if (isProfileExist) {
      throw new HttpException(new BadRequestException('agenda already exist'), 400)
    }
    const result = await this.agenda.create({
      schoolId,
      name,
      trainersId: trainersId
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
      throw new RpcException({
        message: `Profile #${id} not found`,
        statusCode: 404
      });
    }
    return agenda;
  }
  
  async deleteProfile(id, schoolId) {
    console.log("service")
    const Id = new ObjectId(id)
    const SchoolId = new ObjectId(schoolId)
    console.log(id, " ", schoolId)
    const agenda = await this.agenda.findOne({ _id: Id, schoolId: SchoolId })

    if (!agenda) {
      throw new HttpException(new NotFoundException("You cant delete a agenda at this time please try again later"), 404);
    }
    const result = await this.agenda.deleteOne({ _id: Id, schoolId: SchoolId })
    if (!result) {
      throw new HttpException(new NotFoundException("somthing went wrong please try again ! "), 400)
    }
    console.log(agenda)
    console.log("agenda has beed successfully deleted ! ")
  }


  async getProfile(id: string) {
    console.log("here")
    const Id = new ObjectId(id)
    const agenda = await this.agenda.findById(Id)
    console.log(agenda)
    // .select('-createdAt -updatedAt -__v');
    if (!agenda) {
      throw new RpcException({
        message: 'You cannot get an agenda at this time, please try again later',
        statusCode: 404
      })
      // throw new HttpException(new NotFoundException('not found'), HttpStatus.NOT_FOUND)
    }

    return agenda
  }
  //   return {
  //     id: agenda._id.toString(),
  //     name: agenda.name,
  //     trainersId: agenda.trainersId.map(trainerId => trainerId.toString()),
  //     schoolId: agenda.schoolId.toString()
  //   };
  // } catch (error) {
  //   throw new HttpException('Error fetching profile: ' + error.message, 500);
  // }


  async getAllProfiles(schoolId) {
    const agendas = await this.agenda.find({ schoolId: schoolId }).select('-createdAt -updatedAt -__v');
    if (!agendas) {
      throw new HttpException(new NotFoundException("You cant get agendas at this time please try again later"), 404)
    }

    const trainerIds = agendas.reduce((acc, agenda) => {
      return acc.concat(agenda.trainersId);
    }, []);
    const trainers = await this.trainer.find({ _id: { $in: trainerIds } }).select('-createdAt -updatedAt -__v -schoolId');
    const trainersMap = trainers.reduce((map, trainer) => {
      map[trainer._id.toString()] = {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        phoneNumber: trainer.phoneNumber,
        unavailableSlots: trainer.unavailableSlots,
      };
      return map;
    }, {});

    const formattedAgendas = agendas.map(agenda => ({
      id: agenda._id,
      name: agenda.name,
      trainers: agenda.trainersId.map(trainerId => trainersMap[trainerId]),
    }));

    return formattedAgendas;

  }
}