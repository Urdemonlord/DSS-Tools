import React, { useState } from 'react';
import { Download, File as FilePdf, FileSpreadsheet, Menu } from 'lucide-react';
import { Alternative, Criteria, MethodResult } from '../../types';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

interface ExportMenuProps {
  criteria: Criteria[];
  alternatives: Alternative[];
  results: Record<string, MethodResult[]>;
  selectedMethod: string;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ 
  criteria, 
  alternatives, 
  results, 
  selectedMethod 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExportPDF = () => {
    exportToPDF(criteria, alternatives, results, selectedMethod);
    setIsOpen(false);
  };

  const handleExportExcel = () => {
    exportToExcel(criteria, alternatives, results);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
      >
        <Download className="w-5 h-5 mr-2" />
        <span>Export</span>
        <Menu className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={handleExportPDF}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FilePdf className="w-4 h-4 mr-2 text-red-500" />
              Export as PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
              Export as Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportMenu;