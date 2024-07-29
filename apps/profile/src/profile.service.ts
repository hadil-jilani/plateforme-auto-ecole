import { EcoleModel, UpdatePasswordDto, UpdatePersonnalProfileDto } from '@app/shared';
import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';


export interface UserData {
  name: string;
  adresse : string; 
  email: string;
  password: string;
  phoneNumber: number;
  role : string ; 
}

@Injectable()
export class ProfileService {
 constructor(
@InjectModel(EcoleModel.name) private Ecole: mongoose.Model<EcoleModel>,
  private jwtService: JwtService
) {}

async findProfile(id : string): Promise<{user : UserData}> {
  const user = await this.Ecole.findById({_id : id}).select('-password')
  if (!user){
    throw new HttpException(new NotFoundException(" user not found ! "),404)  
  }
  return {user};
}

async DeleteProFile(id : string): Promise<string> { 
  const user = await this.Ecole.findById(id)
  if (!user){
    throw new HttpException(new NotFoundException(" User Not Found ! "),404)  
  }
  const del = await this.Ecole.findByIdAndDelete(id)
  if(!del){
    throw new HttpException(new BadRequestException(" Failed To Delete User "),400)
  }
  return "User Profile deleted successfully ";
 
  }

  async UpdateProfile(id : string, updateData: UpdatePersonnalProfileDto): Promise<string>
  {
    const {name,email,phoneNumber,adresse} = updateData; 
  
    const user = await this.Ecole.findById(id)
    if (!user){
      throw new HttpException(new NotFoundException("User Not Found !"),404)
    }
    const updatedFields = {};

  // Mettre à jour seulement les champs qui sont fournis dans UpdatePersonnalProfileDto
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



  
  // Appliquer les mises à jour à l'objet utilisateur
  Object.assign(user, updatedFields);

  // Sauvegarder les modifications dans la base de données
  await user.save();     
   
  return ` User has been Updated successfully ! `;
  }
  
  async UpdatePassword(id: string, updatePassword: UpdatePasswordDto) {
    const { OldPassword, NewPassword } = updatePassword;
    const user = await this.Ecole.findById(id);
    if (!user) {
        throw new HttpException(new NotFoundException(" User Not Found !"),404);
    }
    const currentPassword = user.password as string; 

    const isPasswordCorrect = await bcrypt.compare(OldPassword, currentPassword);
    if (!isPasswordCorrect) {
        throw new HttpException(new BadRequestException(" Old Password is incorrect ! "),400);
    }

    const hashedNewPassword = await bcrypt.hash(NewPassword, 10);
    user.password = hashedNewPassword;
    await user.save();  

    return 'Password has been successfully updated !';
}
}


