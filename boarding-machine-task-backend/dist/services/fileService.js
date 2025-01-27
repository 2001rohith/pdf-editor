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
exports.FileService = void 0;
const pdf_lib_1 = require("pdf-lib");
class FileService {
    constructor(userRepository, fileRepository) {
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
    }
    savePDFPath(userId, pdfPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !pdfPath) {
                throw new Error("User ID and PDF path are required");
            }
            const user = yield this.userRepository.findUserById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            if (!user.savedPdfs) {
                user.savedPdfs = [];
            }
            console.log("pdf path from service:", pdfPath);
            user.savedPdfs.push(pdfPath);
            const updatedUser = yield this.userRepository.saveUser(user);
            console.log("service side clear!:", updatedUser);
            return updatedUser;
        });
    }
    ;
    createPDFWithOrder(pdfPath, pageOrder, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const originalPdfBytes = yield this.fileRepository.getFileBytes(pdfPath);
                const originalPdf = yield pdf_lib_1.PDFDocument.load(originalPdfBytes);
                const newPdf = yield pdf_lib_1.PDFDocument.create();
                for (const pageIndex of pageOrder) {
                    const [copiedPage] = yield newPdf.copyPages(originalPdf, [pageIndex - 1]);
                    newPdf.addPage(copiedPage);
                }
                const newPdfBytes = yield newPdf.save();
                const newPdfPath = yield this.fileRepository.saveNewPDF(newPdfBytes);
                const user = yield this.userRepository.findUserById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                if (!user.newPdfs) {
                    user.newPdfs = [];
                }
                user.newPdfs.push(newPdfPath);
                yield this.userRepository.saveUser(user);
                return newPdfPath;
            }
            catch (error) {
                throw new Error('Error creating new PDF: ' + error.message);
            }
        });
    }
}
exports.FileService = FileService;
