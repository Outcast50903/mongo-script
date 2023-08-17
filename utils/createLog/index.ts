import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'

import dayjs from 'dayjs'

const createLog = (value: string | unknown): void => {
  console.log('Creando log ...')

  const fileName = `log_${dayjs().format('DDMMYYYYHHmmss')}.json`

  const filePath = join(dirname(require?.main?.filename ?? ''), 'logs', fileName)
  if (!existsSync(dirname(filePath))) mkdirSync(dirname(filePath), { recursive: true })

  console.info(`por favor revisar el archivo de log: ${fileName}`)

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  writeFileSync(filePath, `${value}`)
}

export default createLog
