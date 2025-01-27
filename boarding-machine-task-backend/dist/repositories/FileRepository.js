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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRepository = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadsDir = path_1.default.join(__dirname, '../../uploads');
class FileRepository {
    getFileBytes(pdfPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPath = path_1.default.resolve(uploadsDir, path_1.default.basename(pdfPath));
            if (!fs_1.default.existsSync(fullPath)) {
                throw new Error('File not found at path: ' + fullPath);
            }
            return fs_1.default.promises.readFile(fullPath);
        });
    }
    ;
    saveNewPDF(pdfBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFileName = `new-${Date.now()}.pdf`;
            const newFilePath = path_1.default.join(uploadsDir, newFileName);
            yield fs_1.default.promises.writeFile(newFilePath, pdfBytes);
            return `/uploads/${newFileName}`;
        });
    }
}
exports.FileRepository = FileRepository;
