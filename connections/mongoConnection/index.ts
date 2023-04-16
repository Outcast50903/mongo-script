import { type Collection, type Db, MongoClient } from 'mongodb'
import { type IMongoDB } from '../../types'
import createLog from '../../utils/createLog'
export class MongoConnection implements IMongoDB<string> {
  private client: MongoClient
  private db: Db | undefined

  constructor () {
    this.connect().catch(error => { createLog(error) })
  }

  private async connect (): Promise<void> {
    try {
      console.clear()
      console.log('-----------------------------------------------------------------------------------------------------')
      console.log('Iniciando conexión de mongo ...')
      this.client = await MongoClient.connect(
        process.env.MONGO_URL ?? '',
        // @ts-ignore
        { useNewUrlParser: true, useUnifiedTopology: true }
      )
    } catch (error) {
      console.log('Error en la conexión de mongo');
    }
  }
  
  async createCollection(collectionName: string): Promise<Collection<Document>> {
    console.log('Iniciando colección ...')
    this.client ?? await this.connect()
    this.db = this.client.db(process.env.MONGO_DB ?? '')
    return this.db?.collection(collectionName)
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
