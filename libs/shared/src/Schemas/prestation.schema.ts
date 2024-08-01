import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
    collection:'Prestations'
})

export class PrestationModel {
    @Prop({required: true})
    schoolId: string
    @Prop({required:true})
    type: string
    @Prop()
    comments: string
}

export const prestation = SchemaFactory.createForClass(PrestationModel)