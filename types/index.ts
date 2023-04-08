import { ReturnModelType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { Collection } from "mongoose";

export type FileType = {
  id: string
  vin: string
  action: 'CADUCAR' | 'RENOVAR'  | 'SUSPENDER'
  reactivationDate: string
};

export interface IMongoDB {
  createCollection?: (collectionName: string) => Collection<Document> | ReturnModelType<any, BeAnObject> | undefined;
  createCollectionTypegoose?: <T>(cls: new (...args: any[]) => T) => ReturnModelType<any, BeAnObject> | undefined;
  createBulk: <T>(
    collection: ReturnModelType<new (...args: any[]) => T, BeAnObject> | Collection<Document>, 
    bulkArr: any[],
    collectionAlias: string
  ) => Promise<void>;
  close: () => void;
}