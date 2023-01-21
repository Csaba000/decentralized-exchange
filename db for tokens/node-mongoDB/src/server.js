import express from 'express';
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import cors from 'cors';

config();
console.log(process.env.DB_URI);
const app = express();
app.use(cors());

const url = process.env.DB_URI;
console.log(url);
const dbName = 'DexInfo';

// Connect to the database
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    console.error("HIBA",error);
    return;
  }

  console.log('Successfully connected to MongoDB');

  // Set the client reference to the database
  const db = client.db(dbName);
  console.log(db);
  // Add a GET route that retrieves all documents in the 'items' collection
  app.get('/tokenInfo', (req, res) => {
    db.collection('tokens').find().toArray((error, items) => {
      if (error) {
        console.error(error);
        res.status(500).send(error);
        return;
      }

      res.send(items);
    });
  });

  app.get('/poolsInfo', (req, res) => {
    db.collection('pools').find().toArray((error, items) => {
      if (error) {
        console.error(error);
        res.status(500).send(error);
        return;
      }

      res.send(items);
    });
  });


  // Start the server
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
});