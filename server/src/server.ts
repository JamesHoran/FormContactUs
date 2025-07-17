import 'dotenv/config'
import express from "express";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
import ServerResponse from "../../types/serverResponse.ts"
import contactEntrySchema from "../models/models.ts"
var app = express()
const port = 8082;
const upload = multer();
app.use(express.json())
app.use(cors());
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@crudtdlcluster.${process.env.CLUSTER}.mongodb.net/?retryWrites=true&w=majority&appName=CrudTDLCluster`;

const ContactEntryModel = mongoose.model("ContactEntryModel", contactEntrySchema);
let databaseIsConnected: boolean;

async function connect(): Promise<void> {
  try {
    await mongoose.connect(uri);
    databaseIsConnected = true
    console.log("Successfully connected to database");
  } catch(error) {
    databaseIsConnected = false
    console.error("Error connecting to database:", error)
  }
}
connect()

async function uploadData(data: any): Promise<ServerResponse> {
  let response: ServerResponse;

  try {
    const doc = new ContactEntryModel({...data, createdAt: Date.now()})

    await doc.save();
  } catch(error) {
    console.error(error)
    response = { message: "Error saving data. Please try again later", status: 500, ok: false}
    return response
  }
  response = { message: "Thank you! We will get back with you shortly", status: 200, ok: true }
  return response
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

app.post("/api/form-contact-us", upload.none(), async (req, res) => {
  let response: ServerResponse;
  if(!databaseIsConnected) {
    response = { status: 503, message: "Error connecting. Please try again later", ok: false }
    return res.json(response)
  }
  try {
    let errors: {[error: string]: string} = {};
    
    if(req.body.firstName && (req.body.firstName.toString().length > 100 || req.body.firstName.toString().length < 3)) {
      errors.firstName = "First name must be between 3 and 100 characters."
    }
    if(req.body.lastName && (req.body.lastName.toString().length > 100 || req.body.lastName.toString().length < 3)) {
      errors.lastName = "Last name must be between 3 and 100 characters."
    }
    if(req.body.email && (req.body.email.toString().length > 100 || req.body.email.toString().length < 4)) {
      errors.email = "Email must be between 4 and 100 characters."
    }
    if(req.body.message && (req.body.message.toString().length > 500 || req.body.message && req.body.message.toString().length < 10)) {
      errors.message = "Message must be between 10 and 500 characters."
    }
    if(Object.keys(errors).length) {
      response = {
        error: `Invalid Body size: ${Object.values(errors).join(" ")}`,
        message: `${Object.values(errors).join(" ")}`,
        ok: false,
        status: 400
      }

    } else {
      response = await uploadData(req.body)
    }
  } catch (error) {
    console.error("error: ", error)
    response = { status: 500, error: "Internal server error", message: "An error occurred. Please try again later", ok: false }
  }
  return res.json(response)
})
