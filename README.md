# Mongo script

This is a simple script to update contracts and vehicles or other collections.

## Configuration

You need to create a `.env` file with the following variables:

```
MONGO_URL=mongodb://localhost:27017 # connection url
MONGO_DB=database # database name
FILE_PATH=path/to/file
ADMIN_ID=5e9c1c1c1c1c1c1c1c1c1c1c # admin or user id
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

## MongoDB

It's very important create a backup of the database before run the script.

[Delete all documents in the collections|](https://docs.mongodb.com/manual/reference/method/db.collection.deleteMany/)

```bash
$ mongo db.contracts.deleteMany({}); 
$ mongo db.vehicles.deleteMany({});
```

## Usage

```bash
$ ts-node index.ts
```

## Important

By default this script use `Typegoose` to connect to the database, but you can change it to `mongodb` if you want.

### Typegoose

```typescript
// connect to database
const db = new TypegooseConnection()

// create collections
const contractsCollection = db.createCollectionTypegoose(Contracts)
const vehiclesCollection = db.createCollectionTypegoose(Vehicles)
```

### Mongodb

```typescript
// connect to database
const db = new MongodbConnection()

// create collections
const contractsCollection = db.createCollection('contracts')
const vehiclesCollection = db.createCollection('vehicles')
```

> Note: the problem if you change mongodb connection is the script don't know the structure of the document.