import { ReturnModelType, mongoose } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { MongoClient } from "mongodb";
import { Collection } from "mongoose";

export type FileType = {
  id: string
  vin: string
  action: 'CADUCAR' | 'RENOVAR'  | 'SUSPENDER'
  reactivationDate: string
};

export interface IMongoDB {
  connect: () => Promise<MongoClient | typeof mongoose>;
  createCollection: (collectionName: string) => Collection<mongoose.mongo.BSON.Document> | ReturnModelType<any, BeAnObject> | undefined;
  close: () => void;
  createCollectionTypegoose?:<T> (cls: new (...args: any[]) => T) => ReturnModelType<any, BeAnObject> | undefined;
}