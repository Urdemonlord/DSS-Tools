import React, { useState, useRef } from 'react';
import Header from './components/layout/Header';
import DSSPage from './pages/DSSPage';
import { AlertCircle, Upload } from 'lucide-react';
import { importFromExcel } from './utils/importUtils';

function App() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportError, setShowImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle reset confirmation
  const handleReset = () => {
    setShowResetConfirm(true);
  };

  // Handle export menu
  const handleExport = () => {
    setShowExportMenu(true);
  };

  // Handle import
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { criteria, alternatives } = await importFromExcel(file);
      // TODO: Update application state with imported data
      setShowImportError(null);
    } catch (error) {
      setShowImportError(error instanceof Error ? error.message : 'Failed to import data');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onExport={handleExport} onReset={handleReset} onImport={handleImport} />
      
      <main className="flex-1">
        <DSSPage />
      </main>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
      />
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold text-white">Decision Support System</h2>
              <p className="text-sm">A tool for multi-criteria decision analysis</p>
            </div>
            
            <div className="text-sm">
              <p>&copy; {new Date().getFullYear()} DSS Tool</p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Reset all data?</h3>
                <p className="mt-2 text-sm text-gray-500">
                  This will reset all criteria, alternatives, and results. This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Would call resetData() here
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Export Menu Modal */}
      {showExportMenu && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Options</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Would call exportToPDF() here
                  setShowExportMenu(false);
                }}
                className="flex items-center w-full px-4 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <FilePdfIcon className="h-6 w-6 text-red-500 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Export as PDF</div>
                  <div className="text-sm text-gray-500">Save results as a PDF document</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  // Would call exportToExcel() here
                  setShowExportMenu(false);
                }}
                className="flex items-center w-full px-4 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <FileExcelIcon className="h-6 w-6 text-green-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Export as Excel</div>
                  <div className="text-sm text-gray-500">Export all data to Excel spreadsheet</div>
                </div>
              </button>
            </div>
            
            <div className="mt-5">
              <button
                onClick={() => setShowExportMenu(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Error Modal */}
      {showImportError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Import Error</h3>
                <p className="mt-2 text-sm text-gray-500">{showImportError}</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowImportError(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple icon components
const FilePdfIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 14h-4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 17h-4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 7.5h4" />
  </svg>
);

const FileExcelIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default App;