import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Role} from './role.enum'
import { status } from "./status.enum";

@Schema({
    timestamps : true ,
    collection: 'School'
})

export class SchoolModel {

  @Prop({required : true})
  name : string;

  @Prop({required : true})
  email: string;

  @Prop({required : true})
  phoneNumber: number;

  @Prop({required : true})
  adresse: string;

  @Prop({required : true})
  password: string;
  

  @Prop({required : true, enum: Role, default: Role.SCHOOL})
  role: string;
  @Prop({required : true, enum: status, default: status.PENDING})
  status: string;
  @Prop()
  refreshToken: string;
  
}
export const school = SchemaFactory.createForClass(SchoolModel);

