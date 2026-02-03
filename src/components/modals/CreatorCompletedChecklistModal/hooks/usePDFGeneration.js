// src/components/modals/CreatorCompletedChecklistModal/hooks/usePDFGeneration.js
import { useState } from "react";
import { message } from "antd";

export const usePDFGeneration = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async (checklist, docs, documentStats, comments) => {
    setIsGeneratingPDF(true);
    try {
      // CORRECT PATH: Import from the same folder structure
      const { PDFGenerator } = await import("../PDFGenerator");
      await PDFGenerator.generatePDF(checklist, docs, documentStats, comments);
    } catch (error) {
      console.error("Error in PDF generation:", error);
      message.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return {
    isGeneratingPDF,
    generatePDF,
  };
};
