import 'dotenv/config'
import express from "express";
import cors from "cors";
import router from "../routs/router.ts"
import { connect } from "../config/connect"

var app = express()
app.use(express.json())
app.use(cors());
const port = process.env.PORT;

connect()

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

app.use("/", router)