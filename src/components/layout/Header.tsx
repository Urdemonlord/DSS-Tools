import React from 'react';
import { FileDown, FilePlus, Home, Settings, Upload } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onReset: () => void;
  onImport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExport, onReset, onImport }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Home className="h-6 w-6 mr-2" />
          <h1 className="text-xl md:text-2xl font-bold">Decision Support System</h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onImport}
            className="flex items-center px-4 py-2 rounded bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            <Upload className="h-4 w-4 mr-1" />
            <span>Import</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center px-4 py-2 rounded bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            <FileDown className="h-4 w-4 mr-1" />
            <span>Export</span>
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-400 transition-colors duration-200"
          >
            <FilePlus className="h-4 w-4 mr-1" />
            <span>Reset Data</span>
          </button>
          
          <button className="flex items-center px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-400 transition-colors duration-200">
            <Settings className="h-4 w-4 mr-1" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;