import express from "express"
import multer from "multer"
import validateAndSave from "../controllers/controller.ts"

const router = express.Router()
const upload = multer()

router.post("/api/form-contact-us", upload.none(), validateAndSave)

export default router