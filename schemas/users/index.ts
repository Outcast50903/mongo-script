import { modelOptions, prop } from '@typegoose/typegoose'
import { type mongo } from 'mongoose'

@modelOptions({ schemaOptions: { collection: 'users' } })
export class User {
  @prop()
  public _id: mongo.ObjectId

  @prop()
  public firstName: string

  @prop()
  public lastName: string

  @prop()
  public isEnabled: boolean
}

export default User
