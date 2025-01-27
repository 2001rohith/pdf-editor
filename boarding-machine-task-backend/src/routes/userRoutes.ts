import express from "express";
import { Routes } from "../utils/constants";
import { upload } from "../utils/multer";
const userController = require("../controllers/userController")
const router = express.Router()

router.post(Routes.REGISTER_USER, userController.register)
router.post(Routes.LOGIN, userController.login)
router.post("/upload", upload.single("pdf"), userController.uploadPDF)
router.post('/generate-new-pdf', userController.generateNewPDF)

export default router