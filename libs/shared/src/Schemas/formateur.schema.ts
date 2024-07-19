import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps : true ,
    collection: 'Formateurs'
})
export class FormateurModel{
    @Prop({required:true})
    ecoleId: string
    @Prop({required: true})
    name : string;
    @Prop({required: true})
    email: string
    @Prop()
    creneauxIndisponibles: string[]
}
export const formateur = SchemaFactory.createForClass(FormateurModel);

