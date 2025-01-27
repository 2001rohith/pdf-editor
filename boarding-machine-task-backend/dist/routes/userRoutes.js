"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("../utils/constants");
const multer_1 = require("../utils/multer");
const userController = require("../controllers/userController");
const router = express_1.default.Router();
router.post(constants_1.Routes.REGISTER_USER, userController.register);
router.post(constants_1.Routes.LOGIN, userController.login);
router.post("/upload", multer_1.upload.single("pdf"), userController.uploadPDF);
router.post('/generate-new-pdf', userController.generateNewPDF);
exports.default = router;
