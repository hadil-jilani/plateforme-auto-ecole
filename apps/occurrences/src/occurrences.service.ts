import { OccurrenceModel, PrestationModel, occurrence } from '@app/shared';
import { duplicateOccurrenceDto } from '@app/shared/dtos/duplicate-occurrence.dto';
import { newOccurrenceDto } from '@app/shared/dtos/new-occurrence.dto';
import { occurrenceDto } from '@app/shared/dtos/get-occurrence.dto';
import { UpdateOccurrenceDto } from '@app/shared/dtos/update-occurrence.dto';
import { UpdatePrestationDto } from '@app/shared/dtos/update-prestation.dto';
import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class OccurrencesService {
  constructor(
    @InjectModel(OccurrenceModel.name) private Occurrence: mongoose.Model<OccurrenceModel>,
    @InjectModel(PrestationModel.name) private Prestation: mongoose.Model<PrestationModel>,
    @Inject('email') private email: ClientProxy,
    @Inject('test') private test: ClientProxy,
  ) { }
  async addOccurrence(data) {
    const occurrenceData: newOccurrenceDto = data['occurrenceData'];
    const schoolId = data['schoolId'];
    const { trainerId, learnerId, prestationId, date, startHour, endHour, place, comments } = occurrenceData;

    const result = await this.Occurrence.create({
      schoolId,
      trainerId,
      learnerId,
      prestationId,
      date,
      startHour,
      endHour,
      place,
      comments
    });

    this.email.send('new-occurrence-email', { learnerId, trainerId, prestationId, date, startHour, endHour, place });
    const res = this.test.emit('new-occurrence-email', {});
    if (!result) {
      throw new RpcException({
        message: "You can't create a new occurrence at this time. Please try again later!",
        statusCode: 400
      });
    }
    return result;
  }

  async editOccurrence(data: UpdateOccurrenceDto) {
    const id: string = data['id'];
    const occurrenceData = data['occurrenceData'];
    const occurrence = await this.Occurrence.findByIdAndUpdate(id, occurrenceData, { new: true });
    if (!occurrence) {
      throw new RpcException({
        message: `Occurrence #${id} not found`,
        statusCode: 404
      });
    }
    return occurrence;
  }
  async deleteOccurrence(id) {
    const occurrence = await this.Occurrence.findById(id);
    if (!occurrence) {
      throw new RpcException({
        message: "You can't delete an occurrence at this time. Please try again later",
        statusCode: 400
      });
    }

    const result = await this.Occurrence.deleteOne({ _id: id });
    if (!result) {
      throw new RpcException({
        message: "Something went wrong. Please try again!",
        statusCode: 400
      });
    }
    console.log("Occurrence has been successfully deleted!");
  }


  async getOccurrence(id) {
    const occurrence = await this.Occurrence.findById(id);
    if (!occurrence) {
      throw new RpcException({
        message: "You can't get an occurrence at this time. Please try again later",
        statusCode: 400
      });
    }
    return occurrence;
  }


  async duplicateOccurrence(data: duplicateOccurrenceDto) {
    const id: string = data['id'];
    const occurrenceData = data['occurrenceData'];
    const { date, startHour, endHour } = occurrenceData;
    const oldOccurrence = await this.Occurrence.findOne({ _id: id });
    if (!oldOccurrence) {
      throw new RpcException({
        message: "You can't duplicate an occurrence at this time. Please try again later",
        statusCode: 400
      });
    }
    const { schoolId, trainerId, learnerId, prestationId, place, comments } = oldOccurrence;
    const result = await this.Occurrence.create({
      schoolId,
      trainerId,
      learnerId,
      prestationId,
      date,
      startHour,
      endHour,
      place,
      comments
    });
    return result;
  }

  
  async GetOccurrences(data) {
    const { schoolId, trainersId, date, startDate, endDate } = data;

    const query: any = {};
    query.schoolId = schoolId;

    if (date) {
      query.date = date;
    } else if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (trainersId && trainersId.length > 0) {
      query.trainerId = { $in: trainersId };
    }

    const occurrences = await this.Occurrence.find(query);
    return occurrences;
  }
  
  async addPrestation(data) {
    const { type, comments } = data['prestationData'];
    const schoolId = data['schoolId'];

    const existingPrestation = await this.Prestation.findOne({ schoolId, type });

    if (existingPrestation) {
      throw new RpcException({
        message: "Prestation type already exists for this school",
        statusCode: 400
      });
    }

    const result = await this.Prestation.create({
      schoolId,
      type,
      comments
    });

    if (!result) {
      throw new RpcException({
        message: "Cannot create a new prestation at this time. Please try again later!",
        statusCode: 400
      });
    }
    return result;
  }
  

  async editPrestation(data: UpdatePrestationDto) {
    const id: string = data['id'];
    const prestationData = data['prestationData'];
    const prestation = await this.Prestation.findByIdAndUpdate(id, prestationData, { new: true });

    if (!prestation) {
      throw new RpcException({
        message: `Prestation #${id} not found`,
        statusCode: 404
      });
    }
    return prestation;
  }

  async deletePrestation(id) {
    const prestation = await this.Prestation.findById(id);

    if (!prestation) {
      throw new RpcException({
        message: "Cannot delete the prestation at this time. Please try again later",
        statusCode: 404
      });
    }
    const result = await this.Prestation.deleteOne({ _id: id });
    if (!result) {
      throw new RpcException({
        message: "Something went wrong. Please try again!",
        statusCode: 400
      });
    }
    console.log("Prestation has been successfully deleted!");
  }

  async getPrestation(id) {
    const prestation = await this.Prestation.findById(id);
    if (!prestation) {
      throw new RpcException({
        message: "Cannot get the prestation at this time. Please try again later",
        statusCode: 404
      });
    }
    return prestation;
  }
  async getAllPrestations(schoolId: string) {
    const prestations = await this.Prestation.find({ schoolId:schoolId });

    if (!prestations || prestations.length === 0) {
      throw new RpcException({
        message: "No prestations found for the specified schoolId.",
        statusCode: 404
      });
    }
    return prestations;
  }
}
