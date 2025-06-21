import React from 'react'

const Header = ({ 
  currentFloor, 
  maxFloors, 
  setCurrentFloor, 
  zoom, 
  setZoom,
  onExport,
  onImport,
  onUndo,
  onRedo,
  gridSize,
  onGridSizeChange
}) => {
  const handleZoomIn = () => setZoom(Math.min(5, zoom * 1.2))
  const handleZoomOut = () => setZoom(Math.max(0.1, zoom * 0.8))
  const handleZoomReset = () => setZoom(1)
  
  const handleImportClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        onImport(file)
      }
    }
    input.click()
  }

  return (
    <div className="h-12 bg-gray-900 text-white flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-bold">DMapper</h1>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">Floor:</span>
          <select
            value={currentFloor}
            onChange={(e) => setCurrentFloor(parseInt(e.target.value))}
            className="bg-gray-600 text-white px-2 py-1 rounded text-sm"
          >
            {Array.from({ length: maxFloors }, (_, i) => i + 1).map(floor => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">Grid:</span>
          <input
            type="number"
            value={gridSize.cols}
            onChange={(e) => {
              const size = Math.max(5, Math.min(50, parseInt(e.target.value) || 20))
              onGridSizeChange({ rows: size, cols: size })
            }}
            className="bg-gray-600 text-white px-2 py-1 rounded text-sm w-16"
            min="5"
            max="50"
            title="Grid Size (5-50)"
          />
          <span className="text-sm">x</span>
          <input
            type="number"
            value={gridSize.rows}
            onChange={(e) => {
              const size = Math.max(5, Math.min(50, parseInt(e.target.value) || 20))
              onGridSizeChange({ rows: size, cols: gridSize.cols })
            }}
            className="bg-gray-600 text-white px-2 py-1 rounded text-sm w-16"
            min="5"
            max="50"
            title="Grid Size (5-50)"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <button
            onClick={handleZoomOut}
            className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-sm"
            title="Zoom Out"
          >
            -
          </button>
          <span className="text-sm w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-sm"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomReset}
            className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-sm"
            title="Reset Zoom (100%)"
          >
            ⌂
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-sm"
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            onClick={onRedo}
            className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-sm"
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onExport}
            className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-sm"
            title="Export Map (Ctrl+S)"
          >
            Export
          </button>
          <button
            onClick={handleImportClick}
            className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded text-sm"
            title="Import Map (Ctrl+L)"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header