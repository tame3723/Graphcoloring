
import React, { useState, useEffect } from 'react';

interface InfoPanelProps {
  algorithm: string;
  graphStats: {
    vertexCount: number;
    edgeCount: number;
    density: number;
  };
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ algorithm, graphStats }) => {
  const [currentFact, setCurrentFact] = useState(0);

  const facts = [
    {
      title: "Four Color Theorem",
      content: "Any planar map can be colored using at most 4 colors so that no adjacent regions share the same color.",
      category: "Theory"
    },
    {
      title: "Real-World Applications",
      content: "Graph coloring is used in scheduling exams, assigning radio frequencies, register allocation in compilers, and solving Sudoku puzzles.",
      category: "Applications"
    },
    {
      title: "Complexity",
      content: "The graph coloring problem is NP-complete, meaning no efficient algorithm exists that solves all instances quickly (unless P=NP).",
      category: "Complexity"
    },
    {
      title: "Chromatic Number",
      content: "The smallest number of colors needed to color a graph is called its chromatic number. Finding it is computationally hard.",
      category: "Theory"
    },
    {
      title: "Bipartite Graphs",
      content: "A graph is bipartite if and only if it is 2-colorable. This can be checked efficiently using BFS or DFS.",
      category: "Special Cases"
    },
    {
      title: "Planar Graphs",
      content: "All planar graphs are 4-colorable, but many can be colored with fewer colors. This was proved in 1976 using computer assistance.",
      category: "Theory"
    }
  ];

  const algorithmDetails = {
    greedy: {
      strengths: ["Fast execution", "Simple implementation", "Good for small graphs"],
      weaknesses: ["No optimality guarantee", "Order-dependent results"],
      tip: "Try different vertex orderings for better results!"
    },
    dsatur: {
      strengths: ["Often finds optimal coloring", "Better than basic greedy", "Intelligent vertex selection"],
      weaknesses: ["Slower than basic greedy", "Still not guaranteed optimal"],
      tip: "Works well on graphs with complex local structures"
    },
    welshPowell: {
      strengths: ["Good practical results", "Simple to understand", "Fast execution"],
      weaknesses: ["Not always optimal", "Performance varies with graph structure"],
      tip: "Excellent for graphs where high-degree vertices constrain coloring"
    },
    genetic: {
      strengths: ["Handles large graphs", "Can escape local optima", "Improves over time"],
      weaknesses: ["No optimality guarantee", "Can be slow", "Parameter sensitive"],
      tip: "Increase population size and generations for better results"
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length);
    }, 8000); // Change fact every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const currentAlgoDetails = algorithmDetails[algorithm as keyof typeof algorithmDetails] || algorithmDetails.greedy;

  return (
    <div className="space-y-6">
      {/* Graph Statistics */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-gray-800 mb-3">Graph Statistics</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{graphStats.vertexCount}</div>
            <div className="text-xs text-gray-600">Vertices</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{graphStats.edgeCount}</div>
            <div className="text-xs text-gray-600">Edges</div>
          </div>
          <div className="text-center col-span-2">
            <div className="text-lg font-bold text-purple-600">
              {graphStats.density.toFixed(3)}
            </div>
            <div className="text-xs text-gray-600">Density</div>
          </div>
        </div>
      </div>

      {/* Algorithm Information */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-gray-800 mb-3">Algorithm Analysis</h3>
        
        <div className="mb-4">
          <h4 className="font-semibold text-green-600 text-sm mb-2">Strengths</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {currentAlgoDetails.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-red-600 text-sm mb-2">Weaknesses</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {currentAlgoDetails.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">⚠</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-blue-800 text-sm mb-1">Pro Tip</h4>
          <p className="text-blue-700 text-sm">{currentAlgoDetails.tip}</p>
        </div>
      </div>

      {/* Educational Facts Carousel */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg shadow-md border border-purple-100">
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">💡</span>
          <h3 className="font-bold text-gray-800">Did You Know?</h3>
        </div>
        
        <div className="transition-all duration-500 ease-in-out">
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
              {facts[currentFact].category}
            </span>
          </div>
          <h4 className="font-semibold text-gray-800 text-sm mb-2">
            {facts[currentFact].title}
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {facts[currentFact].content}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-1 mt-3">
          {facts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentFact(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentFact ? 'bg-purple-500' : 'bg-purple-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Theory */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-gray-800 mb-3">Quick Theory</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Chromatic Number (χ):</strong> Minimum colors needed for proper coloring.
          </p>
          <p>
            <strong>Proper Coloring:</strong> No two adjacent vertices share the same color.
          </p>
          <p>
            <strong>Clique Number (ω):</strong> Size of largest complete subgraph. Always ω ≤ χ.
          </p>
        </div>
      </div>
    </div>
  );
};