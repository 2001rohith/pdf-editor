import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(__dirname, '../../uploads');

export class FileRepository{
    public async getFileBytes(pdfPath: string): Promise<Uint8Array>{
        const fullPath = path.resolve(uploadsDir, path.basename(pdfPath));
        if (!fs.existsSync(fullPath)) {
          throw new Error('File not found at path: ' + fullPath);
        }
        return fs.promises.readFile(fullPath);
      };
      
      public async saveNewPDF(pdfBytes: Uint8Array): Promise<string>{
        const newFileName = `new-${Date.now()}.pdf`;
        const newFilePath = path.join(uploadsDir, newFileName);
        await fs.promises.writeFile(newFilePath, pdfBytes);
        return `/uploads/${newFileName}`;
      }
}