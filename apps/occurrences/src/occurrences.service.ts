import { OccurrenceModel, PrestationModel, occurrence } from '@app/shared';
import { duplicateOccurrenceDto } from '@app/shared/dtos/duplicate-occurrence.dto';
import { newOccurrenceDto } from '@app/shared/dtos/new-occurrence.dto';
import { occurrenceDto } from '@app/shared/dtos/occurrence.dto';
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

    const occurrenceData: newOccurrenceDto = data['occurrenceData']
    console.log(occurrenceData)
    const ecoleId = data['ecoleId']
    const { idTrainer, idLearner, prestation, date, heureDebut, heureFin, lieuRDV, commentaires } = occurrenceData;


    const result = await this.Occurrence.create({
      ecoleId,
      idTrainer,
      idLearner,
      prestation,
      date,
      heureDebut,
      heureFin,
      lieuRDV,
      commentaires
    })
    this.email.send('new-occurrence-email',{ idLearner, idTrainer, prestation, date, heureDebut, heureFin, lieuRDV})
    const res = this.test.emit('new-occurrence-email',{ })
    console.log(res)
    if (!result) {
      throw new HttpException(new NotFoundException("You cant create a new occurrence at this time please try again later ! "), 400)
    }
    else {
      
      return "Occurrence has beed successfully created ! "
    }
  }

  async editOccurrence(data: UpdateOccurrenceDto) {
    const id: string = data['id']
    const occurrenceData = data['occurrenceData']
    const occurrence = await this.Occurrence.findByIdAndUpdate(id, occurrenceData, { new: true });
    if (!occurrence) {
      throw new NotFoundException(`Occurrence #${id} not found`);
    }
    return occurrence;


  }
  async deleteOccurrence( id) {
    console.log("service")
    const Id = new ObjectId(id)
    const occurrence = await this.Occurrence.findById(id )
    console.log(occurrence)
    if (!occurrence) {
      throw new HttpException(new NotFoundException("You cant delete a occurrence at this time please try again later"), 404);
    }
    const result = await this.Occurrence.deleteOne({_id:id})
    if (!result) {
      throw new HttpException(new NotFoundException("somthing went wrong please try again ! "), 400)
    }
    console.log(occurrence)
    console.log("Occurrence has beed successfully deleted ! ")
  }


  async getOccurrence(id) {
    const occurrence = await this.Occurrence.findById(id);
    if (!occurrence) {
      throw new HttpException(new NotFoundException("You cant get a occurrence at this time please try again later"), 404)
    }
    return occurrence
  }


  async duplicateOccurrence(data: duplicateOccurrenceDto) {
    const id: string = data['id']
    const occurrenceData = data['occurrenceData']
    const {date,heureDebut,heureFin} = occurrenceData
    const oldOccurrence = await this.Occurrence.findOne({ _id: id });
    if (!oldOccurrence) {
      throw new HttpException(new NotFoundException("You cant duplicate a occurrence at this time please try again later "), 404)
    }
    const {ecoleId, idTrainer, idLearner, prestation, lieuRDV, commentaires } = oldOccurrence;
    const result = await this.Occurrence.create({
      ecoleId,
      idTrainer,
      idLearner,
      prestation,
      date,
      heureDebut,
      heureFin,
      lieuRDV,
      commentaires
    })
    return result;

  }
  
  async GetOccurrences(data) {
    const { ecoleId, trainersId, date, startDate, endDate } = data;
  
    const query: any = {};
    query.ecoleId = ecoleId;
  
    if (date) {
      query.date = date;
    } else if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
  
    if (trainersId && trainersId.length > 0) {
      query.idTrainer = { $in: trainersId };
    }
  
    const occurrences = await this.Occurrence.find(query);
    console.log(occurrences);
    return occurrences;
  }
  
  async addPrestation(data) {
    const { type, comments } = data['prestationData'];
    const schoolId = data['ecoleId'];
  
    // Check if the prestation type already exists for the given ecoleId
    const existingPrestation = await this.Prestation.findOne({ schoolId, type });
  
    if (existingPrestation) {
      throw new RpcException({
        message: "Prestation type already exists for this school",
        statusCode: 400
      });    }
  
    // Create new prestation
    const result = await this.Prestation.create({
      schoolId,
      type,
      comments
    });
  
    if (!result) {
      throw new HttpException(new NotFoundException("Cannot create a new prestation at this time. Please try again later!"), 400);
    } else {
      return result;
    }
  }
  

  async editPrestation(data: UpdatePrestationDto) {
    const id: string = data['id'];
    const {type, comments} = data['prestationData'];
    const prestation = await this.Prestation.findByIdAndUpdate(id,  { new: true });

    if (!prestation) {
      throw new NotFoundException(`Prestation #${id} not found`);
    }
    return prestation;
  }

  async deletePrestation(id) {
    console.log("service");
    const prestation = await this.Prestation.findById(id);
    console.log(prestation);

    if (!prestation) {
      throw new HttpException(new NotFoundException("Cannot delete the prestation at this time. Please try again later"), 404);
    }

    const result = await this.Prestation.deleteOne({ _id: id });
    if (!result) {
      throw new HttpException(new NotFoundException("Something went wrong. Please try again!"), 400);
    }

    console.log(prestation);
    console.log("Prestation has been successfully deleted!");
  }

  async getPrestation(id) {
    const prestation = await this.Prestation.findById(id);
    if (!prestation) {
      throw new HttpException(new NotFoundException("Cannot get the prestation at this time. Please try again later"), 404);
    }
    return prestation;
  }
  async getAllPrestations(ecoleId: string) {
    const prestations = await this.Prestation.find({ ecoleId: ecoleId });
  
    if (!prestations || prestations.length === 0) {
      throw new HttpException(
        new NotFoundException("No prestations found for the specified ecoleId."),
        404
      );
    }
  
    return prestations;
  }
  


 
  
}
