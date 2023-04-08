import * as dayjs from 'dayjs';
import * as dotenv from 'dotenv';
import { readFile, utils } from 'xlsx';
import { mongoose } from "@typegoose/typegoose";
import { AnyBulkWriteOperation, ObjectId } from 'mongodb';

import { FileType } from 'types';
import createLog from 'utils/createLog';
import { TypegooseConnection } from 'connections';
import { Contracts, UpdatedBy, Vehicles } from 'schemas';

const main = async () => {
  try {
    const db = new TypegooseConnection();
    
    db.connect().then(async () => {
      const contractsCollection = db.createCollectionTypegoose(Contracts);
      const vehiclesCollection = db.createCollectionTypegoose(Vehicles);

      const contractBulkArr: AnyBulkWriteOperation<Contracts>[] = [];
      const vehiclesBulkArr: AnyBulkWriteOperation<Vehicles>[] = [];
      const errId: string[] = [];

      const workbook = readFile(process.env.FILE_PATH ?? '');
      const sheetName = workbook.SheetNames[0];
      const inputRows: FileType[] = utils.sheet_to_json(workbook.Sheets[sheetName], {
        raw: false,
      });

      inputRows.forEach(async row => {        
        const _id = new mongoose.Types.ObjectId(row.id);
        !mongoose.isValidObjectId(_id) && errId.push(row.id);
        
        const reactivationDate = new Date(dayjs(row.reactivationDate).format('YYYY/MM/DD'));
        const action = row.action === 'CADUCAR' ? 'expire' : row.action === 'RENOVAR' ? 'renewal' : 'suspend';
        const contractActions = row.action === 'CADUCAR' 
          ? { active: false, enabled: false, deletedAt: new Date(dayjs().format('YYYY/MM/DD')) }
            : row.action === 'RENOVAR' 
              ? { isPremium: true, reactivationDate }
              : { isPremium: false, reactivationDate };
        const vehicleActions = row.action === 'CADUCAR' 
          ? { enabled: false, deletedAt: new Date(dayjs().format('YYYY/MM/DD')) }
            : row.action === 'RENOVAR' 
              ? { isContractSuspended: false, isPremium: true } 
              : { isContractSuspended: true, isPremium: false };
        const updatedBy: UpdatedBy[] = [
          {
            updatedBy: new mongoose.Types.ObjectId(process.env.ADMIN_ID ?? ''),
            updatedAt: new Date(dayjs().format('YYYY/MM/DD')),
            action,
          }
        ];
        
        vehiclesBulkArr.push({
          updateOne: {
            filter: { vin: row.vin },
            //@ts-ignore
            update: { $set: { ...vehicleActions } }
          }
        });

        contractBulkArr.push({
          updateOne: {
            filter: { _id },
            update: { $set: { updatedBy, ...contractActions } }
          }
        });    
      });
      
      console.log("Cantidad de registros de contratos a actualizar: ", contractBulkArr.length);
      console.log("Cantidad de registros de vehículos a actualizar: ", vehiclesBulkArr.length);
      console.log("Cantidad de registros totales a actualizar: ", contractBulkArr.length + vehiclesBulkArr.length);      
    
      console.log("Cantidad de registros con id inválido: ", errId.length);

      if (vehiclesBulkArr.length > 0 && contractBulkArr.length > 0) {
        await contractsCollection?.bulkWrite(contractBulkArr, { ordered: false })
        .then(result => {
          console.log(`Se han encontrado ${result.matchedCount} contratos`);
          console.log(`Se han modificado ${result.modifiedCount} contratos`);
          console.log(`Se han eliminado ${result.deletedCount} contratos`);
          console.log(`Se han insertado ${result.insertedCount} contratos`);
          console.log(result);
          // db.close()
        })
        .catch(err => (db.close(), createLog(err)));

        await vehiclesCollection.bulkWrite(vehiclesBulkArr, )
        .then(result => {
          console.log(`Se han encontrado ${result.matchedCount} vehículos`);
          console.log(`Se han modificado ${result.modifiedCount} vehículos`);
          console.log(`Se han eliminado ${result.deletedCount} vehículos`);
          console.log(`Se han insertado ${result.insertedCount} vehículos`);
          console.log(result);
          db.close()
        })
        .catch(err => (db.close(), createLog(err)));

      } else db.close();      
    }).catch(err => (db.close(), createLog(err)));
  } catch (error) {
    createLog(error) 
  }
};

dotenv.config();
main();