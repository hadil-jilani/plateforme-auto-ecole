import { SchoolModel, UpdatePasswordDto, UpdatePersonnalProfileDto } from '@app/shared';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';

export interface UserData {
  name: string;
  adresse: string;
  email: string;
  password: string;
  phoneNumber: number;
  role: string;
}

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(SchoolModel.name) private School: mongoose.Model<SchoolModel>,
    private jwtService: JwtService
  ) {}

  async findProfile(id: string): Promise<{ user: UserData }> {
    const user = await this.School.findById({ _id: id }).select('-password');
    if (!user) {
      throw new RpcException({
        message: 'User not found!',
        statusCode: 404,
      });
    }
    return { user };
  }

  async DeleteProFile(id: string) {
    const user = await this.School.findById(id);
    if (!user) {
      throw new RpcException({
        message: 'User Not Found!',
        statusCode: 404,
      });
    }
    const del = await this.School.findByIdAndDelete(id);
    if (!del) {
      throw new RpcException({
        message: 'Failed To Delete User',
        statusCode: 400,
      });
    }
    console.log( 'User Profile deleted successfully');
  }

  async UpdateProfile(id: string, updateData: UpdatePersonnalProfileDto) {
    const { name, email, phoneNumber, adresse } = updateData;

    const user = await this.School.findById(id);
    if (!user) {
      throw new RpcException({
        message: 'User Not Found!',
        statusCode: 404,
      });
    }
    const updatedFields = {};

    if (name) {
      updatedFields['name'] = name;
    }
    if (email) {
      updatedFields['email'] = email;
    }
    if (phoneNumber) {
      updatedFields['phoneNumber'] = phoneNumber;
    }
    if (adresse) {
      updatedFields['adresse'] = adresse;
    }

    Object.assign(user, updatedFields);

    await user.save();

    return user;
  }

  async UpdatePassword(id: string, updatePassword: UpdatePasswordDto) {
    const { OldPassword, NewPassword } = updatePassword;
    const user = await this.School.findById(id);
    if (!user) {
      throw new RpcException({
        message: 'User Not Found!',
        statusCode: 404,
      });
    }
    const currentPassword = user.password as string;

    const isPasswordCorrect = await bcrypt.compare(OldPassword, currentPassword);
    if (!isPasswordCorrect) {
      throw new RpcException({
        message: 'Old Password is incorrect!',
        statusCode: 400,
      });
    }

    const hashedNewPassword = await bcrypt.hash(NewPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    console.log('Password has been successfully updated!');
  }
}
