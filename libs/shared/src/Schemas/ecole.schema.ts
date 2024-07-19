import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Role} from './role.enum'
import { status } from "./status.enum";

@Schema({
    timestamps : true ,
    collection: 'Ecole'
})

export class EcoleModel {

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
  

  @Prop({required : true, enum: Role, default: Role.ECOLE})
  role: string;
  @Prop({required : true, enum: status, default: status.EN_ATTENTE})
  status: string;
  
}
export const ecole = SchemaFactory.createForClass(EcoleModel);

