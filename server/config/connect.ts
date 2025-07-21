import mongoose from "mongoose";
import 'dotenv/config'

let isConnected: boolean = false;
const uri: string = process.env.URI || "undefined";

async function connect(): Promise<void> {
  mongoose.connection.on('connected', () => {
    isConnected = true;
  });
  try {
    await mongoose.connect(uri);
  } catch(error) {
    isConnected = false
    console.error(`Error connecting to database: ${error}`)
  }
}

function getIsConnected() {
  return isConnected
}

export { connect, getIsConnected }