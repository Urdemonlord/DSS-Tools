import React, { useState } from 'react';
import { Alternative, Criteria } from '../../types';

interface AlternativeFormProps {
  criteria: Criteria[];
  onAdd: (alternative: Alternative) => void;
}

const AlternativeForm: React.FC<AlternativeFormProps> = ({ criteria, onAdd }) => {
  const [name, setName] = useState('');
  const [values, setValues] = useState<Record<string, number>>({});
  const [error, setError] = useState('');

  const handleValueChange = (criterionId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setValues(prev => ({
      ...prev,
      [criterionId]: numValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    // Check if we have at least one value
    const hasValues = Object.keys(values).length > 0;
    if (!hasValues) {
      setError('At least one criterion value is required');
      return;
    }
    
    // Create new alternative
    const newAlternative: Alternative = {
      id: `a-${Date.now()}`,
      name: name.trim(),
      values: { ...values }
    };
    
    // Add alternative
    onAdd(newAlternative);
    
    // Reset form
    setName('');
    setValues({});
    setError('');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-3">Add New Alternative</h3>
      
      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-500 rounded border border-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="alternative-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="alternative-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Option A, Supplier 1"
          />
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Criterion Values</h4>
          
          {criteria.length === 0 ? (
            <div className="text-amber-600 text-sm mb-2">
              Please add criteria first before adding alternatives.
            </div>
          ) : (
            <div className="space-y-3">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="flex items-center">
                  <label htmlFor={`value-${criterion.id}`} className="flex-grow">
                    <span className="text-sm text-gray-700">{criterion.name}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({criterion.type === 'benefit' ? 'higher is better' : 'lower is better'})
                    </span>
                  </label>
                  <input
                    id={`value-${criterion.id}`}
                    type="number"
                    step="0.01"
                    value={values[criterion.id] || ''}
                    onChange={(e) => handleValueChange(criterion.id, e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={criteria.length === 0}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Alternative
        </button>
      </form>
    </div>
  );
};

export default AlternativeForm;