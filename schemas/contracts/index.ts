import { modelOptions, prop, mongoose } from '@typegoose/typegoose'

export class UpdatedBy {
  @prop({ required: true })
  public updatedBy: mongoose.Types.ObjectId

  @prop()
  public updatedAt: Date

  @prop()
  public action: string
}

@modelOptions({ schemaOptions: { collection: 'contracts' }, options: { allowMixed: 0 } })
export class Contracts {
  @prop()
  public _id: mongoose.Types.ObjectId

  @prop()
  public idString: string

  @prop()
  public createdAt: Date

  @prop()
  public modifiedAt?: Date

  @prop()
  public deletedAt?: Date

  @prop()
  public enabled: boolean

  @prop()
  public vehicleId: mongoose.Types.ObjectId

  @prop()
  public clientId: mongoose.Types.ObjectId

  @prop()
  public ticketId: mongoose.Types.ObjectId

  @prop()
  public vehicleIdString: string

  @prop()
  public clientIdString: string

  @prop()
  public ticketIdString: string

  @prop()
  public contractSource: string

  @prop()
  public financing: string

  @prop()
  public billingType: string

  @prop()
  public typeCar: string

  @prop()
  public active: boolean

  @prop()
  public isPremium: boolean

  @prop()
  public reactivationDate?: Date

  @prop({ type: [UpdatedBy] })
  public updatedBy?: UpdatedBy[]
}

export default Contracts
