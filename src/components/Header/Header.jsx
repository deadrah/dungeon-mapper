import React, { useState } from 'react'
import { MAX_FLOORS, MAX_MAPS } from '../../utils/constants'
import HelpDialog from '../Dialog/HelpDialog'

const Header = ({ 
  currentMap,
  currentFloor, 
  setCurrentMap,
  setCurrentFloor,
  mapNames,
  setMapName,
  zoom, 
  setZoom,
  onExport,
  onImport,
  onUndo,
  onRedo,
  gridSize,
  onGridSizeChange,
  onResetFloor,
  onExportSVG,
  showNoteTooltips,
  onToggleNoteTooltips,
  activeTool,
  toolName
}) => {
  const [editingMapId, setEditingMapId] = useState(null)
  const [editingMapName, setEditingMapName] = useState('')
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const handleZoomIn = () => setZoom(Math.min(5, zoom * 1.2))
  const handleZoomOut = () => setZoom(Math.max(0.1, zoom * 0.8))
  const handleZoomReset = () => setZoom(1)
  
  const handleResetFloor = () => {
    if (window.confirm(`Floor ${currentFloor}のすべてのデータを削除しますか？この操作は元に戻せません。`)) {
      onResetFloor()
    }
  }

  const handleMapNameEdit = (mapId) => {
    setEditingMapId(mapId)
    setEditingMapName(mapNames[mapId] || `Map ${mapId}`)
  }

  const handleMapNameSave = () => {
    if (editingMapName.trim()) {
      setMapName(editingMapId, editingMapName.trim())
    }
    setEditingMapId(null)
    setEditingMapName('')
  }

  const handleMapNameCancel = () => {
    setEditingMapId(null)
    setEditingMapName('')
  }
  
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
    <div className="md:h-12 h-auto bg-gray-900 text-white md:flex md:items-center md:justify-between px-2 md:px-4 py-2 md:py-0">
      <div className="flex md:items-center md:space-x-4 flex-wrap gap-2 md:gap-0 justify-between md:justify-start">
        <h1 className="text-lg font-bold md:mb-0 mb-1">DMapper</h1>
        
        <div className="flex items-center space-x-2 md:flex-row flex-wrap">
          <span className="text-sm md:inline hidden">Map:</span>
          <select
            value={currentMap}
            onChange={(e) => setCurrentMap(parseInt(e.target.value))}
            className="bg-gray-600 text-white px-2 py-1 rounded text-sm"
          >
            {Array.from({ length: MAX_MAPS }, (_, i) => i + 1).map(mapId => (
              <option key={mapId} value={mapId}>
                {mapNames[mapId] || `Map ${mapId}`}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleMapNameEdit(currentMap)}
            className="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded text-sm"
            title="Rename Current Map"
          >
            <span className="md:inline hidden">Rename</span>
            <span className="md:hidden">✏️</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm md:inline hidden">Floor:</span>
          <select
            value={currentFloor}
            onChange={(e) => setCurrentFloor(parseInt(e.target.value))}
            className="bg-gray-600 text-white px-2 py-1 rounded text-sm"
          >
            {Array.from({ length: MAX_FLOORS }, (_, i) => i + 1).map(floor => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>
          <button
            onClick={handleResetFloor}
            className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded text-sm"
            title={`Reset Floor ${currentFloor}`}
          >
            <span className="md:inline hidden">Reset</span>
            <span className="md:hidden">🗑️</span>
          </button>
        </div>
        
        <div className="md:flex items-center space-x-2 hidden">
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

        <button
          onClick={onToggleNoteTooltips}
          className={`px-2 py-1 rounded text-sm w-16 md:w-16 w-12 transition-colors md:inline hidden ${
            showNoteTooltips 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-gray-600 hover:bg-gray-500 text-white'
          }`}
          title={showNoteTooltips ? "Hide Note Tooltips" : "Show Note Tooltips"}
        >
          Note
        </button>
      </div>

      <div className="flex items-center md:space-x-2 space-x-1 justify-between md:justify-end mt-2 md:mt-0">
        <div className="flex items-center space-x-1 md:block hidden">
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

        {/* スマホでは選択中のツール名を中央表示 */}
        <div className="md:hidden flex-1 text-center">
          <span className="text-sm text-blue-300">{toolName}</span>
        </div>

        <div className="flex items-center space-x-1 md:block hidden">
          <button
            onClick={onExport}
            className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-sm w-16"
            title="Export Map (Ctrl+S)"
          >
            Export
          </button>
          <button
            onClick={handleImportClick}
            className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-sm w-16"
            title="Import Map (Ctrl+L)"
          >
            Import
          </button>
          <button
            onClick={onExportSVG}
            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm w-16"
            title="Download Floor as SVG Image"
          >
            SVG
          </button>
        </div>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="bg-yellow-700 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm w-8"
          title="ヘルプ"
        >
          ?
        </button>
      </div>
      
      {/* Map Rename Dialog */}
      {editingMapId && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h2 className="text-lg font-bold mb-4 text-black">Rename Map</h2>
            
            <input
              type="text"
              value={editingMapName}
              onChange={(e) => setEditingMapName(e.target.value)}
              placeholder="Map name..."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleMapNameSave()
                } else if (e.key === 'Escape') {
                  handleMapNameCancel()
                }
              }}
            />
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleMapNameCancel}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMapNameSave}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Help Dialog */}
      <HelpDialog
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  )
}

export default Header