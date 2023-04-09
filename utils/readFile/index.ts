import { readFile, utils } from 'xlsx'

const readXLSXFile = <T>(path: string): T[] => {
  const workbook = readFile(path)
  const sheetName = workbook.SheetNames[0]
  return utils.sheet_to_json(workbook.Sheets[sheetName], {
    raw: false
  })
}

export default readXLSXFile
