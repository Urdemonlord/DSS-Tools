import React, { useState } from 'react';
import { Edit, Trash } from 'lucide-react';
import { Criteria, CriteriaType } from '../../types';

interface CriteriaListProps {
  criteria: Criteria[];
  onUpdate: (criterionId: string, updates: Partial<Criteria>) => void;
  onDelete: (criterionId: string) => void;
}

const CriteriaList: React.FC<CriteriaListProps> = ({ criteria, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editWeight, setEditWeight] = useState(1);
  const [editType, setEditType] = useState<CriteriaType>('benefit');

  const startEditing = (criterion: Criteria) => {
    setEditingId(criterion.id);
    setEditName(criterion.name);
    setEditWeight(criterion.weight);
    setEditType(criterion.type);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveChanges = (id: string) => {
    if (editName.trim() && editWeight > 0) {
      onUpdate(id, {
        name: editName.trim(),
        weight: editWeight,
        type: editType
      });
      setEditingId(null);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    if (confirm('Are you sure you want to delete this criterion? This will remove it from all alternatives.')) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-medium p-4 bg-gray-50 border-b">Criteria List</h3>
      
      {criteria.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No criteria added yet. Add some criteria to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {criteria.map((criterion) => (
                <tr key={criterion.id}>
                  {editingId === criterion.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={editWeight}
                          onChange={(e) => setEditWeight(parseFloat(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value as CriteriaType)}
                          className="w-full px-2 py-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="benefit">Benefit</option>
                          <option value="cost">Cost</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button
                          onClick={() => saveChanges(criterion.id)}
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
                      <td className="px-4 py-4">{criterion.name}</td>
                      <td className="px-4 py-4">{criterion.weight}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            criterion.type === 'benefit' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {criterion.type === 'benefit' ? 'Benefit' : 'Cost'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right space-x-2">
                        <button
                          onClick={() => startEditing(criterion)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(criterion.id)}
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

export default CriteriaList;