import express from "express";
import { MongoClient } from "mongodb";
import { config } from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { sortTokens } from "../src/sort.js";

config();
console.log(process.env.DB_URI);
const app = express();
app.use(cors());

const url = process.env.DB_URI;
console.log(url);
const dbName = "DexInfo";

// Connect to the database
MongoClient.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      console.error("HIBA", error);
      return;
    }

    console.log("Successfully connected to MongoDB");

    // Set the client reference to the database
    const db = client.db(dbName);
    console.log(db);
    // Add a GET route that retrieves all documents in the 'items' collection
    app.get("/tokenInfo", (req, res) => {
      db.collection("tokens")
        .find()
        .toArray((error, items) => {
          if (error) {
            console.error(error);
            res.status(500).send(error);
            return;
          }

          res.send(items);
        });
    });

    app.get("/poolsInfo", (req, res) => {
      db.collection("pools")
        .find()
        .toArray((error, items) => {
          if (error) {
            console.error(error);
            res.status(500).send(error);
            return;
          }

          res.send(items);
        });
    });

    app.use(bodyParser.json());

    app.post("/poolAddress", (req, res) => {
      console.log(req.body);

      let token_addr1 = req.body.params.token_addr1;
      let token_addr2 = req.body.params.token_addr2;

      console.log("TOKENS", token_addr1, token_addr2);

      const sortedTokens = sortTokens(token_addr1, token_addr2);
      console.log("SORTED TOKENS", sortedTokens);

      const sortedToken1 = sortedTokens[0];
      const sortedToken2 = sortedTokens[1];
      const isSwapped = sortedTokens[2];

      if (token_addr1 === undefined || token_addr2 === undefined) {
        res.status(400).send("Bad request");
        return;
      }

      const query = {
        pair1_address: sortedToken1,
        pair2_address: sortedToken2,
      };
      db.collection("pools")
        .find(query)
        .toArray(function (err, docs) {
          if (err) {
            console.error(err);
            res.status(500).send(err);
          }
          if (docs.length !== 0) {
            res.send(docs[0].address);
          }
          else {
            res.status(404).send("No pool found");
          }
        });
    });

    // Start the server
    app.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  }
);
