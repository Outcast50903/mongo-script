import { MongoClient } from "mongodb";
import { IMongoDB } from "../../types";

export class MongoConnection implements IMongoDB {
  private client: MongoClient | undefined;

  async connect() {
    console.clear();
    console.log("------------------------------------------------------------------------------------------------------");
    console.log("Iniciando conexión de mongo ...");
    return this.client = await MongoClient.connect(
      process.env.MONGO_URL ?? "",
      // @ts-ignore
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
  }

  createCollection(collectionName: string) {
    console.log("Iniciando colección ...");
    const db = this.client?.db(process.env.MONGO_DB ?? "");
    return db?.collection(collectionName);
  }

  close() {
    console.log("Desconectando ...");
    this.client?.close();
  }
}