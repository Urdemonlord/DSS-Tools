import React, { useState } from 'react';
import { Criteria, CriteriaType } from '../../types';
import * as XLSX from 'xlsx';

// Add interface for Excel data
interface ExcelRowData {
  Name: string;
  Weight: number;
  Type: CriteriaType;
  Percentage: number;
}

interface CriteriaFormProps {
  onAdd: (criteria: Criteria) => void;
}

const CriteriaForm: React.FC<CriteriaFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState<number>(1);
  const [type, setType] = useState<CriteriaType>('benefit');
  const [error, setError] = useState('');
  const [percentage, setPercentage] = useState<number>(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<ExcelRowData>(sheet);

      jsonData.forEach((row: ExcelRowData) => {
        const newCriteria: Criteria = {
          id: `c-${Date.now()}`,
          name: row.Name,
          weight: row.Weight,
          type: row.Type,
          percentage: row.Percentage
        };
        onAdd(newCriteria);
      });
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!name.trim()) {
      setError('Nama diperlukan');
      return;
    }
    
    if (weight <= 0) {
      setError('Bobot harus lebih besar dari 0');
      return;
    }
    
    if (percentage < 0 || percentage > 100) {
      setError('Persentase harus antara 0 dan 100');
      return;
    }
    
    // Create new criteria
    const newCriteria: Criteria = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      weight,
      type,
      percentage
    };
    
    // Add criteria
    onAdd(newCriteria);
    
    // Reset form
    setName('');
    setWeight(1);
    setType('benefit');
    setPercentage(0);
    setError('');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-3">Add New Criterion</h3>
      
      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-500 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="excel-upload" className="block text-sm font-medium text-gray-700 mb-1">
          Import from Excel
        </label>
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="criteria-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="criteria-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Cost, Quality, Time"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="criteria-weight" className="block text-sm font-medium text-gray-700 mb-1">
            Weight
          </label>
          <input
            id="criteria-weight"
            type="number"
            min="0.01"
            step="0.01"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="criteria-percentage" className="block text-sm font-medium text-gray-700 mb-1">
            Persentase
          </label>
          <input
            id="criteria-percentage"
            type="number"
            min="0"
            max="100"
            step="1"
            value={percentage}
            onChange={(e) => setPercentage(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">Type</span>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="benefit"
                checked={type === 'benefit'}
                onChange={() => setType('benefit')}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Benefit (higher is better)</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="cost"
                checked={type === 'cost'}
                onChange={() => setType('cost')}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Cost (lower is better)</span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Criterion
        </button>
      </form>
    </div>
  );
};

export default CriteriaForm;