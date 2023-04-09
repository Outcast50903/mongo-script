import { type MongoClient } from 'mongodb'

// declare module 'mongodb' {
//   export interface CustomMongoClientOptions extends MongoClientOptions {
//     useNewUrlParser?: boolean
//     useUnifiedTopology?: boolean
//   }

//   export declare class CustomMongoClient extends MongoClient {
//     constructor (uri: string, options?: CustomMongoClientOptions)
//     static connect (url: string, options?: CustomMongoClientOptions): Promise<MongoClient>
//   }
// }

// declare module 'mongoose' {
//   export interface CustomConnectOptions extends ConnectOptions {
//     useNewUrlParser?: boolean
//     useUnifiedTopology?: boolean
//   }

//   function connect (uri: string, options?: CustomConnectOptions): Promise<Mongoose>
// }
