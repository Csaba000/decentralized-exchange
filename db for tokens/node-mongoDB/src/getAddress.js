import { MongoClient } from 'mongodb';
const url = "mongodb+srv://Dex:REhaKF8OVtLS8jek@cluster0.95wr419.mongodb.net/test"
const dbName = 'DexInfo';

MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  const db = client.db(dbName);
  const collection = db.collection('pools');
  
  const query = { pair1_address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', pair2_address: '0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4' };
  collection.find(query).toArray(function(err, docs) {
    if (err) throw err;
    console.log(docs[0].address);
    client.close();
  });
});


