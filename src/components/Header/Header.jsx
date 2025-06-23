import React, { useState, useEffect } from 'react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false)

  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const closeFileMenu = () => setIsFileMenuOpen(false)
  
  const handleDesktopExport = () => {
    onExport()
    closeFileMenu()
  }

  const handleDesktopImport = () => {
    handleImportClick()
    closeFileMenu()
  }

  const handleDesktopSVG = () => {
    onExportSVG()
    closeFileMenu()
  }


  const handleMobileExport = () => {
    onExport()
    closeMobileMenu()
  }

  const handleMobileImport = () => {
    handleImportClick()
    closeMobileMenu()
  }

  const handleMobileSVG = () => {
    onExportSVG()
    closeMobileMenu()
  }

  const handleMobileHelp = () => {
    setIsHelpOpen(true)
    closeMobileMenu()
  }
  
  const handleResetFloor = () => {
    if (window.confirm(`Floor ${currentFloor}のすべてのデータを削除しますか？この操作は元に戻せません。`)) {
      onResetFloor()
    }
  }

  const handleMapNameEdit = (mapId) => {
    setEditingMapId(mapId)
    setEditingMapName(mapNames[mapId] || `Dungeon ${mapId}`)
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
      <div className="flex md:items-center md:space-x-4 gap-2 md:gap-0 justify-between md:justify-start">
        <h1 className="text-lg font-bold md:mb-0 mb-1">DMapper</h1>
        
        <div className="flex items-center space-x-2 md:flex-row">
          <select
            value={currentMap}
            onChange={(e) => setCurrentMap(parseInt(e.target.value))}
            className="bg-gray-600 text-white px-2 py-1.5 rounded text-sm h-8"
          >
            {Array.from({ length: MAX_MAPS }, (_, i) => i + 1).map(mapId => (
              <option key={mapId} value={mapId}>
                {mapNames[mapId] || `Dungeon ${mapId}`}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleMapNameEdit(currentMap)}
            className="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1.5 rounded text-sm h-8 w-8 flex items-center justify-center"
            title="Rename Current Map"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 2L14 4.5L5 13.5H2.5V11L11.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 3.5L12.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm md:inline hidden">Floor:</span>
          <select
            value={currentFloor}
            onChange={(e) => setCurrentFloor(parseInt(e.target.value))}
            className="bg-gray-600 text-white px-2 py-1.5 rounded text-sm h-8"
          >
            {Array.from({ length: MAX_FLOORS }, (_, i) => i + 1).map(floor => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>
          <button
            onClick={handleResetFloor}
            className="bg-red-500 hover:bg-red-400 text-white px-2 py-1.5 rounded text-sm h-8 w-8 flex items-center justify-center"
            title={`Reset Floor ${currentFloor}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 13V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M15 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M3 8H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12.95 3.05L11.54 4.46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4.46 11.54L3.05 12.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12.95 12.95L11.54 11.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4.46 4.46L3.05 3.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
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
            className="bg-gray-600 text-white px-2 py-1 rounded text-sm w-12"
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
            className="bg-gray-600 text-white px-2 py-1 rounded text-sm w-12"
            min="5"
            max="50"
            title="Grid Size (5-50)"
          />
        </div>

        <button
          onClick={onToggleNoteTooltips}
          className={`px-2 py-1 rounded text-sm w-8 h-8 transition-colors md:inline-flex hidden items-center justify-center ${
            showNoteTooltips 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-gray-600 hover:bg-gray-500 text-white'
          }`}
          title={showNoteTooltips ? "Hide Note Tooltips" : "Show Note Tooltips"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M6 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center md:space-x-2 space-x-1 justify-between md:justify-end mt-2 md:mt-0">

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

        <div className="flex items-center space-x-1 md:flex hidden">
          <button
            onClick={() => setIsFileMenuOpen(true)}
            className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-sm"
            title="File Operations"
          >
            File
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onToggleNoteTooltips}
            className={`px-2 py-1.5 rounded text-sm w-8 h-8 transition-colors md:hidden ${
              showNoteTooltips 
                ? 'bg-green-600 hover:bg-green-500 text-white' 
                : 'bg-gray-600 hover:bg-gray-500 text-white'
            }`}
            title={showNoteTooltips ? "Hide Note Tooltips" : "Show Note Tooltips"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.4em'}}>
              <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M6 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="bg-yellow-700 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm w-8 md:block hidden"
            title="ヘルプ"
          >
            ?
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1.5 rounded text-sm w-8 h-8 md:hidden"
            title="メニュー"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
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
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={closeMobileMenu}
        >
          <div 
            className="bg-white rounded-lg p-4 w-64 max-w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-900">メニュー</h3>
            
            <div className="space-y-2">
              <div className="border-b border-gray-200 pb-2 mb-2">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">グリッド設定</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Size:</span>
                  <input
                    type="number"
                    value={gridSize.cols}
                    onChange={(e) => {
                      const size = Math.max(5, Math.min(50, parseInt(e.target.value) || 20))
                      onGridSizeChange({ rows: size, cols: size })
                    }}
                    className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm w-12"
                    min="5"
                    max="50"
                  />
                  <span className="text-sm text-gray-700">x</span>
                  <input
                    type="number"
                    value={gridSize.rows}
                    onChange={(e) => {
                      const size = Math.max(5, Math.min(50, parseInt(e.target.value) || 20))
                      onGridSizeChange({ rows: size, cols: gridSize.cols })
                    }}
                    className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm w-12"
                    min="5"
                    max="50"
                  />
                </div>
              </div>
              
              <button
                onClick={handleMobileExport}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded text-sm text-left"
              >
                Export Map
              </button>
              
              <button
                onClick={handleMobileImport}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded text-sm text-left"
              >
                Import Map
              </button>
              
              <button
                onClick={handleMobileSVG}
                className="w-full bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm text-left"
              >
                Download SVG
              </button>
              
              <button
                onClick={handleMobileHelp}
                className="w-full bg-yellow-700 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm text-left"
              >
                Help
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Menu Modal */}
      {isFileMenuOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={closeFileMenu}
        >
          <div 
            className="bg-white rounded-lg p-4 w-64 max-w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-900">File Operations</h3>
            
            <div className="space-y-2">
              <button
                onClick={handleDesktopExport}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded text-sm text-left"
              >
                Export Map
              </button>
              
              <button
                onClick={handleDesktopImport}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded text-sm text-left"
              >
                Import Map
              </button>
              
              <button
                onClick={handleDesktopSVG}
                className="w-full bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm text-left"
              >
                Download SVG
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