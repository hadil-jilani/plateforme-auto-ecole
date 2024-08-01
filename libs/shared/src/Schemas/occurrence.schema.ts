import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { prestation } from "@app/shared"
import mongoose, { Date } from "mongoose";

@Schema({
    timestamps: true,
    collection:'Occurrences'
})

export class OccurrenceModel {
    @Prop({required:true})
    date: string
    @Prop({required:true})
    startHour: string
    @Prop({required:true})
    endHour: string
    @Prop({required:true})
    place: string
    @Prop({})
    comments: string
    // by putting the ref here we'r saying that this document is related to an other document in an other collection (agents)   
    @Prop({required:true, type : mongoose.Schema.Types.ObjectId , ref : 'TrainerModel'})
    trainerId : mongoose.Schema.Types.ObjectId
    
    @Prop({required:true, type : mongoose.Schema.Types.ObjectId , ref : 'SchoolModel'})
    schoolId : mongoose.Schema.Types.ObjectId

    @Prop({required:true, type : mongoose.Schema.Types.ObjectId , ref : 'LearnerModel'})
    learnerId : mongoose.Schema.Types.ObjectId
    @Prop({required:true, type : mongoose.Schema.Types.ObjectId , ref : 'PrestationModel'})
    prestationId : mongoose.Schema.Types.ObjectId

}

export const occurrence = SchemaFactory.createForClass(OccurrenceModel)