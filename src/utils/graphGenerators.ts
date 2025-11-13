import { Graph, Vertex, Edge } from '../types/graph';

export const generateEmptyGraph = (): Graph => ({
  vertices: [],
  edges: []
});

export const generateCompleteGraph = (n: number): Graph => {
  const vertices: Vertex[] = [];
  const edges: Edge[] = [];

  // Create vertices in a circle
  const centerX = 400, centerY = 300, radius = 200;
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n;
    vertices.push({
      id: `v${i}`,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      color: 0,
      label: `${i + 1}`
    });
  }

  // Create edges for complete graph
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      edges.push({
        source: `v${i}`,
        target: `v${j}`
      });
    }
  }

  return { vertices, edges };
};

export const generateRandomGraph = (vertexCount: number, edgeProbability: number = 0.3): Graph => {
  const vertices: Vertex[] = [];
  const edges: Edge[] = [];

  // Create random vertices
  for (let i = 0; i < vertexCount; i++) {
    vertices.push({
      id: `v${i}`,
      x: 100 + Math.random() * 600,
      y: 100 + Math.random() * 400,
      color: 0,
      label: `${i + 1}`
    });
  }

  // Create random edges
  for (let i = 0; i < vertexCount; i++) {
    for (let j = i + 1; j < vertexCount; j++) {
      if (Math.random() < edgeProbability) {
        edges.push({
          source: `v${i}`,
          target: `v${j}`
        });
      }
    }
  }

  return { vertices, edges };
};

export const generateBipartiteGraph = (setASize: number, setBSize: number): Graph => {
  const vertices: Vertex[] = [];
  const edges: Edge[] = [];

  // Create set A vertices on left
  for (let i = 0; i < setASize; i++) {
    vertices.push({
      id: `a${i}`,
      x: 200,
      y: 100 + (i * 400) / setASize,
      color: 0,
      label: `A${i + 1}`
    });
  }

  // Create set B vertices on right
  for (let i = 0; i < setBSize; i++) {
    vertices.push({
      id: `b${i}`,
      x: 600,
      y: 100 + (i * 400) / setBSize,
      color: 0,
      label: `B${i + 1}`
    });
  }

  // Create random edges between sets
  for (let i = 0; i < setASize; i++) {
    for (let j = 0; j < setBSize; j++) {
      if (Math.random() < 0.6) { // Higher probability for demonstration
        edges.push({
          source: `a${i}`,
          target: `b${j}`
        });
      }
    }
  }

  return { vertices, edges };
};

export const generateCycleGraph = (n: number): Graph => {
  const graph = generateEmptyGraph();

  // Create vertices in a circle
  const centerX = 400, centerY = 300, radius = 200;
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n;
    graph.vertices.push({
      id: `v${i}`,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      color: 0,
      label: `${i + 1}`
    });
  }

  // Create cycle edges
  for (let i = 0; i < n; i++) {
    graph.edges.push({
      source: `v${i}`,
      target: `v${(i + 1) % n}`
    });
  }

  return graph;
};