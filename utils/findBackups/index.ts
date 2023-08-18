import { existsSync, readdirSync } from 'fs'
import { dirname, join } from 'path'

/**
 * Finds backups in the 'backups' directory of the project.
 * @throws {Error} If the 'backups' directory does not exist or if there are no backups found.
 * @returns {void}
 */
const findBackups = (): void => {
  if (!existsSync(join(dirname(require?.main?.filename ?? ''), 'backups'))) {
    throw new Error('Files directory does not exist')
  }

  const files = readdirSync(join(dirname(require?.main?.filename ?? ''), 'backups'))
  const jsonExtension = files.filter(file => file.includes('.json'))
  const xlsxExtension = files.filter(file => file.includes('.xlsx'))

  if (jsonExtension.length === 0 && xlsxExtension.length === 0) {
    throw new Error('Remember to make a backup of the collections before making changes.')
  }
}

export default findBackups
