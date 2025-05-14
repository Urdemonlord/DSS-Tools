import React, { useState } from 'react';
import { Edit, Trash } from 'lucide-react';
import { Alternative, Criteria } from '../../types';

interface AlternativeListProps {
  alternatives: Alternative[];
  criteria: Criteria[];
  onUpdate: (alternativeId: string, updates: Partial<Alternative>) => void;
  onDelete: (alternativeId: string) => void;
  onUpdateValue: (alternativeId: string, criterionId: string, value: number) => void;
}

const AlternativeList: React.FC<AlternativeListProps> = ({ 
  alternatives, 
  criteria, 
  onUpdate, 
  onDelete, 
  onUpdateValue 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  const startEditing = (alternative: Alternative) => {
    setEditingId(alternative.id);
    setEditName(alternative.name);
    setEditValues({ ...alternative.values });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveChanges = (id: string) => {
    if (editName.trim()) {
      onUpdate(id, {
        name: editName.trim(),
        values: editValues
      });
      setEditingId(null);
    }
  };

  const handleValueChange = (criterionId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setEditValues(prev => ({
      ...prev,
      [criterionId]: numValue
    }));
  };

  const handleCellValueChange = (alternativeId: string, criterionId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    onUpdateValue(alternativeId, criterionId, numValue);
  };

  const handleDeleteConfirm = (id: string) => {
    if (confirm('Are you sure you want to delete this alternative?')) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-medium p-4 bg-gray-50 border-b">Alternatives List</h3>
      
      {alternatives.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No alternatives added yet. Add some alternatives to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                {criteria.map((criterion) => (
                  <th 
                    key={criterion.id} 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {criterion.name}
                    <span className="block text-xxs normal-case font-normal">
                      ({criterion.type === 'benefit' ? 'higher better' : 'lower better'})
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alternatives.map((alternative) => (
                <tr key={alternative.id}>
                  {editingId === alternative.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      {criteria.map((criterion) => (
                        <td key={criterion.id} className="px-4 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={editValues[criterion.id] || ''}
                            onChange={(e) => handleValueChange(criterion.id, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-2 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => saveChanges(alternative.id)}
                          className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-2 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-xs"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-4 font-medium">{alternative.name}</td>
                      {criteria.map((criterion) => (
                        <td key={criterion.id} className="px-4 py-4">
                          <input
                            type="number"
                            step="0.01"
                            value={alternative.values[criterion.id] || ''}
                            onChange={(e) => handleCellValueChange(alternative.id, criterion.id, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-200 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => startEditing(alternative)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(alternative.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AlternativeList;