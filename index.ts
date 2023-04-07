import { readFile, utils } from 'xlsx';
import { AnyBulkWriteOperation, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';

import { connectMongo, createCollection } from './utils/connectWithMongo';
import { FileType } from './types';
import createLog from './utils/createLogFile';

const main = async () => {
  try {
    const client = await connectMongo();
    
    client.connect().then(async () => {
      const collection = createCollection(client);

      const bulkArr: AnyBulkWriteOperation<any>[] = [];

      const workbook = readFile(process.env.FILE_PATH ?? '');
      const sheetName = workbook.SheetNames[0];
      const inputRows: FileType[] = utils.sheet_to_json(workbook.Sheets[sheetName]);

      inputRows.forEach(row => {
        const _id = new ObjectId(row.Id);
        const name = row.name;
        
        bulkArr.push({
          updateOne: {
            filter: { _id },
            update: { $set: { name } }
          }
        });    
      });

      console.log("Cantidad de registros a actualizar: ", bulkArr.length);
      
      if (bulkArr.length > 0) collection.bulkWrite(bulkArr, { ordered: false })
        .then(result => {
          console.log(`Se han encontrado ${result.matchedCount} documentos`);
          console.log(`Se han modificado ${result.modifiedCount} documentos`);
          client.close()
        })
        .catch(err => createLog(err));
      else client.close();      
    }).catch(err => (console.log("Cerrando sesión ..."), client.close(), createLog(err)));
  } catch (error) {
    createLog(error) 
  }
}; 

// createReadStream(file)
//   .pipe(csv())
//   .on('data', data => {
//     printLog(data);
//     const id = data.id;
//     const name = data.name;
    
//     bulkArr.push({
//       updateOne: {
//         filter: { id },
//         update: { $set: { name } }
//       }
//     });

//     print(`Updating ${id} - ${name}`);
//   })
//   .on('end', () => {
//     if (bulkArr > 0) {
//       collectionName.bulkWrite(collectionName, (err, result) => {
//         if (err) fs.writeFileSync(filePath, err.toString());
//         print(`Updated ${result.modifiedCount} contract(s)`);
//         bulkArr = [];
//         client.close();
//       });
//     } else client.close();
//   });

dotenv.config();
main();