import React, { useState, useCallback } from 'react';
import { Graph, ColoringResult, Edge } from './types/graph'; // Removed unused Vertex import
import { GraphCanvas } from './components/GraphCanvas';
import { ControlPanel } from './components/ControlPanel';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { StatisticsPanel } from './components/StatisticsPanel';
import { InfoPanel } from './components/InfoPanel';
import { greedyColoring } from './algorithms/greedy';
import { dsaturColoring } from './algorithms/dsatur';
import { welshPowellColoring } from './algorithms/welshPowell';
import { geneticColoring } from './algorithms/genetic';
import { generateEmptyGraph } from './utils/graphGenerators';

const App: React.FC = () => {
  const [graph, setGraph] = useState<Graph>(generateEmptyGraph());
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('greedy');
  const [coloringResult, setColoringResult] = useState<ColoringResult | null>(null);
  const [algorithmResults, setAlgorithmResults] = useState<{ [key: string]: ColoringResult }>({});
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedVertices, setSelectedVertices] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'visualize' | 'compare'>('visualize');

  // Calculate graph statistics
  const graphStats = {
    vertexCount: graph.vertices.length,
    edgeCount: graph.edges.length,
    density: graph.vertices.length > 1 
      ? (2 * graph.edges.length) / (graph.vertices.length * (graph.vertices.length - 1))
      : 0
  };

  // Run coloring algorithm
  const runAlgorithm = useCallback(async (algorithmId: string) => {
    if (graph.vertices.length === 0) return;

    setIsRunning(true);
    setSelectedAlgorithm(algorithmId);

    // Simulate async operation for better UX
    await new Promise(resolve => setTimeout(resolve, 100));

    let result: ColoringResult;
    switch (algorithmId) {
      case 'greedy':
        result = greedyColoring(graph);
        break;
      case 'dsatur':
        result = dsaturColoring(graph);
        break;
      case 'welshPowell':
        result = welshPowellColoring(graph);
        break;
      case 'genetic':
        result = geneticColoring(graph, 100, 200);
        break;
      default:
        result = greedyColoring(graph);
    }

    setColoringResult(result);
    setAlgorithmResults(prev => ({
      ...prev,
      [algorithmId]: result
    }));
    setIsRunning(false);
  }, [graph]);

  // Run all algorithms for comparison
  const runAllAlgorithms = useCallback(async () => {
    if (graph.vertices.length === 0) return;

    setIsRunning(true);
    setActiveTab('compare');

    const algorithms = ['greedy', 'dsatur', 'welshPowell', 'genetic'];
    const results: { [key: string]: ColoringResult } = {};

    for (const algo of algorithms) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Stagger executions
      
      let result: ColoringResult;
      switch (algo) {
        case 'greedy':
          result = greedyColoring(graph);
          break;
        case 'dsatur':
          result = dsaturColoring(graph);
          break;
        case 'welshPowell':
          result = welshPowellColoring(graph);
          break;
        case 'genetic':
          result = geneticColoring(graph, 50, 100);
          break;
        default:
          result = greedyColoring(graph);
      }

      results[algo] = result;
      setAlgorithmResults(prev => ({ ...prev, [algo]: result }));
    }

    setIsRunning(false);
  }, [graph]);

  // Handle graph changes
  const handleGraphChange = useCallback((newGraph: Graph) => {
    setGraph(newGraph);
    setColoringResult(null);
    setSelectedVertices(new Set());
  }, []);

  // Handle vertex selection for edge creation
  const handleVertexSelect = useCallback((vertexId: string) => {
    setSelectedVertices(prev => {
      const newSelected = new Set(prev);
      
      if (newSelected.has(vertexId)) {
        newSelected.delete(vertexId);
      } else if (newSelected.size < 2) {
        newSelected.add(vertexId);
        
        // If two vertices are selected, create an edge
        if (newSelected.size === 2) {
          const [v1, v2] = Array.from(newSelected);
          const edgeExists = graph.edges.some(edge => 
            (edge.source === v1 && edge.target === v2) || 
            (edge.source === v2 && edge.target === v1)
          );
          
          if (!edgeExists && v1 !== v2) {
            const newEdge: Edge = { source: v1, target: v2 };
            const updatedGraph = {
              ...graph,
              edges: [...graph.edges, newEdge]
            };
            setGraph(updatedGraph);
          }
          
          newSelected.clear();
        }
      }
      
      return newSelected;
    });
  }, [graph]);

  // Clear all results
  const clearResults = useCallback(() => {
    setColoringResult(null);
    setAlgorithmResults({});
    setSelectedAlgorithm('greedy');
  }, []);

  // Reset everything
  const resetAll = useCallback(() => {
    setGraph(generateEmptyGraph());
    clearResults();
    setSelectedVertices(new Set());
  }, [clearResults]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-3 lg:px-4 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-0">
            <div className="flex-1">
              <h1 className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2">Graph Color Lab</h1>
              <p className="text-blue-100 text-xs lg:text-base">
                Interactive Graph Coloring Playground
              </p>
            </div>
            <div className="flex items-center gap-2 lg:gap-4 w-full lg:w-auto">
              <button
                onClick={resetAll}
                className="px-3 lg:px-4 py-1 lg:py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm lg:text-base flex-1 lg:flex-none"
              >
                Reset All
              </button>
              <div className="text-xs lg:text-sm bg-black bg-opacity-20 px-2 lg:px-3 py-1 rounded-full whitespace-nowrap">
                V: {graphStats.vertexCount} | E: {graphStats.edgeCount}
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
          
          {/* Left Sidebar - Controls and Information */}
          <div className="xl:col-span-1 space-y-4 lg:space-y-6 order-2 xl:order-1">
            {/* Algorithm Selector */}
            <AlgorithmSelector
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmSelect={runAlgorithm}
              isRunning={isRunning}
            />

            {/* Control Panel */}
            <ControlPanel
              graph={graph}
              onGraphChange={handleGraphChange}
              onRunAlgorithm={runAlgorithm}
              selectedAlgorithm={selectedAlgorithm}
              isRunning={isRunning}
            />

            {/* Information Panel */}
            <InfoPanel 
              algorithm={selectedAlgorithm} 
              graphStats={graphStats}
            />
          </div>

          {/* Main Visualization Area */}
          <div className="xl:col-span-2 order-1 xl:order-2">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-4 lg:mb-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('visualize')}
                  className={`flex-shrink-0 px-3 lg:px-4 py-2 font-medium text-sm ${
                    activeTab === 'visualize'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🎨 Visualize
                </button>
                <button
                  onClick={() => setActiveTab('compare')}
                  className={`flex-shrink-0 px-3 lg:px-4 py-2 font-medium text-sm ${
                    activeTab === 'compare'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📊 Compare
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 lg:gap-3 mb-4 lg:mb-6">
                <button
                  onClick={() => runAlgorithm(selectedAlgorithm)}
                  disabled={isRunning || graph.vertices.length === 0}
                  className="flex-1 min-w-[120px] px-3 lg:px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
                >
                  {isRunning ? 'Running...' : `Run ${selectedAlgorithm}`}
                </button>
                
                <button
                  onClick={runAllAlgorithms}
                  disabled={isRunning || graph.vertices.length === 0}
                  className="flex-1 min-w-[120px] px-3 lg:px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
                >
                  {isRunning ? 'Running All...' : 'Compare All'}
                </button>
                
                <button
                  onClick={clearResults}
                  disabled={isRunning}
                  className="flex-1 min-w-[120px] px-3 lg:px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
                >
                  Clear Results
                </button>
              </div>

              {/* Graph Canvas */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4 lg:mb-6">
                <GraphCanvas
                  graph={graph}
                  onGraphChange={handleGraphChange}
                  coloringResult={coloringResult?.colors}
                  onVertexSelect={handleVertexSelect}
                  selectedVertices={selectedVertices}
                />
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 lg:p-4">
                <h3 className="font-semibold text-yellow-800 mb-2 text-sm lg:text-base">How to Use:</h3>
                <ul className="text-yellow-700 text-xs lg:text-sm space-y-1">
                  <li>• <strong>Press I</strong> - Insert Mode: Click to add vertices</li>
                  <li>• <strong>Press E</strong> - Connect Mode: Click vertices to create edges</li>
                  <li>• <strong>Ctrl + Mouse Wheel</strong> - Zoom in/out</li>
                  <li>• <strong>Drag vertices</strong> to reposition them</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Statistics and Results */}
          <div className="xl:col-span-1 space-y-4 lg:space-y-6 order-3">
            {/* Statistics Panel */}
            <StatisticsPanel
              results={algorithmResults}
              currentAlgorithm={selectedAlgorithm}
            />

            {/* Current Results */}
            {coloringResult && (
              <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
                <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Current Results</h3>
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm lg:text-base">Chromatic Number:</span>
                    <span className="font-bold text-blue-600 text-sm lg:text-base">{coloringResult.chromaticNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm lg:text-base">Execution Time:</span>
                    <span className="font-bold text-green-600 text-sm lg:text-base">
                      {coloringResult.executionTime < 1 ? '<1 ms' : `${coloringResult.executionTime.toFixed(2)} ms`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm lg:text-base">Steps:</span>
                    <span className="font-bold text-purple-600 text-sm lg:text-base">{coloringResult.steps}</span>
                  </div>
                  {coloringResult.conflicts !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm lg:text-base">Conflicts:</span>
                      <span className={`font-bold text-sm lg:text-base ${coloringResult.conflicts === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {coloringResult.conflicts}
                      </span>
                    </div>
                  )}
                </div>

                {/* Color Legend */}
                <div className="mt-3 lg:mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2 text-sm lg:text-base">Color Legend</h4>
                  <div className="flex flex-wrap gap-1 lg:gap-2">
                    {Array.from({ length: coloringResult.chromaticNumber }, (_, i) => (
                      <div key={i} className="flex items-center">
                        <div 
                          className="w-3 h-3 lg:w-4 lg:h-4 rounded mr-1 border border-gray-300"
                          style={{ 
                            backgroundColor: `hsl(${(i * 137.5) % 360}, 70%, 60%)` 
                          }}
                        ></div>
                        <span className="text-xs text-gray-600">Color {i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 lg:py-8 mt-8 lg:mt-12">
        <div className="container mx-auto px-3 lg:px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div>
              <h3 className="font-bold text-base lg:text-lg mb-3 lg:mb-4">Graph Color Lab</h3>
              <p className="text-gray-400 text-xs lg:text-sm">
                An interactive educational tool for exploring graph coloring algorithms and comparing their performance.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-base lg:text-lg mb-3 lg:mb-4">Algorithms</h3>
              <ul className="text-gray-400 text-xs lg:text-sm space-y-1">
                <li>• Greedy Coloring</li>
                <li>• DSatur Algorithm</li>
                <li>• Welsh-Powell</li>
                <li>• Genetic Algorithm</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-base lg:text-lg mb-3 lg:mb-4">Educational Value</h3>
              <ul className="text-gray-400 text-xs lg:text-sm space-y-1">
                <li>• NP-Completeness</li>
                <li>• Algorithm analysis</li>
                <li>• Real-world applications</li>
                <li>• Interactive learning</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 lg:mt-8 pt-4 lg:pt-6 text-center text-gray-400 text-xs lg:text-sm">
            <p>Created for Graph Coloring Research Project • {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
      {/* Loading Overlay */}
      {isRunning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <div>
              <p className="font-semibold text-gray-800">Running Algorithm</p>
              <p className="text-sm text-gray-600">Please wait while we color your graph...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;