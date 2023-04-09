import * as dayjs from 'dayjs'
import * as dotenv from 'dotenv'
import { mongoose } from '@typegoose/typegoose'
import { type AnyBulkWriteOperation } from 'mongodb'

import { FileType } from './types'
import { TypegooseConnection } from './connections'
import { Contracts, UpdatedBy, Vehicles } from './schemas'
import { createLog, isValidVin, readXLSXFile } from './utils'

const main = async (): Promise<void> => {
  try {
    const db = new TypegooseConnection()
    const contractsCollection = db.createCollectionTypegoose(Contracts)
    const vehiclesCollection = db.createCollectionTypegoose(Vehicles)

    const contractBulkArr: Array<AnyBulkWriteOperation<Contracts>> = []
    const vehiclesBulkArr: Array<AnyBulkWriteOperation<Vehicles>> = []
    const errId: FileType[] = []

    const inputRows = readXLSXFile<FileType>(process.env.FILE_PATH ?? '')
    inputRows.map(async row => {
      if (!mongoose.isValidObjectId(row.id)) {
        errId.push(row)
        return
      };

      if (!isValidVin(row.vin)) {
        errId.push(row)
        return
      }

      const _id = new mongoose.Types.ObjectId(row.id)
      const reactivationDate = new Date(dayjs(row.reactivationDate).format('YYYY/MM/DD'))
      const action = row.action === 'CADUCAR' ? 'expire' : row.action === 'RENOVAR' ? 'renewal' : 'suspend'
      const contractActions = row.action === 'CADUCAR'
        ? { active: false, enabled: false, deletedAt: new Date(dayjs().format('YYYY/MM/DD')) }
        : row.action === 'RENOVAR'
          ? { isPremium: true, reactivationDate }
          : { isPremium: false, reactivationDate }
      const vehicleActions = row.action === 'CADUCAR'
        ? { enabled: false, deletedAt: new Date(dayjs().format('YYYY/MM/DD')) }
        : row.action === 'RENOVAR'
          ? { isContractSuspended: false, isPremium: true }
          : { isContractSuspended: true, isPremium: false }
      const updatedBy: UpdatedBy[] = [
        {
          updatedBy: new mongoose.Types.ObjectId(process.env.ADMIN_ID ?? ''),
          updatedAt: new Date(),
          action
        }
      ]

      vehiclesBulkArr.push({
        updateOne: {
          filter: { vin: row.vin, enabled: true },
          update: { $set: { modifiedAt: new Date(), ...vehicleActions } }
        }
      })

      contractBulkArr.push({
        updateOne: {
          filter: { _id, enabled: true },
          update: { 
            $set: { modifiedAt: new Date(), ...contractActions },
            // $push: { updatedBy: { $each: updatedBy, $sort: { score: -1 } } } 
          }
        }
      })
    })

    console.log('Cantidad de registros de contratos a actualizar: ', contractBulkArr.length)
    console.log('Cantidad de registros de vehículos a actualizar: ', vehiclesBulkArr.length)
    console.log('Cantidad de registros totales a actualizar: ', contractBulkArr.length + vehiclesBulkArr.length)

    console.log('Cantidad de registros con id inválido: ', errId.length)
    errId.length > 0 && createLog(JSON.stringify(errId))

    if (vehiclesBulkArr.length > 0 && contractBulkArr.length > 0) {
      await db.createBulk(vehiclesCollection, vehiclesBulkArr, 'vehículos')
      await db.createBulk(contractsCollection, contractBulkArr, 'contratos')
      db.close()
    } else db.close()
  } catch (error) {
    createLog(error)
  }
}

dotenv.config()
main().then(() => { console.log('Proceso finalizado') }).catch(err => { console.log(err) })
