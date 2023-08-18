# Mongo script

This is a simple script to update contracts and vehicles or other collections.

## Configuration

You need to create a `.env` file with the following variables:

```
#required variables
MONGO_URL=
MONGO_DB_NAME=

#optional variables (if you read a file)
FILE_PATH=
```
## Installations

1. Install ts-node

```bash
$ yarn global add ts-node
```

2. install dependencies

```bash
$ yarn
```

## Docker

You can run the script with docker, you need to create a `.env` file with the same variables as the previous section.

```bash
$ docker-compose up
```

## Usage

```bash
$ yarn start
```

It's very important create a backup of the database before run the script, this step is very important because the script update the database directly.

In any case, the script requires a `.json` file in the `./backups` folder which as the name indicates is the backup of the collection to be modified.

### Mongodb Connection

By default this script use `Typegoose` to connect to the database, but you can change it to `mongodb` if you want.

#### Typegoose

```typescript
// connect to database
const db = new TypegooseConnection()

// create collections
const usersCollection = db.createCollection(Users)
```

#### Mongodb

```typescript
// connect to database
const db = new MongoConnection()

// create collections
const usersCollection = db.createCollection('users')
```

### Read file

```typescript
// Reads an XLSX or CSV file and returns its contents as an array of objects.
const inputRows = readXLSXFile<FileType>(process.env.FILE_NAME ?? '')
for await (const row of inputRows) {
  // do something
}
```

### API Request

```typescript
// create an instance of the api request
const consumerRequest = new Api(
  process.env.API_URL ?? '',
  { Authenticate: `${process.env.API_KEY ?? ''}` }
)

// get data from api
const consumer = await consumerRequest.get(`/consumer/${row.id}`)
```

### Update documents

```typescript
// An array of bulk write operations for the Users collection.
const usersBulkArr: Array<AnyBulkWriteOperation<Users>> = []

// Add a new operation to the array
usersBulkArr.push({
  updateOne: {
    filter: { _id: user._id, isEnabled: true },
    update: { $set: { firstName: row.name } }
  }
})

// Modify multiple documents in a collection
await db.createBulk(usersCollection, usersBulkArr, 'users')
```

> Note: the problem if you change mongodb connection is the script don't know the structure of the document.