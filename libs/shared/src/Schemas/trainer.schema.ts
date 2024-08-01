import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
    timestamps : true ,
    collection: 'Trainers'
})
export class TrainerModel{
    @Prop({required:true, type : mongoose.Schema.Types.ObjectId , ref : 'SchoolModel'})
    schoolId : mongoose.Schema.Types.ObjectId
    @Prop({required: true})
    name : string;
    @Prop({required: true})
    email: string
    @Prop()
    unavailableSlots: string[]
    @Prop({required: true})
    phoneNumber: string
}
export const trainer = SchemaFactory.createForClass(TrainerModel);

