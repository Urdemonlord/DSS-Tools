import React from 'react';
import { MethodResult } from '../../types';
import { Award, ArrowDown, ArrowUp, Info } from 'lucide-react';

interface ResultsTableProps {
  results: MethodResult[];
  alternativeNames: Record<string, string>;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, alternativeNames }) => {
  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-500">No results available. Please make sure you have added criteria and alternatives.</div>
      </div>
    );
  }

  // Sort results by rank
  const sortedResults = [...results].sort((a, b) => a.rank - b.rank);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-medium p-4 bg-gray-50 border-b flex items-center">
        <Award className="h-5 w-5 mr-2 text-amber-500" />
        <span>Results Ranking</span>
      </h3>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alternative
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedResults.map((result) => (
                <tr 
                  key={result.alternativeId}
                  className={result.rank === 1 ? 'bg-indigo-50' : undefined}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold">
                      {result.rank}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">
                      {alternativeNames[result.alternativeId] || result.alternativeId}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-mono">{result.score.toFixed(4)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 flex">
          <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">How to interpret the results:</p>
            <ul className="mt-1 ml-6 list-disc">
              <li>Higher scores indicate better alternatives.</li>
              <li>The ranking is based on the calculated scores.</li>
              <li>Results are specific to the selected method and criteria weights.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;