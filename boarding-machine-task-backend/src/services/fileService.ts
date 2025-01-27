import { FileRepository } from "../repositories/FileRepository";
import { UserRepository } from "../repositories/UserRepository";
import { PDFDocument } from "pdf-lib";


export class FileService {
    private fileRepository: FileRepository
    private userRepository: UserRepository

    constructor(userRepository: UserRepository, fileRepository: FileRepository) {
        this.userRepository = userRepository
        this.fileRepository = fileRepository
    }


    public async savePDFPath(userId: string, pdfPath: string) {
        if (!userId || !pdfPath) {
            throw new Error("User ID and PDF path are required");
        }

        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.savedPdfs) {
            user.savedPdfs = [];
        }
        console.log("pdf path from service:", pdfPath)
        user.savedPdfs.push(pdfPath);
        const updatedUser = await this.userRepository.saveUser(user);
        console.log("service side clear!:", updatedUser)

        return updatedUser;
    };

    public async createPDFWithOrder(pdfPath: string, pageOrder: number[], userId: string): Promise<string> {
        try {
            const originalPdfBytes = await this.fileRepository.getFileBytes(pdfPath);
            const originalPdf = await PDFDocument.load(originalPdfBytes);
            const newPdf = await PDFDocument.create();

            for (const pageIndex of pageOrder) {
                const [copiedPage] = await newPdf.copyPages(originalPdf, [pageIndex - 1]);
                newPdf.addPage(copiedPage);
            }

            const newPdfBytes = await newPdf.save();
            const newPdfPath = await this.fileRepository.saveNewPDF(newPdfBytes);
            const user = await this.userRepository.findUserById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            if (!user.newPdfs) {
                user.newPdfs = [];
            }
            user.newPdfs.push(newPdfPath);
            await this.userRepository.saveUser(user);
            return newPdfPath;
        } catch (error: any) {
            throw new Error('Error creating new PDF: ' + error.message);
        }
    }
}

