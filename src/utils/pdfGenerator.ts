import { jsPDF } from "jspdf";

interface AnalysisResult {
  summary: string;
  probable_causes: string[];
  red_flags: string[];
  recommended_actions: string[];
  risk_level: "low" | "medium" | "high";
}

export const generatePDF = (results: AnalysisResult, symptoms: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = 20;

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number, isBold = false, color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * fontSize * 0.4 + 5;
  };

  // Add header with gradient effect (simulated with colors)
  doc.setFillColor(165, 216, 255); // Light blue
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(33, 37, 41);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("MedGuide AI Health Report", pageWidth / 2, 25, { align: "center" });
  
  yPosition = 50;

  // Add date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(108, 117, 125);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);
  yPosition += 15;

  // Add symptoms section
  addText("Your Symptoms:", 14, true, [33, 37, 41]);
  addText(symptoms, 11, false, [73, 80, 87]);
  yPosition += 5;

  // Add risk level with colored background
  const riskColors = {
    low: [183, 240, 196] as [number, number, number], // Light green
    medium: [255, 243, 205] as [number, number, number], // Light yellow
    high: [255, 205, 210] as [number, number, number], // Light red
  };
  
  const riskColor = riskColors[results.risk_level];
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.roundedRect(margin, yPosition, maxWidth, 12, 3, 3, "F");
  
  addText(`Risk Level: ${results.risk_level.toUpperCase()}`, 12, true, [33, 37, 41]);
  yPosition += 5;

  // Add summary
  addText("Summary:", 14, true, [33, 37, 41]);
  addText(results.summary, 11, false, [73, 80, 87]);
  yPosition += 5;

  // Add red flags if any
  if (results.red_flags && results.red_flags.length > 0) {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    addText("⚠️ Warning Signs:", 14, true, [220, 53, 69]);
    results.red_flags.forEach((flag, index) => {
      addText(`${index + 1}. ${flag}`, 11, false, [73, 80, 87]);
    });
    yPosition += 5;
  }

  // Add probable causes
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  addText("Possible Causes:", 14, true, [33, 37, 41]);
  results.probable_causes.forEach((cause, index) => {
    addText(`${index + 1}. ${cause}`, 11, false, [73, 80, 87]);
  });
  yPosition += 5;

  // Add recommended actions
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  addText("Recommended Actions:", 14, true, [33, 37, 41]);
  results.recommended_actions.forEach((action, index) => {
    addText(`${index + 1}. ${action}`, 11, false, [73, 80, 87]);
  });
  yPosition += 10;

  // Add disclaimer box
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(margin, yPosition, maxWidth, 30, 3, 3, "F");
  yPosition += 5;
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(108, 117, 125);
  const disclaimerText = "⚕️ IMPORTANT: This analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.";
  const disclaimerLines = doc.splitTextToSize(disclaimerText, maxWidth - 10);
  doc.text(disclaimerLines, margin + 5, yPosition + 5);

  // Save the PDF
  doc.save(`medguide-report-${new Date().getTime()}.pdf`);
};