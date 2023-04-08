import { ReturnModelType, getModelForClass, mongoose } from "@typegoose/typegoose";
import Contracts from "../../schemas/contracts";
import { IMongoDB } from "../../types";

export class TypegooseConnection implements IMongoDB {
  private client: typeof mongoose | undefined;

  async connect() {
    console.clear();
    console.log("---------------------------------------------------------------------------------------------------");
    console.log("Iniciando conexión de mongo ...");
    return this.client = await mongoose.connect(
      process.env.MONGO_URL ?? "",
      // @ts-ignore
      { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.MONGO_DB ?? "" }
    )
  }

  createCollection() {
    console.log("Iniciando colección ...");
    return getModelForClass(Contracts);
  }

  createCollectionTypegoose<T>(cls: new (...args: any[]) => T) {
    console.log("Iniciando colección ...");
    return getModelForClass(cls);
  }
  
  close() {
    console.log("Desconectando ...");
    this.client?.disconnect();
  }
}