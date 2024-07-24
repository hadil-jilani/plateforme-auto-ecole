import { OccurrenceModel } from '@app/shared';
import { duplicateOccurrenceDto } from '@app/shared/dtos/duplicate-occurrence.dto';
import { newOccurrenceDto } from '@app/shared/dtos/new-occurrence.dto';
import { UpdateOccurrenceDto } from '@app/shared/dtos/update-occurrence.dto';
import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class OccurrencesService {
  constructor(
    @InjectModel(OccurrenceModel.name) private Occurrence: mongoose.Model<OccurrenceModel>,
    @Inject('occ-email') private email: ClientProxy
  ) { }
  async addOccurrence(data) {

    const occurrenceData: newOccurrenceDto = data['occurrenceData']
    console.log(occurrenceData)
    const ecoleId = data['ecoleId']
    const { idFormateur, idApprenant, prestation, date, heureDebut, heureFin, lieuRDV, commentaires } = occurrenceData;


    const result = await this.Occurrence.create({
      ecoleId,
      idFormateur,
      idApprenant,
      prestation,
      date,
      heureDebut,
      heureFin,
      lieuRDV,
      commentaires
    })
    const sending = await this.email.send('new-occurrence-email',{ idApprenant, idFormateur, prestation, date, heureDebut, heureFin, lieuRDV})
    console.log(sending)
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

  async getAllOccurrences(ecoleId) {
    const occurrences = await this.Occurrence.find({ ecoleId: ecoleId })
    console.log(occurrences)
    if (!occurrences) {
      throw new HttpException(new NotFoundException("You cant get occurrences at this time please try again later"), 404)
    }
    return occurrences
  }
  async duplicateOccurrence(data: duplicateOccurrenceDto) {
    const id: string = data['id']
    const occurrenceData = data['occurrenceData']
    const {date,heureDebut,heureFin} = occurrenceData
    const oldOccurrence = await this.Occurrence.findOne({ _id: id });
    if (!oldOccurrence) {
      throw new HttpException(new NotFoundException("You cant duplicate a occurrence at this time please try again later "), 404)
    }
    const {ecoleId, idFormateur, idApprenant, prestation, lieuRDV, commentaires } = oldOccurrence;
    const result = await this.Occurrence.create({
      ecoleId,
      idFormateur,
      idApprenant,
      prestation,
      date,
      heureDebut,
      heureFin,
      lieuRDV,
      commentaires
    })
    return result;

  }
}
