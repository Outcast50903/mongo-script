import { existsSync } from 'fs'
import { dirname, join } from 'path'

import { readFile, utils } from 'xlsx'

const readXLSXFile = <T>(path: string): T[] => {
  if (path === '') throw new Error('File path is empty')
  else if (!existsSync(join(dirname(require?.main?.filename ?? ''), 'files'))) {
    throw new Error('Files directory does not exist')
  } else if (!existsSync(join(dirname(require?.main?.filename ?? ''), 'files', path))) {
    throw new Error('File does not exist')
  }

  const workbook = readFile(`files/${path}`)
  const sheetName = workbook.SheetNames[0]
  return utils.sheet_to_json(workbook.Sheets[sheetName], {
    raw: false
  })
}

export default readXLSXFile
