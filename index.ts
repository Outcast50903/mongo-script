import * as dotenv from 'dotenv'

import main from './app'
import { TypegooseConnection } from './connections'
import { findBackups } from './utils'

void (async () => {
  dotenv.config()
  findBackups()

  const db = new TypegooseConnection()
  await main(db)
})()
