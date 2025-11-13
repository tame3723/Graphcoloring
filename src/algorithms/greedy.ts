import { Graph, ColoringResult } from '../types/graph';

export const greedyColoring = (graph: Graph): ColoringResult => {
  const colors = new Map<string, number>();
  const startTime = performance.now();
  let steps = 0;

  // Sort vertices by degree (descending) - often gives better results
  const verticesByDegree = [...graph.vertices].sort((a, b) => {
    const degreeA = graph.edges.filter(edge => 
      edge.source === a.id || edge.target === a.id
    ).length;
    const degreeB = graph.edges.filter(edge => 
      edge.source === b.id || edge.target === b.id
    ).length;
    return degreeB - degreeA;
  });

  verticesByDegree.forEach(vertex => {
    const neighborColors = new Set<number>();
    
    // Get colors of all adjacent vertices
    graph.edges.forEach(edge => {
      if (edge.source === vertex.id) {
        const neighborColor = colors.get(edge.target);
        if (neighborColor !== undefined) neighborColors.add(neighborColor);
      }
      if (edge.target === vertex.id) {
        const neighborColor = colors.get(edge.source);
        if (neighborColor !== undefined) neighborColors.add(neighborColor);
      }
      steps++;
    });

    // Assign smallest available color
    let color = 0;
    while (neighborColors.has(color)) {
      color++;
      steps++;
    }
    colors.set(vertex.id, color);
  });

  const chromaticNumber = Math.max(...Array.from(colors.values())) + 1;
  
  return {
    colors,
    chromaticNumber,
    executionTime: performance.now() - startTime,
    steps
  };
};