import ContactEntryModel from "../models/contactEntry.ts"
import { getIsConnected } from "../config/connect.ts"
import { Request, Response } from "express"

interface Data {
  firstName: string,
  lastName: string,
  email: string,
  message: string
}

interface ClientRequest extends Request {
  body: Data
}

interface ServerResponse {
  myStatus: number,
  payload: {
    message?: string,
    ok: boolean,
    error?: unknown
  }
}

const validateAndSave = async (req: ClientRequest, res: Response): Promise<Response> => {
  let response: ServerResponse = { myStatus: 200, payload: { message: "Thank you! We will get back with you shortly", ok: true }}
  
  // check that there is a db connection and return if there isn't bc there's no point continuing
  if(!getIsConnected()) {
    response = { myStatus: 503, payload: { ok: false, message: "Error connecting. Please try again later" }}
    return res.status(response.myStatus).json(response.payload)
  }

  // verify types and return for incorrect type bc there's no point in continuing
  if(
    typeof(req.body.firstName) !== "string"
    || typeof(req.body.lastName) !== "string"
    || typeof(req.body.email) !== "string"
    || typeof(req.body.message) !== "string"
  ) {
    response = {
      myStatus: 400,
      payload: {
        error: `Invalid form input type`,
        message: `Invalid form input type`,
        ok: false,
      }
    }
    return res.status(response.myStatus).json(response.payload)
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
        myStatus: 400,
        payload: {
          error: `Invalid Body size: ${Object.values(errors).join(" ")}`,
          message: `${Object.values(errors).join(" ")}`,
          ok: false,
        }
      }
    } else {
      response = await uploadData(req.body)
    }
  } catch (error) {
    console.error("error: ", error)
    response = { myStatus: 500, payload: { error: "Internal server error", message: "An error occurred. Please try again later", ok: false }}
  }
  return res.status(response.myStatus).json(response.payload);
}

async function uploadData(data: Data): Promise<ServerResponse> {
  let response: ServerResponse;

  try {
    const doc = new ContactEntryModel({...data, createdAt: Date.now()})

    await doc.save();
  } catch(error) {
    console.error(error)
    response = { myStatus: 500, payload: { message: "Error saving data. Please try again later", ok: false }}
    return response
  }
  response = { myStatus: 200, payload: { message: "Thank you! We will get back with you shortly", ok: true }}
  return response
}

export default validateAndSave