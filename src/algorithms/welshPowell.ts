import { Graph, ColoringResult } from '../types/graph';

export const welshPowellColoring = (graph: Graph): ColoringResult => {
  const colors = new Map<string, number>();
  const startTime = performance.now();
  let steps = 0;

  // Sort vertices by degree in descending order
  const sortedVertices = [...graph.vertices].sort((a, b) => {
    const degreeA = graph.edges.filter(edge => 
      edge.source === a.id || edge.target === a.id
    ).length;
    const degreeB = graph.edges.filter(edge => 
      edge.source === b.id || edge.target === b.id
    ).length;
    return degreeB - degreeA;
  });

  let currentColor = 0;
  const uncolored = new Set(sortedVertices.map(v => v.id));

  while (uncolored.size > 0) {
    // Try to color as many vertices as possible with current color
    const verticesToColor: string[] = [];
    
    sortedVertices.forEach(vertex => {
      if (!uncolored.has(vertex.id)) return;
      
      // Check if vertex can be colored with current color
      let canColor = true;
      graph.edges.forEach(edge => {
        if (edge.source === vertex.id && verticesToColor.includes(edge.target)) {
          canColor = false;
        }
        if (edge.target === vertex.id && verticesToColor.includes(edge.source)) {
          canColor = false;
        }
        steps++;
      });
      
      if (canColor) {
        verticesToColor.push(vertex.id);
      }
    });

    // Color all selected vertices
    verticesToColor.forEach(vertexId => {
      colors.set(vertexId, currentColor);
      uncolored.delete(vertexId);
    });

    currentColor++;
    steps++;
  }

  const chromaticNumber = currentColor;

  return {
    colors,
    chromaticNumber,
    executionTime: performance.now() - startTime,
    steps
  };
};