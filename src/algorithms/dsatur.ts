import { Graph, ColoringResult } from '../types/graph';

export const dsaturColoring = (graph: Graph): ColoringResult => {
  const colors = new Map<string, number>();
  const saturation = new Map<string, number>();
  const degrees = new Map<string, number>();
  let steps = 0;
  const startTime = performance.now();

  // Initialize data structures
  graph.vertices.forEach(vertex => {
    saturation.set(vertex.id, 0);
    const degree = graph.edges.filter(edge => 
      edge.source === vertex.id || edge.target === vertex.id
    ).length;
    degrees.set(vertex.id, degree);
  });

  const uncolored = new Set(graph.vertices.map(v => v.id));

  while (uncolored.size > 0) {
    // Find vertex with maximum saturation (break ties with degree)
    let selectedVertex = '';
    let maxSaturation = -1;
    let maxDegree = -1;

    uncolored.forEach(vertexId => {
      const sat = saturation.get(vertexId)!;
      const deg = degrees.get(vertexId)!;
      
      if (sat > maxSaturation || (sat === maxSaturation && deg > maxDegree)) {
        maxSaturation = sat;
        maxDegree = deg;
        selectedVertex = vertexId;
      }
      steps++;
    });

    // Color selected vertex
    const neighborColors = new Set<number>();
    graph.edges.forEach(edge => {
      if (edge.source === selectedVertex) {
        const color = colors.get(edge.target);
        if (color !== undefined) neighborColors.add(color);
      }
      if (edge.target === selectedVertex) {
        const color = colors.get(edge.source);
        if (color !== undefined) neighborColors.add(color);
      }
      steps++;
    });

    let color = 0;
    while (neighborColors.has(color)) {
      color++;
      steps++;
    }
    colors.set(selectedVertex, color);
    uncolored.delete(selectedVertex);

    // Update saturation of neighbors
    graph.edges.forEach(edge => {
      if (edge.source === selectedVertex && uncolored.has(edge.target)) {
        const neighborId = edge.target;
        const currentSat = saturation.get(neighborId)!;
        saturation.set(neighborId, currentSat + 1);
      }
      if (edge.target === selectedVertex && uncolored.has(edge.source)) {
        const neighborId = edge.source;
        const currentSat = saturation.get(neighborId)!;
        saturation.set(neighborId, currentSat + 1);
      }
      steps++;
    });
  }

  const chromaticNumber = Math.max(...Array.from(colors.values())) + 1;

  return {
    colors,
    chromaticNumber,
    executionTime: performance.now() - startTime,
    steps
  };
};