import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps : true ,
    collection: 'Trainers'
})
export class TrainerModel{
    @Prop({required:true})
    ecoleId: string
    @Prop({required: true})
    name : string;
    @Prop({required: true})
    email: string
    @Prop()
    creneauxIndisponibles: string[]
    @Prop({required: true})
    phoneNumber: string
}
export const trainer = SchemaFactory.createForClass(TrainerModel);

