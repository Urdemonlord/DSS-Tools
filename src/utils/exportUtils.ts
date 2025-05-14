import { jsPDF } from 'jspdf';
import { utils, writeFile } from 'xlsx';
import { Alternative, Criteria, MethodResult } from '../types';
import { DSS_METHODS } from '../constants';

/**
 * Export results to PDF
 */
export const exportToPDF = (
  criteria: Criteria[],
  alternatives: Alternative[],
  results: Record<string, MethodResult[]>,
  selectedMethod: string
): void => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Decision Support System Results', pageWidth / 2, 20, { align: 'center' });
  
  // Add method name
  const methodName = DSS_METHODS.find(m => m.id === selectedMethod)?.name || selectedMethod;
  doc.setFontSize(14);
  doc.text(`Method: ${methodName}`, pageWidth / 2, 30, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 40, { align: 'center' });
  
  // Add criteria section
  doc.setFontSize(12);
  doc.text('Criteria:', 14, 50);
  
  let yPos = 55;
  criteria.forEach((criterion, index) => {
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${criterion.name} (${criterion.type}) - Weight: ${criterion.weight}`, 20, yPos);
    yPos += 5;
  });
  
  // Add alternatives section
  yPos += 5;
  doc.setFontSize(12);
  doc.text('Alternatives:', 14, yPos);
  yPos += 5;
  
  alternatives.forEach((alternative, index) => {
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${alternative.name}`, 20, yPos);
    yPos += 5;
    
    // Add alternative values
    criteria.forEach(criterion => {
      const value = alternative.values[criterion.id] || 0;
      doc.text(`   - ${criterion.name}: ${value}`, 25, yPos);
      yPos += 5;
    });
  });
  
  // Add results section
  yPos += 5;
  doc.setFontSize(12);
  doc.text('Results:', 14, yPos);
  yPos += 5;
  
  const methodResults = results[selectedMethod] || [];
  if (methodResults.length > 0) {
    // Draw table header
    doc.setFontSize(10);
    doc.text('Rank', 20, yPos);
    doc.text('Alternative', 45, yPos);
    doc.text('Score', 120, yPos);
    yPos += 5;
    
    // Draw horizontal line
    doc.line(20, yPos, 170, yPos);
    yPos += 5;
    
    // Sort results by rank
    const sortedResults = [...methodResults].sort((a, b) => a.rank - b.rank);
    
    // Draw table rows
    sortedResults.forEach(result => {
      const alternative = alternatives.find(a => a.id === result.alternativeId);
      if (alternative) {
        doc.text(result.rank.toString(), 20, yPos);
        doc.text(alternative.name, 45, yPos);
        doc.text(result.score.toFixed(4), 120, yPos);
        yPos += 5;
      }
    });
  } else {
    doc.text('No results available', 20, yPos);
  }
  
  // Save the PDF
  doc.save(`dss-results-${selectedMethod}-${Date.now()}.pdf`);
};

/**
 * Export data to Excel
 */
export const exportToExcel = (
  criteria: Criteria[],
  alternatives: Alternative[],
  results: Record<string, MethodResult[]>
): void => {
  // Create workbook
  const wb = utils.book_new();
  
  // Create criteria sheet
  const criteriaData = criteria.map(c => ({
    ID: c.id,
    Name: c.name,
    Weight: c.weight,
    Type: c.type
  }));
  const criteriaWs = utils.json_to_sheet(criteriaData);
  utils.book_append_sheet(wb, criteriaWs, 'Criteria');
  
  // Create alternatives sheet
  const alternativesData: any[] = [];
  alternatives.forEach(alt => {
    const row: any = {
      ID: alt.id,
      Name: alt.name
    };
    
    // Add values for each criterion
    criteria.forEach(c => {
      row[c.name] = alt.values[c.id] || 0;
    });
    
    alternativesData.push(row);
  });
  const alternativesWs = utils.json_to_sheet(alternativesData);
  utils.book_append_sheet(wb, alternativesWs, 'Alternatives');
  
  // Create results sheets for each method
  Object.entries(results).forEach(([methodId, methodResults]) => {
    if (methodResults.length > 0) {
      const methodName = DSS_METHODS.find(m => m.id === methodId)?.name || methodId;
      
      const resultsData = methodResults
        .sort((a, b) => a.rank - b.rank)
        .map(r => {
          const alt = alternatives.find(a => a.id === r.alternativeId);
          return {
            Rank: r.rank,
            Alternative: alt?.name || r.alternativeId,
            Score: r.score
          };
        });
      
      const resultsWs = utils.json_to_sheet(resultsData);
      utils.book_append_sheet(wb, resultsWs, methodName.substring(0, 31)); // Excel sheet names limited to 31 chars
    }
  });
  
  // Write to file and download
  writeFile(wb, `dss-data-${Date.now()}.xlsx`);
};