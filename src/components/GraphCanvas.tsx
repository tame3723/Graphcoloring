import React, { useRef, useState, useCallback } from 'react';
import { Graph, Vertex } from '../types/graph';
import { getColorFromIndex } from '../utils/colorPalettes';

interface GraphCanvasProps {
  graph: Graph;
  onGraphChange: (graph: Graph) => void;
  coloringResult?: Map<string, number>;
  onVertexSelect?: (vertexId: string) => void;
  selectedVertices?: Set<string>;
}

type CanvasMode = 'edit' | 'connect' | 'view';

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ 
  graph, 
  onGraphChange, 
  coloringResult,
  onVertexSelect,
  selectedVertices = new Set()
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasMode, setCanvasMode] = useState<CanvasMode>('edit');
  const [isViewLocked, setIsViewLocked] = useState(false);
  const [draggedVertex, setDraggedVertex] = useState<Vertex | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Handle vertex drag
  const handleVertexDrag = useCallback((vertexId: string, x: number, y: number) => {
    if (canvasMode !== 'edit' || isViewLocked) return;
    
    const updatedVertices = graph.vertices.map(v => 
      v.id === vertexId ? { ...v, x, y } : v
    );
    
    const updatedGraph = {
      ...graph,
      vertices: updatedVertices
    };
    onGraphChange(updatedGraph);
  }, [graph, onGraphChange, canvasMode, isViewLocked]);

  // Handle add vertex
  const handleAddVertex = useCallback((x: number, y: number) => {
    if (canvasMode !== 'edit' || isViewLocked) return;
    
    const newVertex: Vertex = {
      id: `v${Date.now()}`,
      x,
      y,
      color: -1,
      label: `${graph.vertices.length + 1}`
    };
    
    const updatedGraph = {
      ...graph,
      vertices: [...graph.vertices, newVertex]
    };
    onGraphChange(updatedGraph);
  }, [graph, onGraphChange, canvasMode, isViewLocked]);

  // Handle delete vertex
  const handleDeleteVertex = useCallback((vertexId: string) => {
    if (canvasMode !== 'edit' || isViewLocked) return;
    
    const updatedVertices = graph.vertices.filter(v => v.id !== vertexId);
    const updatedEdges = graph.edges.filter(edge => 
      edge.source !== vertexId && edge.target !== vertexId
    );
    
    const updatedGraph = {
      ...graph,
      vertices: updatedVertices,
      edges: updatedEdges
    };
    onGraphChange(updatedGraph);
  }, [graph, onGraphChange, canvasMode, isViewLocked]);

  // Handle vertex click for connection
  const handleVertexClick = useCallback((vertexId: string) => {
    if (canvasMode === 'connect' && !isViewLocked) {
      onVertexSelect?.(vertexId);
    }
  }, [canvasMode, isViewLocked, onVertexSelect]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (canvasMode !== 'view') return;
    
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom(prev => Math.max(0.1, Math.min(4, prev * (1 + delta))));
  }, [canvasMode]);

  // Pan handler for view mode
  const handleMouseMoveView = useCallback((e: React.MouseEvent) => {
    if (canvasMode !== 'view' || !draggedVertex) return;
    
    setPan(prev => ({
      x: prev.x + e.movementX / zoom,
      y: prev.y + e.movementY / zoom
    }));
  }, [canvasMode, zoom, draggedVertex]);

  // Mouse event handlers
  const handleMouseDown = useCallback((vertex: Vertex) => {
    if (canvasMode === 'edit' && !isViewLocked) {
      setDraggedVertex(vertex);
    } else if (canvasMode === 'view') {
      setDraggedVertex(vertex); // Use vertex as flag for panning
    }
  }, [canvasMode, isViewLocked]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (canvasMode === 'view' && draggedVertex) {
      handleMouseMoveView(e);
    } else if (canvasMode === 'edit' && draggedVertex) {
      const svg = svgRef.current;
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      const scaleX = 800 / rect.width;
      const scaleY = 600 / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      handleVertexDrag(draggedVertex.id, x, y);
    }
  }, [canvasMode, draggedVertex, handleMouseMoveView, handleVertexDrag]);

  const handleMouseUp = useCallback(() => {
    setDraggedVertex(null);
  }, []);

  const handleSvgClick = useCallback((e: React.MouseEvent) => {
    if (canvasMode !== 'edit' || isViewLocked) return;
    if (e.target !== e.currentTarget) return; // Only if clicking on SVG background
    
    const svg = svgRef.current;
    if (!svg) return;
    
    const rect = svg.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 600 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    handleAddVertex(x, y);
  }, [canvasMode, isViewLocked, handleAddVertex]);

  const handleVertexDoubleClick = useCallback((vertex: Vertex) => {
    handleDeleteVertex(vertex.id);
  }, [handleDeleteVertex]);

  // Get vertex color
  const getVertexColor = useCallback((vertexId: string) => {
    const colorIndex = coloringResult?.get(vertexId) ?? -1;
    return colorIndex >= 0 ? getColorFromIndex(colorIndex) : '#e2e8f0';
  }, [coloringResult]);

  // Cursor helper
  const getCursor = () => {
    if (canvasMode === 'view') {
      return draggedVertex ? 'grabbing' : 'grab';
    }
    if (canvasMode === 'connect') return 'pointer';
    if (canvasMode === 'edit') return draggedVertex ? 'grabbing' : 'crosshair';
    return 'default';
  };

  // Mode change handler
  const handleModeChange = (mode: CanvasMode) => {
    setCanvasMode(mode);
    if (mode === 'view') {
      setIsViewLocked(true);
    } else {
      setIsViewLocked(false);
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleViewLock = () => {
    setIsViewLocked(!isViewLocked);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] bg-gray-50 rounded-lg border-2 border-gray-200"
      style={{ minHeight: '400px' }}
    >
      <svg 
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        className="rounded-lg bg-white"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleSvgClick}
        onWheel={handleWheel}
        style={{ 
          display: 'block',
          cursor: getCursor()
        }}
      >
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {/* Draw edges */}
          {graph.edges.map(edge => {
            const source = graph.vertices.find(v => v.id === edge.source);
            const target = graph.vertices.find(v => v.id === edge.target);
            
            if (!source || !target) return null;
            
            return (
              <line
                key={`${edge.source}-${edge.target}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="#94a3b8"
                strokeWidth={2}
                strokeLinecap="round"
              />
            );
          })}

          {/* Draw vertices */}
          {graph.vertices.map(vertex => (
            <g key={vertex.id}>
              <circle
                cx={vertex.x}
                cy={vertex.y}
                r={20}
                fill={getVertexColor(vertex.id)}
                stroke={selectedVertices.has(vertex.id) ? '#3b82f6' : '#1f2937'}
                strokeWidth={selectedVertices.has(vertex.id) ? 3 : 2}
                style={{
                  cursor: isViewLocked ? 'default' : 
                          canvasMode === 'connect' ? 'pointer' : 'move',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
                onMouseDown={() => handleMouseDown(vertex)}
                onClick={() => handleVertexClick(vertex.id)}
                onDoubleClick={() => handleVertexDoubleClick(vertex)}
              />
              <text
                x={vertex.x}
                y={vertex.y}
                textAnchor="middle"
                dy="0.35em"
                fontSize="12"
                fontWeight="bold"
                fill="#1f2937"
                pointerEvents="none"
              >
                {vertex.label || vertex.id}
              </text>
            </g>
          ))}
        </g>
      </svg>
      
      {/* Mode Instructions */}
      <div className={`absolute top-2 left-2 px-3 py-2 rounded-lg text-sm shadow-lg ${
        canvasMode === 'view' 
          ? 'bg-purple-500 text-white' 
          : canvasMode === 'connect'
          ? 'bg-green-500 text-white'
          : 'bg-blue-500 text-white'
      }`}>
        {canvasMode === 'view' ? (
          <div>
            <div className="font-semibold">👁️ View Mode {isViewLocked && '🔒'}</div>
            <div className="text-xs mt-1">Drag to pan • Scroll to zoom</div>
          </div>
        ) : canvasMode === 'connect' ? (
          <div>
            <div className="font-semibold">🔗 Connect Mode</div>
            <div className="text-xs mt-1">Click vertices to create edges</div>
          </div>
        ) : (
          <div>
            <div className="font-semibold">✏️ Edit Mode</div>
            <div className="text-xs mt-1">Click to add • Double-click to delete • Drag to move</div>
          </div>
        )}
      </div>

      {/* Selection Instructions */}
      {canvasMode === 'connect' && selectedVertices.size > 0 && (
        <div className="absolute top-20 left-2 bg-green-500 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
          {selectedVertices.size === 1 ? 
            'Click another vertex to connect' : 
            'Edge created! Select more vertices to continue'}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        {/* Mode Selection Buttons */}
        <div className="flex gap-2 bg-white p-2 rounded-lg shadow-md">
          <button
            onClick={() => handleModeChange('edit')}
            className={`px-4 py-2 rounded shadow-md transition-colors text-sm flex items-center gap-2 ${
              canvasMode === 'edit' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>✏️</span>
            <span>Edit</span>
          </button>

          <button
            onClick={() => handleModeChange('connect')}
            className={`px-4 py-2 rounded shadow-md transition-colors text-sm flex items-center gap-2 ${
              canvasMode === 'connect' 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>🔗</span>
            <span>Connect</span>
          </button>

          <button
            onClick={() => handleModeChange('view')}
            className={`px-4 py-2 rounded shadow-md transition-colors text-sm flex items-center gap-2 ${
              canvasMode === 'view' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>👁️</span>
            <span>View</span>
          </button>
        </div>

        {/* View Controls */}
        <div className="flex gap-2 bg-white p-2 rounded-lg shadow-md">
          <button
            onClick={toggleViewLock}
            className={`px-4 py-2 rounded shadow-md transition-colors text-sm flex items-center gap-2 ${
              isViewLocked 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            <span>{isViewLocked ? '🔓' : '🔒'}</span>
            <span>{isViewLocked ? 'Unlock' : 'Lock'}</span>
          </button>

          {canvasMode === 'view' && (
            <>
              <button
                onClick={handleZoomIn}
                className="bg-gray-500 text-white px-3 py-2 rounded shadow-md hover:bg-gray-600 transition-colors text-sm"
              >
                <span>➕</span>
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-gray-500 text-white px-3 py-2 rounded shadow-md hover:bg-gray-600 transition-colors text-sm"
              >
                <span>➖</span>
              </button>
            </>
          )}
          
          <button
            onClick={resetView}
            className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
          >
            <span>🗑️</span>
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};