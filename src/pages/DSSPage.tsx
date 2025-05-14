import React, { useMemo, useState } from 'react';
import CriteriaForm from '../components/criteria/CriteriaForm';
import CriteriaList from '../components/criteria/CriteriaList';
import AlternativeForm from '../components/alternatives/AlternativeForm';
import AlternativeList from '../components/alternatives/AlternativeList';
import MethodSelector from '../components/results/MethodSelector';
import ResultsTable from '../components/results/ResultsTable';
import ResultsChart from '../components/results/ResultsChart';
import CriteriaWeightsChart from '../components/results/CriteriaWeightsChart';
import ExportMenu from '../components/results/ExportMenu';
import InfoCard from '../components/common/InfoCard';
import { useDSSData } from '../hooks/useDSSData';
import { useCalculationResults } from '../hooks/useCalculationResults';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const DSSPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'input' | 'results'>('input');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Get data and calculation results from custom hooks
  const {
    criteria,
    alternatives,
    lastSaved,
    addCriterion,
    updateCriterion,
    deleteCriterion,
    addAlternative,
    updateAlternative,
    deleteAlternative,
    updateAlternativeValue,
    resetData
  } = useDSSData();

  const {
    selectedMethod,
    setSelectedMethod,
    currentResults,
    allResults
  } = useCalculationResults(criteria, alternatives);

  // Create a lookup for alternative names
  const alternativeNames = useMemo(() => {
    return alternatives.reduce<Record<string, string>>((acc, alt) => {
      acc[alt.id] = alt.name;
      return acc;
    }, {});
  }, [alternatives]);

  // Handle export popup
  const handleExportClick = () => {
    setExportMenuOpen(!exportMenuOpen);
  };

  const handleExportPDF = () => {
    exportToPDF(criteria, alternatives, allResults, selectedMethod);
    setExportMenuOpen(false);
  };

  const handleExportExcel = () => {
    exportToExcel(criteria, alternatives, allResults);
    setExportMenuOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex mb-6 bg-white rounded-lg shadow-sm">
        <button
          className={`flex-1 py-3 text-center font-medium rounded-l-lg ${
            activeTab === 'input'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          } transition-colors`}
          onClick={() => setActiveTab('input')}
        >
          Input Data
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium rounded-r-lg ${
            activeTab === 'results'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          } transition-colors`}
          onClick={() => setActiveTab('results')}
        >
          Results & Analysis
        </button>
      </div>

      {/* Input Tab */}
      {activeTab === 'input' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Criteria</h2>
              <div className="space-y-6">
                <CriteriaForm onAdd={addCriterion} />
                <CriteriaList
                  criteria={criteria}
                  onUpdate={updateCriterion}
                  onDelete={deleteCriterion}
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Alternatives</h2>
              <div className="space-y-6">
                <AlternativeForm 
                  criteria={criteria} 
                  onAdd={addAlternative} 
                />
                <AlternativeList
                  criteria={criteria}
                  alternatives={alternatives}
                  onUpdate={updateAlternative}
                  onDelete={deleteAlternative}
                  onUpdateValue={updateAlternativeValue}
                />
              </div>
            </div>
          </div>
          
          {lastSaved && (
            <div className="text-sm text-gray-500 text-right">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">Results & Analysis</h2>
            
            <div className="flex gap-2">
              <ExportMenu
                criteria={criteria}
                alternatives={alternatives}
                results={allResults}
                selectedMethod={selectedMethod}
              />
            </div>
          </div>
          
          {/* Check if we have enough data */}
          {criteria.length === 0 || alternatives.length === 0 ? (
            <InfoCard
              title="Insufficient Data"
              description="Please add at least one criterion and one alternative in the Input Data tab to generate results."
            />
          ) : (
            <>
              <MethodSelector
                selectedMethod={selectedMethod}
                onChange={setSelectedMethod}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ResultsTable 
                    results={currentResults} 
                    alternativeNames={alternativeNames} 
                  />
                </div>
                <div>
                  <CriteriaWeightsChart criteria={criteria} />
                </div>
              </div>
              
              <ResultsChart 
                results={currentResults} 
                alternativeNames={alternativeNames} 
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DSSPage;