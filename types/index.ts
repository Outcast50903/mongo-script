import { type ReturnModelType } from '@typegoose/typegoose'
import { type BeAnObject } from '@typegoose/typegoose/lib/types'
import { type Collection } from 'mongoose'

export interface FileType {
  id: string
  vin: string
  action: 'CADUCAR' | 'RENOVAR' | 'SUSPENDER'
  reactivationDate: string
}

export interface IMongoDB<T> {
  createCollection:(collectionName: T) => 
    Collection<Document> | ReturnModelType<any, BeAnObject> | undefined
  // createCollectionTypegoose?: <T>(cls: new (...args: any[]) => T) => ReturnModelType<any, BeAnObject> | undefined
  createBulk: <T>(
    collection: ReturnModelType<any, BeAnObject> | undefined,
    bulkArr: T[],
    collectionAlias: string
  ) => Promise<void>
  validateChanges?: <T>(
    collection: ReturnModelType<new (...args: unknown[]) => T, BeAnObject>,
    query: Record<string, unknown>,
  ) => Promise<void>
  close: () => void
}
