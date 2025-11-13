import { Graph, ColoringResult } from '../types/graph';

interface Chromosome {
  coloring: Map<string, number>;
  fitness: number;
  conflicts: number;
}

const calculateFitness = (graph: Graph, coloring: Map<string, number>): number => {
  let conflicts = 0;
  const colorsUsed = new Set(Array.from(coloring.values()));
  
  // Count conflicts (edges with same color on both ends)
  graph.edges.forEach(edge => {
    const color1 = coloring.get(edge.source);
    const color2 = coloring.get(edge.target);
    if (color1 !== undefined && color2 !== undefined && color1 === color2) {
      conflicts++;
    }
  });
  
  // Fitness favors fewer conflicts and fewer colors
  const colorCount = colorsUsed.size;
  return 1 / (1 + conflicts + colorCount * 0.1);
};

const countConflicts = (graph: Graph, coloring: Map<string, number>): number => {
  let conflicts = 0;
  graph.edges.forEach(edge => {
    const color1 = coloring.get(edge.source);
    const color2 = coloring.get(edge.target);
    if (color1 !== undefined && color2 !== undefined && color1 === color2) {
      conflicts++;
    }
  });
  return conflicts;
};

// Fixed: Removed unused 'graph' parameter
const crossover = (parent1: Map<string, number>, parent2: Map<string, number>): Map<string, number> => {
  const child = new Map<string, number>();
  const vertices = Array.from(parent1.keys());
  
  // Uniform crossover
  vertices.forEach(vertex => {
    child.set(vertex, Math.random() < 0.5 ? 
      parent1.get(vertex)! : 
      parent2.get(vertex)!
    );
  });
  
  return child;
};

const mutate = (coloring: Map<string, number>, graph: Graph, mutationRate: number = 0.1): void => {
  const vertices = Array.from(coloring.keys());
  
  vertices.forEach(vertex => {
    if (Math.random() < mutationRate) {
      // Find neighbors' colors
      const neighborColors = new Set<number>();
      graph.edges.forEach(edge => {
        if (edge.source === vertex) {
          const neighborColor = coloring.get(edge.target);
          if (neighborColor !== undefined) {
            neighborColors.add(neighborColor);
          }
        }
        if (edge.target === vertex) {
          const neighborColor = coloring.get(edge.source);
          if (neighborColor !== undefined) {
            neighborColors.add(neighborColor);
          }
        }
      });
      
      // Try to assign a better color
      let newColor = 0;
      while (neighborColors.has(newColor)) {
        newColor++;
      }
      
      coloring.set(vertex, newColor);
    }
  });
};

export const geneticColoring = (
  graph: Graph, 
  populationSize: number = 50, 
  generations: number = 100
): ColoringResult => {
  const startTime = performance.now();
  let steps = 0;

  // Early return for empty graph
  if (graph.vertices.length === 0) {
    return {
      colors: new Map(),
      chromaticNumber: 0,
      executionTime: 0,
      steps: 0,
      conflicts: 0
    };
  }

  // Generate initial population
  let population: Chromosome[] = [];
  const maxInitialColors = Math.min(10, graph.vertices.length);
  
  for (let i = 0; i < populationSize; i++) {
    const coloring = new Map<string, number>();
    graph.vertices.forEach(vertex => {
      // Start with limited colors for better convergence
      coloring.set(vertex.id, Math.floor(Math.random() * maxInitialColors));
    });
    const conflicts = countConflicts(graph, coloring);
    population.push({
      coloring,
      fitness: calculateFitness(graph, coloring),
      conflicts
    });
    steps++;
  }

  // Evolve population
  for (let gen = 0; gen < generations; gen++) {
    population.sort((a, b) => b.fitness - a.fitness);
    
    // Elitism: keep best solutions
    const eliteCount = Math.floor(populationSize * 0.1);
    const newPopulation: Chromosome[] = population.slice(0, eliteCount);
    
    // Create new offspring
    while (newPopulation.length < populationSize) {
      const parent1 = population[Math.floor(Math.random() * (populationSize / 2))];
      const parent2 = population[Math.floor(Math.random() * (populationSize / 2))];
      
      // Fixed: crossover now doesn't take graph parameter
      const childColoring = crossover(parent1.coloring, parent2.coloring);
      mutate(childColoring, graph, 0.1);
      
      const conflicts = countConflicts(graph, childColoring);
      newPopulation.push({
        coloring: childColoring,
        fitness: calculateFitness(graph, childColoring),
        conflicts
      });
      steps++;
    }
    population = newPopulation;
  }

  // Find best solution (prioritize no conflicts)
  population.sort((a, b) => {
    if (a.conflicts === b.conflicts) {
      return b.fitness - a.fitness;
    }
    return a.conflicts - b.conflicts;
  });

  const best = population[0];
  const colorsUsed = new Set(Array.from(best.coloring.values()));

  return {
    colors: best.coloring,
    chromaticNumber: colorsUsed.size,
    executionTime: performance.now() - startTime,
    steps,
    conflicts: best.conflicts
  };
};