import { ReturnModelType, getModelForClass, mongoose } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { IMongoDB } from "../../types";
import createLog from "../../utils/createLog";

export class TypegooseConnection implements IMongoDB {
  private client: typeof mongoose | undefined;

  constructor() {
    this.connect();
  }

  private async connect(): Promise<void> {
    console.clear();
    console.log("---------------------------------------------------------------------------------------------------");
    console.log("Iniciando conexión de mongo ...");
    this.client = await mongoose.connect(
      process.env.MONGO_URL ?? "",
      // @ts-ignore
      { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.MONGO_DB ?? "" }
    )
  }

  createCollectionTypegoose<T>(cls: new (...args: any[]) => T) {
    console.log("Iniciando colección ...");
    return getModelForClass(cls);
  }
  
  close() {
    console.log("Desconectando ...");
    this.client?.disconnect();
  }

  // @ts-ignore
  async createBulk<T>(
    collection: ReturnModelType<new (...args: any[]) => T, BeAnObject>, 
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