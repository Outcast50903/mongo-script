import { type ReturnModelType } from '@typegoose/typegoose'
import { type BeAnObject } from '@typegoose/typegoose/lib/types'
import { type Collection } from 'mongoose'

export interface FileType {
  id: string
  vin: string
  action: 'CADUCAR' | 'RENOVAR' | 'SUSPENDER'
  reactivationDate: string
}

export interface IMongoDB {
  createCollection?: (collectionName: string) => Collection<Document> | ReturnModelType<any, BeAnObject> | undefined
  createCollectionTypegoose?: <T>(cls: new (...args: any[]) => T) => ReturnModelType<any, BeAnObject> | undefined
  createBulk: (
    collection: ReturnModelType<any, BeAnObject> | undefined,
    bulkArr: any[],
    collectionAlias: string
  ) => Promise<void>
  close: () => void
}
