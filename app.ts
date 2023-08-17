import { type AnyBulkWriteOperation } from 'mongodb'
import mongoose from 'mongoose'

import { Api } from './api'
import { type TypegooseConnection } from './connections'
import { Users } from './schemas'
import { type FileType } from './types'
import { createLog, readXLSXFile } from './utils'

const main = async (db: TypegooseConnection): Promise<void> => {
  try {
    const consumerRequest = new Api(
      process.env.API_URL ?? '',
      { Authenticate: `${process.env.API_KEY ?? ''}` }
    )

    const usersCollection = db.createCollection(Users)

    const usersBulkArr: Array<AnyBulkWriteOperation<Users>> = []
    const errId: object[] = []

    const inputRows = readXLSXFile<FileType>(process.env.FILE_NAME ?? '')
    for await (const row of inputRows) {
      if (!mongoose.isValidObjectId(row.id)) {
        errId.push(row)
        continue
      };

      const consumer = await consumerRequest.get(`/consumer/${row.id}`)
      if (consumer === null) {
        errId.push({ id: row.id, error: 'No se encontró el consumer' })
        continue
      }

      const user = await usersCollection.findOne({ _id: row.id, isEnabled: true }).exec()
      if (user === null) {
        errId.push({ id: row.id, error: 'No se encontró el consumer-vehicle' })
        continue
      }

      usersBulkArr.push({
        updateOne: {
          filter: { _id: user._id, isEnabled: true },
          update: { $set: { firstName: row.name } }
        }
      })
    }

    if (usersBulkArr.length > 0) {
      await db.createBulk(usersCollection, usersBulkArr, 'ConsumerVehicles')
    }

    await db.close()
  } catch (error) {
    await db.close()
    createLog(error)
  }
}

export default main
