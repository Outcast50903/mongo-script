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

/**
 * Class for MongoDB connection
 * @implements IMongoDB
 */
export default class TypegooseConnection implements IMongoDB<new (...args: unknown[]) => any> {
  private client: typeof mongoose | undefined

  /**
   * Creates an instance of TypegooseConnection and connects to the MongoDB database.
   */
  constructor () {
    void (async () => await this.connect(process.env.MONGO_DB_NAME ?? ''))()
  }

  /**
   * Connects to the MongoDB database.
   * @param dbName - The name of the database to connect to.
   * @returns A Promise that resolves to the Mongoose connection object.
   */
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

  /**
   * Creates a new collection in the database.
   * @param cls - The class representing the model to be used with the collection.
   * @returns A Mongoose model object for the collection.
   */
  createCollection<T>(cls: new (...args: unknown[]) => T): ReturnModelType<new (...args: unknown[]) => T, BeAnObject> {
    console.log('Iniciando colección ...')
    return getModelForClass(cls)
  }

  /**
   * Closes the connection to the database.
   * @returns A Promise that resolves when the connection is closed.
   */
  async close (): Promise<void> {
    console.log('Desconectando ...')
    await this.client?.disconnect()
  }

  /**
   * Creates multiple documents in a collection using bulk write operations.
   * @param collection - The Mongoose model object for the collection.
   * @param bulkArr - An array of objects representing the documents to be created.
   * @param collectionAlias - An optional string representing the name of the collection.
   * @returns A Promise that resolves when the bulk write operation is complete.
   */
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
