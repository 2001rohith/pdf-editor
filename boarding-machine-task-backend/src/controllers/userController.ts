import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { HttpStatusCodes } from "../utils/constants";
import { UserRepository } from "../repositories/UserRepository";
import { FileRepository } from "../repositories/FileRepository";
import { FileService } from "../services/fileService";
import path from "path";

const userRepository = new UserRepository()
const fileRepository = new FileRepository()
const userService = new UserService(userRepository)
const fileService = new FileService(userRepository,fileRepository)

exports.register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body
    console.log("user email:", email)
    try {
        const user = await userService.registerUser(name, email, password)
        res.status(HttpStatusCodes.OK).json({ user, message: "User registered" })
    } catch (error: any) {
        console.log(error.message)
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

exports.login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body
    try {
        const user = await userService.loginUser(email, password)
        res.status(HttpStatusCodes.OK).json({ user, message: "User logged in" })
    } catch (error: any) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

exports.uploadPDF = async (req: Request, res: Response): Promise<void> => {
    const userId = req.body.userId;
    const filePath = req.file?.path;

    console.log("user id from upload pdf:", userId);
    console.log("Original pdfPath from multer:", filePath);

    if (!filePath) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "No file uploaded" });
        return;
    }

    try {
        const pdfPath = `${process.env.BACKEND_URL}/${filePath.replace(/\\/g, "/")}`;

        const updatedUser = await fileService.savePDFPath(userId, pdfPath);

        console.log("Formatted pdf path to frontend:", pdfPath);
        console.log("Server side clear!");

        res.status(HttpStatusCodes.OK).json({ 
            message: "PDF uploaded successfully", 
            user: updatedUser, 
            pdfPath 
        });
    } catch (error: any) {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export const generateNewPDF = async (req: Request, res: Response): Promise<void> => {
    const { pdfPath, pageOrder,userId } = req.body;
  
    if (!pdfPath || !pageOrder || !Array.isArray(pageOrder)) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Invalid request. Missing pdfPath or pageOrder.' });
      return;
    }
  
    try {
      const newPdfPath = await fileService.createPDFWithOrder(pdfPath, pageOrder,userId);
      res.status(HttpStatusCodes.OK).json({ message: 'New PDF created successfully', newPdfPath });
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to generate new PDF.' });
    }
  };