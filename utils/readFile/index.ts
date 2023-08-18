import { existsSync } from 'fs'
import { dirname, join } from 'path'

import { readFile, utils } from 'xlsx'

/**
 * Reads an XLSX or CSV file and returns its contents as an array of objects.
 * @param path - The path to the XLSX file.
 * @returns An array of objects representing the contents of the XLSX file.
 * @throws An error if the file path is empty, the files directory does not exist, or the file does not exist.
 */
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
