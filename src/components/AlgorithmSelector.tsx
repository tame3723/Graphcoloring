import React, { useState } from 'react';

interface Algorithm {
  id: string;
  name: string;
  description: string;
  complexity: string;
  bestFor: string;
  guarantees: string;
}

interface AlgorithmSelectorProps {
  selectedAlgorithm: string;
  onAlgorithmSelect: (algorithmId: string) => void;
  isRunning: boolean;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onAlgorithmSelect,
  isRunning
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const algorithms: Algorithm[] = [
    {
      id: 'greedy',
      name: 'Greedy',
      description: 'Simple sequential coloring',
      complexity: 'O(V² + E)',
      bestFor: 'Quick results',
      guarantees: 'Fast but not optimal'
    },
    {
      id: 'dsatur',
      name: 'DSatur', 
      description: 'Most constrained first',
      complexity: 'O(V³)',
      bestFor: 'Better quality',
      guarantees: 'Near-optimal'
    },
    {
      id: 'welshPowell',
      name: 'Welsh-Powell',
      description: 'Degree-based ordering',
      complexity: 'O(V²)',
      bestFor: 'High-degree graphs',
      guarantees: 'Good heuristic'
    },
    {
      id: 'genetic',
      name: 'Genetic',
      description: 'Evolutionary approach',
      complexity: 'O(gens × pop)',
      bestFor: 'Large graphs',
      guarantees: 'Probabilistic'
    }
  ];

  const selectedAlgo = algorithms.find(algo => algo.id === selectedAlgorithm) || algorithms[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Compact Header - Always Visible */}
      <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">Algorithms</h2>
              <p className="text-gray-500 text-xs">
                Current: <span className="font-semibold text-blue-600">{selectedAlgo.name}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isRunning && (
              <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
                <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-blue-600 mr-1"></div>
                <span className="text-blue-700 text-xs font-medium">Running</span>
              </div>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <span className="text-gray-600 text-sm font-bold">
                {isExpanded ? '−' : '+'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Algorithm Selection Grid - Always Visible */}
      <div className="p-3 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-2">
          {algorithms.map((algorithm) => (
            <button
              key={algorithm.id}
              disabled={isRunning}
              onClick={() => {
                onAlgorithmSelect(algorithm.id);
                setIsExpanded(false); // Auto-collapse after selection on mobile
              }}
              className={`
                group relative p-3 rounded-lg border-2 transition-all duration-200 
                text-left min-h-[80px] flex flex-col justify-between
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                active:scale-95
                ${selectedAlgorithm === algorithm.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm scale-105'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25'
                }
                ${isRunning ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
              `}
            >
              {/* Selection Indicator */}
              {selectedAlgorithm === algorithm.id && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}

              {/* Algorithm Name */}
              <div className="mb-1">
                <h3 className={`
                  font-bold text-sm leading-tight
                  ${selectedAlgorithm === algorithm.id ? 'text-blue-700' : 'text-gray-800'}
                `}>
                  {algorithm.name}
                </h3>
              </div>

              {/* Algorithm Details */}
              <div className="space-y-0.5">
                <p className={`
                  text-xs leading-tight
                  ${selectedAlgorithm === algorithm.id ? 'text-blue-600' : 'text-gray-600'}
                `}>
                  {algorithm.description}
                </p>
                <p className={`
                  text-xs font-semibold
                  ${selectedAlgorithm === algorithm.id ? 'text-blue-700' : 'text-gray-700'}
                `}>
                  {algorithm.complexity}
                </p>
              </div>

              {/* Hover Effect */}
              <div className={`
                absolute inset-0 rounded-lg transition-opacity duration-200
                ${selectedAlgorithm === algorithm.id 
                  ? 'bg-blue-500 opacity-5' 
                  : 'group-hover:bg-blue-500 opacity-0 group-hover:opacity-5'
                }
              `}></div>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Information - Expandable */}
      <div className={`
        transition-all duration-300 ease-in-out overflow-hidden
        ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="p-4 space-y-4 bg-gradient-to-br from-blue-25 to-blue-50">
          {/* Current Algorithm Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{selectedAlgo.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{selectedAlgo.description}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {selectedAlgo.complexity}
            </span>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mb-1">Best For</h4>
                <p className="text-gray-600 text-sm bg-white px-3 py-2 rounded-lg border border-gray-200">
                  {selectedAlgo.bestFor}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mb-1">Guarantees</h4>
                <p className="text-gray-600 text-sm bg-white px-3 py-2 rounded-lg border border-gray-200">
                  {selectedAlgo.guarantees}
                </p>
              </div>
            </div>

            {/* Performance Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="font-semibold text-yellow-800 text-sm mb-2 flex items-center">
                <span className="mr-2">💡</span>
                Performance Tips
              </h4>
              <ul className="text-yellow-700 text-xs space-y-1">
                {selectedAlgorithm === 'greedy' && (
                  <>
                    <li>• Fastest for basic coloring</li>
                    <li>• Works well on sparse graphs</li>
                    <li>• Try different vertex orderings</li>
                  </>
                )}
                {selectedAlgorithm === 'dsatur' && (
                  <>
                    <li>• Better than greedy for complex graphs</li>
                    <li>• Often optimal for small graphs</li>
                    <li>• Good for dense structures</li>
                  </>
                )}
                {selectedAlgorithm === 'welshPowell' && (
                  <>
                    <li>• Excellent for regular graphs</li>
                    <li>• Good speed-quality balance</li>
                    <li>• Try on complete graphs</li>
                  </>
                )}
                {selectedAlgorithm === 'genetic' && (
                  <>
                    <li>• Best for large complex graphs</li>
                    <li>• Increase population size</li>
                    <li>• May take longer but better results</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 py-2 px-3 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
          <button
            disabled={isRunning}
            onClick={() => onAlgorithmSelect(selectedAlgorithm)}
            className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Run {selectedAlgo.name}
          </button>
        </div>
      </div>
    </div>
  );
};