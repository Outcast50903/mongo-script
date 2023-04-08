import { modelOptions, prop, mongoose } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: 'example' } })
export class Example {
  @prop({ required: true })
  _id: mongoose.Types.ObjectId;

  @prop({ required: true })
  name: string;
}

export default Example;