import { MongoClient } from "mongodb";

export async function connectToCluster(uri) {
  let mongoClient;

  try {
    mongoClient = new MongoClient(uri);
    console.log("Connecting to MongoDB Atlas cluster...");
    await mongoClient.connect();
    console.log(mongoClient);
    console.log("Successfully connected to MongoDB Atlas!");

    return mongoClient;
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit();
  }
}

export async function createPoolsDocument(collection) {
  const poolsDocument = {
    address: "0x9D67D3969e45aDf9786F95A1F874C0E8d476630F",
    pair1_address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    pair2_address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  };

  await collection.insertOne(poolsDocument);
}
// export async function createTokenDocument(collection) {
//   const tokenDocument = {
//     name: "Wrapped ETH",
//     symbol: "WETH",
//     address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
//     decimals: 18,
//   };

//   await collection.insertOne(tokenDocument);
// }

export async function executeCrudeOperations() {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("DexInfo");
    const collectionPools = db.collection("pools");
    // const collectionTokens = db.collection("tokens");

    console.log("Creating a Pool and a Token...");

    await createPoolsDocument(collectionPools);
    // await createTokenDocument(collectionTokens);
  } finally {
    await mongoClient.close();
  }
}
