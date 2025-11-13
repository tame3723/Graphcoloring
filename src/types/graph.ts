export interface Vertex {
  id: string;
  x: number;
  y: number;
  color: number;
  label: string;
}

export interface Edge {
  source: string;
  target: string;
}

export interface Graph {
  vertices: Vertex[];
  edges: Edge[];
}

export interface ColoringResult {
  colors: Map<string, number>;
  chromaticNumber: number;
  executionTime: number;
  steps: number;
  conflicts?: number;
}

export interface AlgorithmStats {
  name: string;
  chromaticNumber: number;
  executionTime: number;
  steps: number;
  conflicts: number;
}