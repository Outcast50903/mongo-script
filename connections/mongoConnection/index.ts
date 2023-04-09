import { type Collection, type Db, MongoClient } from 'mongodb'
import { type IMongoDB } from '../../types'
import createLog from '../../utils/createLog'
export class MongoConnection implements IMongoDB {
  private client: MongoClient | undefined
  private db: Db | undefined

  constructor () {
    this.connect().catch(error => { createLog(error) })
  }

  private async connect (): Promise<void> {
    console.clear()
    console.log('-----------------------------------------------------------------------------------------------------')
    console.log('Iniciando conexión de mongo ...')
    this.client = await MongoClient.connect(
      process.env.MONGO_URL ?? '',
      // @ts-ignore
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    this.db = this.client?.db(process.env.MONGO_DB ?? '')
  }

  createCollection (collectionName: string): Collection<Document> | undefined {
    console.log('Iniciando colección ...')
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
