import React from 'react';
import { Info } from 'lucide-react';

interface InfoCardProps {
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Info className="h-6 w-6 text-blue-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;