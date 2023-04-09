import { type Collection, MongoClient } from 'mongodb'

const connectMongo = async () => {
  console.clear()
  console.log('Iniciando conexión de mongo ...')
  return await MongoClient.connect(
    process.env.MONGO_URL ?? '', { useNewUrlParser: true, useUnifiedTopology: true }
  )
}

const createCollection = (client: MongoClient): Collection<Document> => {
  console.log('Iniciando colección ...')
  const db = client.db(process.env.MONGO_DB ?? '')
  return db.collection(process.env.MONGO_COLLECTION ?? '')
}

export {
  connectMongo,
  createCollection
}
