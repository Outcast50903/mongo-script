import { type Collection, type Db, MongoClient, type MongoClientOptions, type Document } from 'mongodb'

import { type IMongoDB } from '../../connections'
import { createLog } from '../../utils'

export class MongoConnection implements IMongoDB<string> {
  private client: MongoClient
  private db: Db | undefined

  constructor () {
    void (async () => await this.connect(process.env.MONGO_DB_NAME ?? ''))()
  }

  async connect (dbName: string): Promise<MongoClient | undefined> {
    try {
      console.log('Initializing MongoDB connection...')
      const connection = await MongoClient.connect(
        process.env.MONGO_URL ?? '',
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        { useNewUrlParser: true, useUnifiedTopology: true } as MongoClientOptions
      )

      this.client = connection
      this.db = this.client.db(dbName)
      console.log('MongoDB connection established')

      return connection
    } catch (error) {
      console.log('Error en la conexión de mongo')
      return undefined
    }
  }

  async createCollection (collectionName: string): Promise<Collection<Document>> {
    console.log('Iniciando colección ...')
    const collection = this.db?.collection<Document>(collectionName)
    if (collection == null) {
      throw new Error(`Collection ${collectionName} not found`)
    }

    return collection
  }

  close (): void {
    console.log('Desconectando ...')
    this.client?.close().catch((error: unknown) => { createLog(error) })
  }

  async createBulk (
    collection: Collection<Document>,
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
      this.close()
      createLog(error)
    }
  }
}
