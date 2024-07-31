import { Prop, SchemaFactory,Schema } from "@nestjs/mongoose"
import { ProfileModule } from "apps/profile/src/profile.module"

@Schema({
    timestamps: true,
    collection:'Agenda'
})
export class AgendaModel {
    @Prop({required:true})
    ecoleId: string

    @Prop({required:true})
    name: string

    @Prop({required:true})
    trainersId: string[]
}
export const profile = SchemaFactory.createForClass(AgendaModel)