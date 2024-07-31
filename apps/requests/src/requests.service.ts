import { EcoleModel, status } from '@app/shared';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class RequestsService {
  constructor (@InjectModel(EcoleModel.name) private EcoleModel : mongoose.Model<EcoleModel>,
@Inject('Request') private Sender : ClientProxy
){}
async GetRequests(){
  return  await this.EcoleModel.find({status : status.EN_ATTENTE}).select('-password')   
 }

async Accept_request(id: string){
  const Id = new ObjectId(id);
  const user = await this.EcoleModel.findById(Id).select('-password');
if (!user){
      throw new RpcException(new BadRequestException(' No request found with this user id  ! '));
  }
     
  user.status = status.ACTIF
  await user.save();

  // const stat = await this.stats.findOne({Year : this.year , Month : this.month})
  // if(stat){
  // stat.nbRequestsAcceptes += 1
  // await stat.save() 
  // }
  
  const { name, email } = user;
const subject = "Request for Account Registering Accepted"

this.Sender.emit('send-acceptation-email',{name,subject,email});

console.log( 'Request acceptée');
}

async DeleteRequest(id:string){
  const Id = new ObjectId(id);
  const user = await this.EcoleModel.findById(Id).select('-password');
  if (!user){
    throw new RpcException(new BadRequestException(' No request found with this user id  ! '));
    }
    const {name, email} = user
    const deletionResult = await user.deleteOne();
    if (!deletionResult) {
      throw new RpcException(new BadRequestException(' Could not delete request ! '));
      }

    const subject = "Update on the Status of Registration Request"

    this.Sender.emit('send-rejection-email', {name,subject, email})
    console.log( 'Request rejetée');

}
}
