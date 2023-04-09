import { Collection, Db, MongoClient } from "mongodb";
import { IMongoDB } from "../../types";
import createLog from "../../utils/createLog";
export class MongoConnection implements IMongoDB {
  private client: MongoClient | undefined;
  private db: Db | undefined;

  constructor() {
    this.connect();
  }

  private async connect(): Promise<void> {
    console.clear();
    console.log("------------------------------------------------------------------------------------------------------");
    console.log("Iniciando conexión de mongo ...");
    this.client = await MongoClient.connect(
      process.env.MONGO_URL ?? "",
      // @ts-ignore
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    this.db = this.client?.db(process.env.MONGO_DB ?? "");
  }

  createCollection(collectionName: string): Collection<Document> | undefined{
    console.log("Iniciando colección ...");
    return this.db?.collection(collectionName);
  }

  close() {
    console.log("Desconectando ...");
    this.client?.close();
  }

    // @ts-ignore
    async createBulk(
      collection: Collection<Document>, 
      bulkArr: any[],
      collectionAlias: string = 'documentos'
    ) {
      try {
        const result = await collection?.bulkWrite(bulkArr, { ordered: false })

        console.log(`Se han encontrado ${result.matchedCount} ${collectionAlias}`);
        console.log(`Se han modificado ${result.modifiedCount} ${collectionAlias}`);
        console.log(`Se han eliminado ${result.deletedCount} ${collectionAlias}`);
        console.log(`Se han insertado ${result.insertedCount} ${collectionAlias}`);

        const notModified = result.insertedCount - result.modifiedCount;
        notModified !== 0 && console.warn(`No se han modificado ${notModified} ${collectionAlias}`);
        
        console.log(result);
      } catch (error) {
        this.close();
        createLog(error)
      }
    }
}