import { SchoolModel, status } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(SchoolModel.name) private SchoolModel: mongoose.Model<SchoolModel>,
    @Inject('Request') private Sender: ClientProxy
  ) {}

  async GetRequests() {
    return await this.SchoolModel.find({ status: status.PENDING }).select('-password');
  }

  async Accept_request(id: string) {
    const Id = new ObjectId(id);
    const user = await this.SchoolModel.findById(Id).select('-password');
    if (!user) {
      throw new RpcException({
        message: 'No request found with this user id!',
        statusCode: 404
      });
    }

    user.status = status.ACTIVE;
    await user.save();

    const { name, email } = user;
    const subject = "Request for Account Registering Accepted";
    this.Sender.emit('send-acceptation-email', { name, subject, email });

    console.log('Request accepted');
  }

  async DeleteRequest(id: string) {
    const Id = new ObjectId(id);
    const user = await this.SchoolModel.findById(Id).select('-password');
    if (!user) {
      throw new RpcException({
        message: 'No request found with this user id!',
        statusCode: 404
      });
    }

    const { name, email } = user;
    const deletionResult = await user.deleteOne();
    if (!deletionResult) {
      throw new RpcException({
        message: 'Could not delete request!',
        statusCode: 400
      });
    }

    const subject = "Update on the Status of Registration Request";
    this.Sender.emit('send-rejection-email', { name, subject, email });
    console.log('Request rejected');
  }
}
