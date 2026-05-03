import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const filter = {};

const client = await MongoClient.connect(
  'mongodb://ac-gu5bpnz-shard-00-02.8brmucx.mongodb.net,ac-gu5bpnz-shard-00-01.8brmucx.mongodb.net,ac-gu5bpnz-shard-00-00.8brmucx.mongodb.net/?tls=true&authMechanism=MONGODB-X509&authSource=%24external&serverMonitoringMode=poll&maxIdleTimeMS=30000&minPoolSize=0&maxPoolSize=5&maxConnecting=6&replicaSet=atlas-os15fn-shard-0&appName=Data+Explorer--69a41db71f4ec5083b04cd97'
);
const coll = client.db('jobrecommend').collection('role');
const cursor = coll.find(filter);
const result = await cursor.toArray();
await client.close();