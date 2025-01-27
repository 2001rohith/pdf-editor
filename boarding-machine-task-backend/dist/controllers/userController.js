"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNewPDF = void 0;
const userService_1 = require("../services/userService");
const constants_1 = require("../utils/constants");
const UserRepository_1 = require("../repositories/UserRepository");
const FileRepository_1 = require("../repositories/FileRepository");
const fileService_1 = require("../services/fileService");
const userRepository = new UserRepository_1.UserRepository();
const fileRepository = new FileRepository_1.FileRepository();
const userService = new userService_1.UserService(userRepository);
const fileService = new fileService_1.FileService(userRepository, fileRepository);
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    console.log("user email:", email);
    try {
        const user = yield userService.registerUser(name, email, password);
        res.status(constants_1.HttpStatusCodes.OK).json({ user, message: "User registered" });
    }
    catch (error) {
        console.log(error.message);
        res.status(constants_1.HttpStatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userService.loginUser(email, password);
        res.status(constants_1.HttpStatusCodes.OK).json({ user, message: "User logged in" });
    }
    catch (error) {
        res.status(constants_1.HttpStatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
exports.uploadPDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.body.userId;
    const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    console.log("user id from upload pdf:", userId);
    console.log("Original pdfPath from multer:", filePath);
    if (!filePath) {
        res.status(constants_1.HttpStatusCodes.BAD_REQUEST).json({ message: "No file uploaded" });
        return;
    }
    try {
        const pdfPath = `${process.env.BACKEND_URL}/${filePath.replace(/\\/g, "/")}`;
        const updatedUser = yield fileService.savePDFPath(userId, pdfPath);
        console.log("Formatted pdf path to frontend:", pdfPath);
        console.log("Server side clear!");
        res.status(constants_1.HttpStatusCodes.OK).json({
            message: "PDF uploaded successfully",
            user: updatedUser,
            pdfPath
        });
    }
    catch (error) {
        res.status(constants_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});
const generateNewPDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pdfPath, pageOrder, userId } = req.body;
    if (!pdfPath || !pageOrder || !Array.isArray(pageOrder)) {
        res.status(constants_1.HttpStatusCodes.BAD_REQUEST).json({ message: 'Invalid request. Missing pdfPath or pageOrder.' });
        return;
    }
    try {
        const newPdfPath = yield fileService.createPDFWithOrder(pdfPath, pageOrder, userId);
        res.status(constants_1.HttpStatusCodes.OK).json({ message: 'New PDF created successfully', newPdfPath });
    }
    catch (error) {
        console.error('Error generating PDF:', error);
        res.status(constants_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to generate new PDF.' });
    }
});
exports.generateNewPDF = generateNewPDF;
