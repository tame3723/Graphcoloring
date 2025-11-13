import React from 'react';
import { ColoringResult } from '../types/graph'; // Removed unused AlgorithmStats import

interface StatisticsPanelProps {
  results: { [key: string]: ColoringResult };
  currentAlgorithm: string;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ results, currentAlgorithm }) => {
  const currentResult = results[currentAlgorithm];
  
  if (!currentResult) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Algorithm Statistics</h2>
        <p className="text-gray-500">Run an algorithm to see statistics</p>
      </div>
    );
  }

  const formatTime = (ms: number): string => {
    return ms < 1 ? '<1 ms' : `${ms.toFixed(2)} ms`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Algorithm Performance</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-sm text-blue-600">Chromatic Number</div>
          <div className="text-2xl font-bold text-blue-800">{currentResult.chromaticNumber}</div>
        </div>
        
        <div className="bg-green-50 p-3 rounded">
          <div className="text-sm text-green-600">Execution Time</div>
          <div className="text-2xl font-bold text-green-800">
            {formatTime(currentResult.executionTime)}
          </div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded">
          <div className="text-sm text-purple-600">Steps</div>
          <div className="text-2xl font-bold text-purple-800">{currentResult.steps}</div>
        </div>
        
        <div className="bg-orange-50 p-3 rounded">
          <div className="text-sm text-orange-600">Conflicts</div>
          <div className="text-2xl font-bold text-orange-800">
            {currentResult.conflicts || 0}
          </div>
        </div>
      </div>

      {/* Comparative Results */}
      {Object.keys(results).length > 1 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Comparison</h3>
          <div className="space-y-2">
            {Object.entries(results).map(([algo, result]) => (
              <div key={algo} className={`flex justify-between items-center p-2 rounded ${
                algo === currentAlgorithm ? 'bg-gray-100' : ''
              }`}>
                <span className="capitalize">{algo}</span>
                <div className="flex gap-4 text-sm">
                  <span>χ: {result.chromaticNumber}</span>
                  <span>Time: {formatTime(result.executionTime)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};