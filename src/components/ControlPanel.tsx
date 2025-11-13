import React from 'react';
import { Graph } from '../types/graph';
import { generateCompleteGraph, generateRandomGraph, generateBipartiteGraph, generateCycleGraph } from '../utils/graphGenerators';

interface ControlPanelProps {
  graph: Graph;
  onGraphChange: (graph: Graph) => void;
  onRunAlgorithm: (algorithm: string) => void;
  selectedAlgorithm: string;
  isRunning: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  graph,
  onGraphChange,
  onRunAlgorithm,
  selectedAlgorithm,
  isRunning
}) => {
  const algorithms = [
    { id: 'greedy', name: 'Greedy Coloring' },
    { id: 'dsatur', name: 'DSatur (Improved)' },
    { id: 'welshPowell', name: 'Welsh-Powell' },
    { id: 'genetic', name: 'Genetic Algorithm' }
  ];

  const graphTypes = [
    { id: 'empty', name: 'Empty Graph', generator: () => ({ vertices: [], edges: [] }) },
    { id: 'random', name: 'Random Graph', generator: () => generateRandomGraph(8, 0.3) },
    { id: 'complete', name: 'Complete Graph', generator: () => generateCompleteGraph(6) },
    { id: 'bipartite', name: 'Bipartite Graph', generator: () => generateBipartiteGraph(4, 4) },
    { id: 'cycle', name: 'Cycle Graph', generator: () => generateCycleGraph(8) }
  ];

  const clearGraph = () => {
    onGraphChange({ vertices: [], edges: [] });
  };

  const addRandomVertex = () => {
    const newVertex = {
      id: `v${Date.now()}`,
      x: 100 + Math.random() * 600,
      y: 100 + Math.random() * 400,
      color: 0,
      label: `${graph.vertices.length + 1}`
    };
    onGraphChange({
      ...graph,
      vertices: [...graph.vertices, newVertex]
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Graph Controls</h2>
      
      {/* Algorithm Selection */}
      <div>
        <h3 className="font-semibold mb-2">Coloring Algorithms</h3>
        <div className="grid grid-cols-2 gap-2">
          {algorithms.map(algo => (
            <button
              key={algo.id}
              onClick={() => onRunAlgorithm(algo.id)}
              disabled={isRunning || graph.vertices.length === 0}
              className={`p-2 rounded text-sm ${
                selectedAlgorithm === algo.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {algo.name}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Generation */}
      <div>
        <h3 className="font-semibold mb-2">Generate Graph</h3>
        <div className="grid grid-cols-2 gap-2">
          {graphTypes.map(type => (
            <button
              key={type.id}
              onClick={() => onGraphChange(type.generator())}
              disabled={isRunning}
              className="p-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 disabled:opacity-50"
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Controls */}
      <div>
        <h3 className="font-semibold mb-2">Manual Editing</h3>
        <div className="flex gap-2">
          <button
            onClick={addRandomVertex}
            disabled={isRunning}
            className="flex-1 p-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 disabled:opacity-50"
          >
            Add Vertex
          </button>
          <button
            onClick={clearGraph}
            disabled={isRunning}
            className="flex-1 p-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 disabled:opacity-50"
          >
            Clear Graph
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600">
        <p>• Double-click canvas to add vertices</p>
        <p>• Drag vertices to move them</p>
        <p>• Select two vertices to add an edge</p>
      </div>
    </div>
  );
};