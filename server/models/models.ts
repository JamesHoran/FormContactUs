import mongoose from "mongoose";

const contactEntrySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  message: String,
  createdAt: Date
})

export default contactEntrySchema