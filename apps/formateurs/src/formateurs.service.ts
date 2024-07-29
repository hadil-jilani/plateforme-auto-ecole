import { FormateurModel, NewformateurDto, AgendaModel } from '@app/shared';
import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class FormateursService {
  constructor(
    @InjectModel(FormateurModel.name) private Formateur: mongoose.Model<FormateurModel>,
    @InjectModel(AgendaModel.name) private Profile: mongoose.Model<AgendaModel>,
    @Inject('test2') private test: ClientProxy
  ) { }


  async addTrainer(data: NewformateurDto) {

    const formateurData = data['formateurData']
    const ecoleId = data['ecoleId']
    const { name, email, phoneNumber, creneauxIndisponibles } = formateurData;

    const isTrainerExist = await this.Formateur.findOne({ email })
    if (isTrainerExist) {
      throw new HttpException(new BadRequestException("Cannot add new trainer , a trainer already exist with this email ! "),400)
    }
    const result = await this.Formateur.create({
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
    const formateurData = data['formateurData']
    const formateur = await this.Formateur.findByIdAndUpdate(id, formateurData, { new: true });
    if (!formateur) {
      throw new NotFoundException(`Trainer #${id} not found`);
    }
    return formateur;

  }
  async deleteTrainer(id,ecoleId) {
    console.log("service")
    const Id = new ObjectId(id)
    const EcoleId = new ObjectId(ecoleId)
    console.log(id, " ", ecoleId)
    const formateur = await this.Formateur.findOne({_id:Id, ecoleId: EcoleId})

    if (!formateur) {
      throw new HttpException(new NotFoundException("You cant delete a trainer at this time please try again later"), 404);
    }
    const result = await  this.Formateur.deleteOne({_id:Id, ecoleId: EcoleId})
  if (!result){
    throw new HttpException(new NotFoundException("somthing went wrong please try again ! "),400)
  }
  console.log(formateur)
  console.log("formateur has beed successfully deleted ! ")
}
  

  async getTrainer(id) {
    const formateur = await this.Formateur.findById(id);
    if (!formateur) {
      throw new HttpException(new NotFoundException("You cant get a trainer at this time please try again later"),400)
    }
    return formateur
  }

  async getAllTrainers(ecoleId) {
const formateurs = await this.Formateur.find({ecoleId:ecoleId})
if (!formateurs) {
  throw new HttpException(new NotFoundException("You cant get trainers at this time please try again later"),404)
    }
    this.test.emit('test2', {})
    return formateurs
}
  async getTrainersByProfile(data) {
    const {ecoleId, id} = data
    const profile = await this.Profile.findById(id)
    if(!profile) {
      throw new HttpException(new NotFoundException("No profile was found"),404)
    }
    console.log(profile)
    const idList = profile["formateursId"]
    console.log(idList)
    const formateurs = await this.Formateur.find({_id: {$in:idList}})
if (!formateurs) {
  throw new HttpException(new NotFoundException("You cant get trainers at this time please try again later"),404)
    }
    return formateurs
}
}
