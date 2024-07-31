import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps : true ,
    collection: 'Learners'
})
export class LearnerModel{
    @Prop({required:true})
    ecoleId: string
    @Prop({required: true})
    name : string;
    @Prop({required: true})
    email: string
    @Prop({required: true})
    phoneNumber: string

}
export const learner = SchemaFactory.createForClass(LearnerModel);

