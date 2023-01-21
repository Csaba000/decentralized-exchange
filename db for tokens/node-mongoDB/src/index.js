import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { executeCrudeOperations } from "./connect.js";

config();
await executeCrudeOperations();
