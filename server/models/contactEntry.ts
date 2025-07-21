import mongoose from "mongoose";

const contactEntrySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  message: String,
  createdAt: Date
})

const ContactEntryModel = mongoose.model("ContactEntryModel", contactEntrySchema);

export default ContactEntryModel