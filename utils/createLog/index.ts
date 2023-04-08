import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import * as dayjs from 'dayjs'

const createLog = (value: string | unknown) => {
  console.log("Creando log ...");
  
  const fileName = `log_${dayjs().format('DDMMYYYYHHmmss')}.json`;  
  
  const filePath = join(dirname(require?.main?.filename ?? ''), 'logs', fileName);
  if (!existsSync(dirname(filePath))) mkdirSync(dirname(filePath), { recursive: true });

  console.error(`Ha ocurrido un error: ${value}`);
  console.info(`por favor revisar el archivo de log: ${fileName}`);
  
  writeFileSync(filePath, `${value}`);
};

export default createLog;