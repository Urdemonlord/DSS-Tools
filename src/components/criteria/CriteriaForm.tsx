import React, { useState } from 'react';
import { Criteria, CriteriaType } from '../../types';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

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
  const [newCriterion, setNewCriterion] = useState({
    name: '',
    weight: 1,
    type: 'benefit' as CriteriaType,
    percentage: 0,
    importance: undefined as number | undefined,
  });
  const [error, setError] = useState('');

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
          percentage: row.Percentage,
          importance: row.Weight
        };
        onAdd(newCriteria);
      });
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!newCriterion.name || (newCriterion.weight <= 0 && (newCriterion.importance === undefined || newCriterion.importance <= 0)) || !newCriterion.type) {
      setError('Please fill in all fields correctly (Name, Weight or Importance, and Type).');
      return;
    }
    
    if (newCriterion.percentage < 0 || newCriterion.percentage > 100) {
      setError('Persentase harus antara 0 dan 100');
      return;
    }
    
    // Create new criteria
    const newCriteria: Criteria = {
      id: uuidv4(),
      name: newCriterion.name,
      weight: newCriterion.weight,
      importance: newCriterion.importance,
      type: newCriterion.type,
      percentage: newCriterion.percentage
    };
    
    // Add criteria
    onAdd(newCriteria);
    
    // Reset form
    setNewCriterion({
      name: '',
      weight: 1,
      type: 'benefit',
      percentage: 0,
      importance: undefined,
    });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCriterion({
      ...newCriterion,
      [name]: name === 'weight' || name === 'importance' ? parseFloat(value) || 0 : value,
    });
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
            name="name"
            value={newCriterion.name}
            onChange={handleInputChange}
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
            name="weight"
            step="0.01"
            value={newCriterion.weight}
            onChange={handleInputChange}
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
            name="percentage"
            min="0"
            max="100"
            step="1"
            value={newCriterion.percentage}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="importance" className="block text-sm font-medium text-gray-700">Kepentingan</label>
          <input
            type="number"
            id="importance"
            name="importance"
            value={newCriterion.importance || ''}
            onChange={handleInputChange}
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., 5"
          />
        </div>
        
        <div className="mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">Type</span>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="benefit"
                checked={newCriterion.type === 'benefit'}
                onChange={(e) => setNewCriterion({ ...newCriterion, type: e.target.value as CriteriaType })}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Benefit (higher is better)</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="cost"
                checked={newCriterion.type === 'cost'}
                onChange={(e) => setNewCriterion({ ...newCriterion, type: e.target.value as CriteriaType })}
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