import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// Removed Cloudinary dependency for a fully local solution

// Ensure env vars are loaded even if this file loads before server.ts calls dotenv.config
// Load from the server/.env file (process.cwd() should be the server folder when running)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// No third-party config required

export interface CertificateData {
  userName: string;
  courseTitle: string;
  completionDate: string;
  certificateId: string;
}

export class CertificateGenerator {
  private templatePath: string;
  private logoPath: string;

  constructor() {
    // Use direct paths with forward slashes (Node.js handles this cross-platform)
    this.templatePath = 'D:/zuno/Certificate.pdf';
    // Logo is baked into the certificate template; do not embed a separate logo
    this.logoPath = '';
    
    console.log('📄 Template path:', this.templatePath);
  }

  generateCertificateId(): string {
    const rand = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .toUpperCase()
      .padStart(6, '0');
    return `ATOMS-WD-${rand}`;
  }

  generateSignedDownloadUrl(certificateId: string, filename?: string): string {
    // For local solution, return the static URL (frontend can use this for open/download)
    const port = process.env.PORT || '5000';
    const base = `http://localhost:${port}/static/certificates/${certificateId}.pdf`;
    // Optionally append a filename hint as a query param for client-side handling
    if (filename) {
      const encoded = encodeURIComponent(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      return `${base}?filename=${encoded}`;
    }
    return base;
  }

  async generateWebDevCertificate(data: CertificateData): Promise<string> {
    const pdfBytes = await this.generateWebDevCertificatePDF(data);
    
    // For backwards compatibility, still save locally as fallback
    const tempDir = path.resolve(process.cwd(), 'temp', 'certificates');
    fs.mkdirSync(tempDir, { recursive: true });
    const localPath = path.join(tempDir, `${data.certificateId}.pdf`);
    fs.writeFileSync(localPath, pdfBytes);
    const port = process.env.PORT || '5000';
    const finalUrl = `http://localhost:${port}/static/certificates/${data.certificateId}.pdf`;

    console.log('🎉 Certificate generated locally:', localPath);
    console.log('🔗 Local URL:', finalUrl);
    return finalUrl;
  }

  async generateWebDevCertificatePDF(data: CertificateData): Promise<Uint8Array> {
    try {
      console.log('🎓 Starting certificate generation for:', data.userName);
      
      // Check if template file exists
      if (!fs.existsSync(this.templatePath)) {
        throw new Error(`Certificate template not found at: ${this.templatePath}`);
      }
      
      // Read the template PDF
      console.log('📖 Reading template PDF...');
      const templateBytes = fs.readFileSync(this.templatePath);
      const pdfDoc = await PDFDocument.load(templateBytes);
      
  // Get the first page
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      
      console.log(`📐 PDF dimensions: ${width}x${height}`);

      // Embed fonts
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Compute bottom-left coordinates with env overrides
      const parseNum = (val: string | undefined, fallback: number) => {
        if (!val) return fallback;
        const n = Number(val);
        return Number.isFinite(n) ? n : fallback;
      };

      // Defaults aimed at bottom-left placement; tweak via env if needed
      const nameX = parseNum(process.env.CERT_NAME_X, 50);
      const nameY = parseNum(process.env.CERT_NAME_Y, 140);
      const dateX = parseNum(process.env.CERT_DATE_X, 50);
      const dateY = parseNum(process.env.CERT_DATE_Y, 100);
      const maxNameSize = parseNum(process.env.CERT_NAME_SIZE, 28);
      const minNameSize = 16;
      const dateSize = parseNum(process.env.CERT_DATE_SIZE, 14);

      // Auto-fit name to available width so long names don't overflow
      const maxTextWidth = Math.max(100, width - nameX - 80); // 80px right margin
      let nameFontSize = maxNameSize;
      while (nameFontSize > minNameSize && font.widthOfTextAtSize(data.userName, nameFontSize) > maxTextWidth) {
        nameFontSize -= 1;
      }

      // Draw name (bottom-left)
      console.log(`📍 Drawing name "${data.userName}" at (${nameX}, ${nameY}) with size ${nameFontSize}`);
      firstPage.drawText(data.userName, {
        x: nameX,
        y: nameY,
        size: nameFontSize,
        font,
        color: rgb(0, 0, 0),
      });

  // Note: Course title is on the template; we don't overlay it

      // Add completion date (bottom-left under name)
      console.log(`📍 Drawing date "Date: ${data.completionDate}" at (${dateX}, ${dateY}) with size ${dateSize}`);
      firstPage.drawText(`Date: ${data.completionDate}`, {
        x: dateX,
        y: dateY,
        size: dateSize,
        font: regularFont,
        color: rgb(0, 0, 0),
      });

  // Note: Certificate ID is stored in DB but not rendered on the PDF

  // Note: Template already contains the icon/logo; skip embedding any logo here

      // Serialize the PDF
      console.log('💾 Serializing PDF...');
      const pdfBytes = await pdfDoc.save();
      console.log(`📦 PDF generated, size: ${pdfBytes.length} bytes`);

      return pdfBytes;
    } catch (error) {
      console.error('Certificate generation error:', error);
      throw new Error('Failed to generate certificate');
    }
  }

  async checkWebDevCompletion(userProgress: any): Promise<boolean> {
    const webdevSubjects = ['html', 'css', 'javascript', 'react', 'nodejs', 'mongodb'];
    for (const subject of webdevSubjects) {
      const subjectProgress = userProgress?.webdev?.[subject];
      if (!subjectProgress) return false;
      if (subjectProgress.videosWatched < 11) return false;
      // Quiz checks handled in controller; no additional logic here.
    }
    return true;
  }
}
