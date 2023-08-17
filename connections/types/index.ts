import { type ReturnModelType } from '@typegoose/typegoose'
import { type BeAnObject } from '@typegoose/typegoose/lib/types'
import { type Document, type MongoClient } from 'mongodb'
import type mongoose from 'mongoose'
import { type Collection } from 'mongoose'

export interface IMongoDB<T> {
  connect: (dbName: string) => Promise<typeof mongoose | MongoClient | undefined>
  createCollection: (collectionName: T) =>
  Collection<Document> | ReturnModelType<any, BeAnObject> | undefined
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
