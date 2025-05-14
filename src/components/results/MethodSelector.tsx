import React from 'react';
import { DSS_METHODS } from '../../constants';

interface MethodSelectorProps {
  selectedMethod: string;
  onChange: (methodId: string) => void;
}

const MethodSelector: React.FC<MethodSelectorProps> = ({ selectedMethod, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <h3 className="text-lg font-medium p-4 bg-gray-50 border-b">Select Method</h3>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DSS_METHODS.map((method) => (
            <div key={method.id} className="relative">
              <input
                type="radio"
                id={`method-${method.id}`}
                name="dss-method"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => onChange(method.id)}
                className="peer hidden"
              />
              <label
                htmlFor={`method-${method.id}`}
                className="block p-4 border rounded-lg cursor-pointer transition-all
                peer-checked:border-indigo-500 peer-checked:ring-2 peer-checked:ring-indigo-300
                peer-checked:bg-indigo-50
                hover:bg-gray-50"
              >
                <div className="font-medium">{method.name}</div>
                <div className="text-sm text-gray-600 mt-1">{method.description}</div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MethodSelector;