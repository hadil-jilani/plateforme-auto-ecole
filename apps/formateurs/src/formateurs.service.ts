import { FormateurModel, NewformateurDto } from '@app/shared';
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class FormateursService {
  constructor(
    @InjectModel(FormateurModel.name) private Formateur: mongoose.Model<FormateurModel>
  ) { }


  async addTrainer(data: NewformateurDto) {
    // const formateur = new this.FormateurModel(data);
    // const result = await formateur.save();
    // if (!result) {
    //   throw new HttpException(
    //     'Error while adding trainer',
    //     500
    //   )
    // }
    // console.log("saved trainer")

    const formateurData = data['formateurData']
    const ecoleId = data['ecoleId']
    const { name, email, creneauxIndisponibles } = formateurData;

    const isTrainerExist = await this.Formateur.findOne({ email })
    if (isTrainerExist) {
      throw new RpcException(new BadRequestException("Cannot add new trainer , a trainer already exist with this email ! "))
    }
    const result = await this.Formateur.create({
      ecoleId,
      name,
      email,
      creneauxIndisponibles
    })
    if (!result) {
      throw new RpcException(new NotFoundException("You cant create a new trainer at this time please try again later ! "))
    }
    else {
      return "client has beed successfully created ! "
    }
  }

  async editTrainer(data) {
    const id: string = data['id']
    const formateurData = data['formateurData']
    const formateur = await this.Formateur.findByIdAndUpdate(id, formateurData, { new: true });
    if (!formateur) {
      throw new NotFoundException(`Student #${id} not found`);
    }
    return formateur;
    // console.log(id)
    // console.log(formateurData)
    // const Id = new ObjectId(id)
    // const formateur = await this.Formateur.findOneAndUpdate(
    //   { _id: Id },
    //   { $set: formateurData },
    //   { new: true }
    // );
    /*   const formateur = await this.Formateur.findOne({_id : Id})
    const {name, email, creneauxIndisponibles} = formateurData 
    if (!formateur){
      throw new RpcException(new BadRequestException(" somthing went wrong , client not found ! "))
    }
    if (formateurData.name){
      formateur.name = name;
    }
    if (formateurData.email) {
      formateur.email =email;
    } 
    if (formateurData.creneauxIndisponibles) {
      formateur.creneauxIndisponibles =creneauxIndisponibles;
    } 
   await formateur.save(); */

    return { formateur }

  }
  async deleteTrainer(id,ecoleId) {
    console.log("service")
    const Id = new ObjectId(id)
    const EcoleId = new ObjectId(ecoleId)
    console.log(id, " ", ecoleId)
    const formateur = await this.Formateur.findOne({_id:Id, ecoleId: EcoleId})
    // const formateur = await this.Formateur.findByIdAndDelete(Id);
    if (!formateur) {
      throw new HttpException(new NotFoundException("You cant delete a trainer at this time please try again later"), 404);
    }
    const result = await  this.Formateur.deleteOne({_id:Id, ecoleId: EcoleId})
  if (!result){
    throw new RpcException(new NotFoundException("somthing went wrong please try again ! "))
  }
  console.log(formateur)
  console.log("formateur has beed successfully deleted ! ")
}
  

  async getTrainer(id) {
    const formateur = await this.Formateur.findById(id);
    if (!formateur) {
      throw new RpcException(new NotFoundException("You cant get a trainer at this time please try again later"))
    }
    return formateur
  }

  async getAllTrainers(ecoleId) {
const formateurs = await this.Formateur.find({ecoleId:ecoleId})
if (!formateurs) {
  throw new RpcException(new NotFoundException("You cant get trainers at this time please try again later"))
    }
    return formateurs
}
}
