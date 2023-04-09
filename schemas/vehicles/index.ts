import { modelOptions, prop, mongoose } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { collection: 'vehicles' } })
export class Vehicles {
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
  public plateNumber: string

  @prop()
  public brand: string

  @prop()
  public model: string

  @prop()
  public year: string

  @prop()
  public mainImageUrl?: string

  @prop()
  public isPremium: boolean

  @prop()
  public vin: string

  @prop()
  public gpsServiceProvider: string

  @prop()
  public gpsDeviceId: string

  @prop()
  public qrDeviceId: string

  @prop()
  public deviceImei: boolean

  @prop()
  public mileage: number

  @prop()
  public speedLimit: number

  @prop()
  public vehicleEQ: boolean

  @prop()
  public isContractSuspended: boolean

  @prop()
  public groupId: number
}

export default Vehicles
