import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const usePdfExport = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPdf = async (elementRef, fileName = 'document.pdf') => {
    if (!elementRef.current) return;

    try {
      setIsDownloading(true);

      // 1. Capture Full Height
      // Kita gunakan 'scrollHeight' untuk memastikan seluruh konten tertangkap
      // meskipun sedang di-scroll.
      const canvas = await html2canvas(elementRef.current, {
        scale: 2, // Resolusi tinggi (Retina)
        useCORS: true,
        backgroundColor: '#0d1117',
        logging: false,
        // Trik penting untuk scrollable content:
        height: elementRef.current.scrollHeight, 
        windowHeight: elementRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      
      // 2. Setup PDF (A4)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210; // Lebar A4 (mm)
      const pdfHeight = 297; // Tinggi A4 (mm)
      
      // 3. Konversi ukuran Canvas(px) ke PDF(mm)
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // 4. Halaman Pertama
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // 5. Loop untuk Halaman Berikutnya (Multi-page)
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // Geser posisi gambar ke atas
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(fileName);

    } catch (error) {
      console.error("PDF Export Failed:", error);
      alert("Gagal mendownload PDF. Coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadPdf, isDownloading };
};