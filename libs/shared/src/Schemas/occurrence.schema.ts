import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { prestation } from "@app/shared"
import mongoose, { Date } from "mongoose";

@Schema({
    timestamps: true,
    collection:'Occurrences'
})

export class OccurrenceModel {
    @Prop({required:true})
    prestation: string
    @Prop({required:true})
    date: string
    @Prop({required:true})
    heureDebut: string
    @Prop({required:true})
    heureFin: string
    @Prop({required:true})
    lieuRDV: string
    @Prop({})
    commentaires: string
    // by putting the ref here we'r saying that this document is related to an other document in an other collection (agents)   
    @Prop({required:true, type : mongoose.Schema.Types.ObjectId , ref : 'TrainerModel'})
    idTrainer : mongoose.Schema.Types.ObjectId
    
    @Prop({required:true, type : mongoose.Schema.Types.ObjectId , ref : 'EcoleModel'})
    ecoleId : mongoose.Schema.Types.ObjectId

    @Prop({required:true, type : mongoose.Schema.Types.ObjectId , ref : 'LearnerModel'})
    idLearner : mongoose.Schema.Types.ObjectId

}

export const occurrence = SchemaFactory.createForClass(OccurrenceModel)