import * as dayjs from 'dayjs'
import * as dotenv from 'dotenv'
import { mongoose } from '@typegoose/typegoose'
import { type AnyBulkWriteOperation } from 'mongodb'

import { FileType } from './types'
import { TypegooseConnection } from './connections'
import { Contracts, UpdatedBy, Vehicles } from './schemas'
import { createLog, isValidVin, readXLSXFile, findBackups } from './utils'

const main = async (): Promise<void> => {
  try {
    findBackups()
    const db = new TypegooseConnection()
    const contractsCollection = db.createCollection(Contracts)
    const vehiclesCollection = db.createCollection(Vehicles)

    const contractBulkArr: Array<AnyBulkWriteOperation<Contracts>> = []
    const vehiclesBulkArr: Array<AnyBulkWriteOperation<Vehicles>> = []
    const errId: FileType[] = []

    const inputRows = readXLSXFile<FileType>(process.env.FILE_NAME ?? '')
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
      const contractActions = row.action === 'CADUCAR'
        ? { active: false, enabled: false, deletedAt: new Date() }
        : row.action === 'RENOVAR'
          ? { isPremium: true, reactivationDate }
          : { isPremium: false, reactivationDate }
      const vehicleActions = row.action === 'CADUCAR'
        ? { enabled: false, deletedAt: new Date() }
        : row.action === 'RENOVAR'
          ? { isContractSuspended: false, isPremium: true }
          : { isContractSuspended: true, isPremium: false }

      vehiclesBulkArr.push({
        updateOne: {
          filter: { vin: row.vin, enabled: true },
          update: { $set: { modifiedAt: new Date(), ...vehicleActions } }
        }
      })

      contractBulkArr.push({
        updateOne: {
          filter: { _id, enabled: true },
          update: { $set: { modifiedAt: new Date(), ...contractActions } }
        }
      })
    })

    console.log('Cantidad de registros de contratos y vehículos a actualizar: ', contractBulkArr.length)
    console.log('Cantidad de registros totales a actualizar: ', contractBulkArr.length - errId.length)

    console.log('Cantidad de registros con errores: ', errId.length)
    errId.length > 0 && createLog(JSON.stringify(errId))

    if (vehiclesBulkArr.length > 0 && contractBulkArr.length > 0) {
      await db.createBulk(contractsCollection, contractBulkArr, 'contratos')
      await db.validateChanges(
        contractsCollection, 
        { _id: { $in: inputRows.map(row => new mongoose.Types.ObjectId(row.id)) }, enabled: true }
      )
      await db.createBulk<Vehicles>(vehiclesCollection, vehiclesBulkArr, 'vehículos')
      await db.validateChanges(
        vehiclesCollection, 
        { vin: { $in: inputRows.map(row => { 
          if (!isValidVin(row.vin)) return
          return row.vin
        }) }, enabled: true })
      db.close()
    } else db.close()
  } catch (error) {
    createLog(error)
  }
}

dotenv.config()
main().then(() => { console.log('Proceso finalizado') }).catch(err => { console.log(err) })
