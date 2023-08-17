import { type ReturnModelType, getModelForClass, mongoose } from '@typegoose/typegoose'
import { type BeAnObject } from '@typegoose/typegoose/lib/types'
import { type ConnectOptions } from 'mongoose'

import { type IMongoDB } from '../../connections'
import { createLog } from '../../utils'

const statusConnection: Record<number, string> = {
  0: 'Disconnected',
  1: 'Connected',
  2: 'Connecting',
  3: 'Disconnecting'
}

export default class TypegooseConnection implements IMongoDB<new (...args: unknown[]) => any> {
  private client: typeof mongoose | undefined

  constructor () {
    void (async () => await this.connect(process.env.MONGO_DB_NAME ?? ''))()
  }

  async connect (dbName: string): Promise<typeof mongoose> {
    console.log('Initializing MongoDB connection...')
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const connection = await mongoose.connect(process.env.MONGO_URL ?? '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName
    } as ConnectOptions)

    console.log(statusConnection[connection.connection.readyState])

    this.client = connection

    return connection
  }

  createCollection<T>(cls: new (...args: unknown[]) => T): ReturnModelType<new (...args: unknown[]) => T, BeAnObject> {
    console.log('Iniciando colección ...')
    return getModelForClass(cls)
  }

  async close (): Promise<void> {
    console.log('Desconectando ...')
    await this.client?.disconnect()
  }

  async createBulk<T>(
    collection: ReturnModelType<new (...args: unknown[]) => T, BeAnObject>,
    bulkArr: any[],
    collectionAlias: string = 'documentos'
  ): Promise<void> {
    try {
      const result = await collection?.bulkWrite(bulkArr, { ordered: false })

      console.log(`Se han encontrado ${result.matchedCount} ${collectionAlias}`)
      console.log(`Se han modificado ${result.modifiedCount} ${collectionAlias}`)
      console.log(`Se han eliminado ${result.deletedCount} ${collectionAlias}`)
      console.log(`Se han insertado ${result.insertedCount} ${collectionAlias}`)

      const notModified = result.matchedCount - result.modifiedCount
      notModified !== 0 && console.warn(`No se han modificado ${notModified} ${collectionAlias}`)

      console.log(result)
    } catch (error) {
      await this.close()
      createLog(error)
    }
  }
}
