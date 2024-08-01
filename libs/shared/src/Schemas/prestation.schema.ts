import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
    timestamps: true,
    collection:'Prestations'
})

export class PrestationModel {
    @Prop({required:true, type : mongoose.Schema.Types.ObjectId , ref : 'SchoolModel'})
    schoolId : mongoose.Schema.Types.ObjectId
    @Prop({required:true})
    type: string
    @Prop()
    comments: string
}

export const prestation = SchemaFactory.createForClass(PrestationModel)