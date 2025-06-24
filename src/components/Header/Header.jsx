import React, { useState, useEffect } from 'react'
import { MAX_FLOORS, MAX_DUNGEONS } from '../../utils/constants'
import HelpDialog from '../Dialog/HelpDialog'
import { getMessage } from '../../utils/messages'
import { getThemeOptions } from '../../utils/themes'

const Header = ({ 
  currentDungeon,
  currentFloor, 
  setCurrentDungeon,
  setCurrentFloor,
  dungeonNames,
  setDungeonName,
  zoom, 
  setZoom,
  onExport,
  onImport,
  onExportDungeon,
  onImportDungeon,
  onUndo,
  onRedo,
  gridSize,
  onGridSizeChange,
  onResetFloor,
  onExportSVG,
  showNoteTooltips,
  onToggleNoteTooltips,
  language,
  onLanguageChange,
  theme,
  themeName,
  onThemeChange,
  activeTool,
  toolName
}) => {
  const [editingMapId, setEditingMapId] = useState(null)
  const [editingMapName, setEditingMapName] = useState('')
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedDungeonForExport, setSelectedDungeonForExport] = useState(1)

  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const closeMenu = () => setIsMenuOpen(false)
  
  const handleDesktopExport = () => {
    onExport()
    closeMenu()
  }

  const handleDesktopImport = () => {
    handleImportClick()
    closeMenu()
  }

  const handleDesktopSVG = () => {
    onExportSVG()
    closeMenu()
  }

  const handleDesktopDungeonExport = () => {
    onExportDungeon(selectedDungeonForExport)
    closeMenu()
  }

  const handleDesktopDungeonImport = () => {
    handleDungeonImportClick()
    closeMenu()
  }

  const handleDungeonImportClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        onImportDungeon(file, selectedDungeonForExport)
      }
    }
    input.click()
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

  const handleMobileDungeonExport = () => {
    onExportDungeon(selectedDungeonForExport)
    closeMobileMenu()
  }

  const handleMobileDungeonImport = () => {
    handleDungeonImportClick()
    closeMobileMenu()
  }

  const handleMobileHelp = () => {
    setIsHelpOpen(true)
    closeMobileMenu()
  }
  
  const handleResetFloor = () => {
    const message = getMessage(language, 'resetFloor', { floor: currentFloor })
    if (window.confirm(message)) {
      onResetFloor()
    }
  }

  const handleDungeonNameEdit = (dungeonId) => {
    setEditingMapId(dungeonId)
    setEditingMapName(dungeonNames[dungeonId] || `Dungeon ${dungeonId}`)
  }

  const handleDungeonNameSave = () => {
    if (editingMapName.trim()) {
      setDungeonName(editingMapId, editingMapName.trim())
    }
    setEditingMapId(null)
    setEditingMapName('')
  }

  const handleDungeonNameCancel = () => {
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
    <div className="md:h-12 h-auto md:flex md:items-center md:justify-between px-2 md:px-4 py-2 md:py-0" style={{ backgroundColor: theme.ui.panel, color: theme.ui.panelText }}>
      <div className="flex md:items-center md:space-x-4 gap-2 md:gap-0 justify-between md:justify-start">
        <h1 className="text-lg font-bold md:mb-0 mb-1">DMapper</h1>
        
        <div className="flex items-center space-x-2 md:flex-row">
          <select
            value={currentDungeon}
            onChange={(e) => setCurrentDungeon(parseInt(e.target.value))}
            className="px-2 py-1.5 rounded text-sm h-8"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
          >
            {Array.from({ length: MAX_DUNGEONS }, (_, i) => i + 1).map(dungeonId => (
              <option key={dungeonId} value={dungeonId}>
                {dungeonNames[dungeonId] || `Dungeon ${dungeonId}`}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleDungeonNameEdit(currentDungeon)}
            className="px-2 py-1.5 rounded text-sm h-8 w-8 flex items-center justify-center transition-colors"
            style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
            title="Rename Current Dungeon"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
              <path d="M11.5 2L14 4.5L5 13.5H2.5V11L11.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 3.5L12.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={currentFloor}
            onChange={(e) => setCurrentFloor(parseInt(e.target.value))}
            className="px-2 py-1.5 rounded text-sm h-8"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
          >
            {Array.from({ length: MAX_FLOORS }, (_, i) => i + 1).map(floor => (
              <option key={floor} value={floor}>
                {floor}F
              </option>
            ))}
          </select>
          <button
            onClick={handleResetFloor}
            className="px-2 py-1.5 rounded text-sm h-8 w-8 flex items-center justify-center transition-colors"
            style={{ 
              backgroundColor: themeName === 'dungeon' ? '#a0522d' : '#dc2626', 
              color: themeName === 'dungeon' ? '#f0ebe0' : '#ffffff' 
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = themeName === 'dungeon' ? '#8b4513' : '#b91c1c'}
            onMouseLeave={(e) => e.target.style.backgroundColor = themeName === 'dungeon' ? '#a0522d' : '#dc2626'}
            title={`Reset Floor ${currentFloor}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
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
            className="px-2 py-1 rounded text-sm w-12"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
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
            className="px-2 py-1 rounded text-sm w-12"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
            min="5"
            max="50"
            title="Grid Size (5-50)"
          />
        </div>

        <button
          onClick={onToggleNoteTooltips}
          className="px-2 py-1 rounded text-sm w-8 h-8 transition-colors md:inline-flex hidden items-center justify-center"
          style={{
            backgroundColor: showNoteTooltips ? '#16a34a' : theme.ui.button,
            color: theme.ui.panelText
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = showNoteTooltips ? '#15803d' : theme.ui.buttonHover}
          onMouseLeave={(e) => e.target.style.backgroundColor = showNoteTooltips ? '#16a34a' : theme.ui.button}
          title={showNoteTooltips ? "Hide Note Tooltips" : "Show Note Tooltips"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
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
            className="px-2 py-1 rounded text-sm transition-colors"
            style={{ backgroundColor: theme.ui.button, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.button}
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            onClick={onRedo}
            className="px-2 py-1 rounded text-sm transition-colors"
            style={{ backgroundColor: theme.ui.button, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.button}
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>
        </div>

        {/* スマホでは選択中のツール名を中央表示 */}
        <div className="md:hidden flex-1 text-center">
          <span className="text-sm" style={{ color: theme.ui.panelText }}>{toolName}</span>
        </div>

        <div className="flex items-center space-x-1 md:flex hidden">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="px-3 py-1 rounded text-sm transition-colors"
            style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
            title="Menu"
          >
            Menu
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onToggleNoteTooltips}
            className="px-2 py-1.5 rounded text-sm w-8 h-8 transition-colors md:hidden"
            style={{
              backgroundColor: showNoteTooltips ? '#16a34a' : theme.ui.button,
              color: theme.ui.panelText
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = showNoteTooltips ? '#15803d' : theme.ui.buttonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = showNoteTooltips ? '#16a34a' : theme.ui.button}
            title={showNoteTooltips ? "Hide Note Tooltips" : "Show Note Tooltips"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.4em', pointerEvents: 'none'}}>
              <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M6 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="px-2 py-1 rounded text-sm w-8 md:block hidden transition-colors"
            style={{ 
              backgroundColor: themeName === 'dungeon' ? '#cd853f' : '#b45309', 
              color: themeName === 'dungeon' ? '#f0ebe0' : '#ffffff' 
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = themeName === 'dungeon' ? '#b8860b' : '#92400e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = themeName === 'dungeon' ? '#cd853f' : '#b45309'}
            title="ヘルプ"
          >
            ?
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="px-2 py-1.5 rounded text-sm w-8 h-8 md:hidden transition-colors"
            style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
            title="メニュー"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
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
          <div className="rounded-lg p-6 w-96 max-w-full mx-4" style={{ backgroundColor: theme.ui.panel }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: theme.ui.panelText }}>Rename Dungeon</h2>
            
            <input
              type="text"
              value={editingMapName}
              onChange={(e) => setEditingMapName(e.target.value)}
              placeholder="Dungeon name..."
              className="w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: theme.ui.background || '#ffffff', color: theme.ui.text || '#374151', border: `1px solid ${theme.ui.border}` }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleDungeonNameSave()
                } else if (e.key === 'Escape') {
                  handleDungeonNameCancel()
                }
              }}
            />
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleDungeonNameCancel}
                className="px-4 py-2 rounded transition-colors"
                style={{ backgroundColor: theme.ui.button, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.button}
              >
                Cancel
              </button>
              <button
                onClick={handleDungeonNameSave}
                className="px-4 py-2 rounded transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
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
            className="rounded-lg p-4 w-64 max-w-full mx-4"
            style={{ backgroundColor: theme.ui.panel }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.ui.panelText }}>Menu</h3>
            
            <div className="space-y-2">
              {/* Theme Selection */}
              <div className="border-b pb-2 mb-2" style={{ borderColor: theme.ui.border }}>
                <h4 className="text-sm font-semibold mb-2" style={{ color: theme.ui.panelText }}>Theme</h4>
                <select
                  value={themeName}
                  onChange={(e) => onThemeChange(e.target.value)}
                  className="px-2 py-1 rounded text-sm w-full"
                  style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
                >
                  {getThemeOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-b pb-2 mb-2" style={{ borderColor: theme.ui.border }}>
                <h4 className="text-sm font-semibold mb-2" style={{ color: theme.ui.panelText }}>Grid Size</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm" style={{ color: theme.ui.panelText }}>Size:</span>
                  <input
                    type="number"
                    value={gridSize.cols}
                    onChange={(e) => {
                      const size = Math.max(5, Math.min(50, parseInt(e.target.value) || 20))
                      onGridSizeChange({ rows: size, cols: size })
                    }}
                    className="px-2 py-1 rounded text-sm w-12"
                    style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
                    min="5"
                    max="50"
                  />
                  <span className="text-sm" style={{ color: theme.ui.panelText }}>x</span>
                  <input
                    type="number"
                    value={gridSize.rows}
                    onChange={(e) => {
                      const size = Math.max(5, Math.min(50, parseInt(e.target.value) || 20))
                      onGridSizeChange({ rows: size, cols: gridSize.cols })
                    }}
                    className="px-2 py-1 rounded text-sm w-12"
                    style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
                    min="5"
                    max="50"
                  />
                </div>
              </div>
              
              {/* Dungeon selection */}
              <div>
                <span className="text-sm font-semibold" style={{ color: theme.ui.panel === '#1f2937' ? '#60a5fa' : '#daa520' }}>Dungeon Save/Load</span>
                <select
                  value={selectedDungeonForExport}
                  onChange={(e) => setSelectedDungeonForExport(parseInt(e.target.value))}
                  className="px-2 py-1 rounded text-sm w-full mt-1"
                  style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
                >
                  {Array.from({ length: MAX_DUNGEONS }, (_, i) => i + 1).map(dungeonId => (
                    <option key={dungeonId} value={dungeonId}>
                      {dungeonNames[dungeonId] || `Dungeon ${dungeonId}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleMobileDungeonExport}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                Save Dungeon
              </button>
              
              <button
                onClick={handleMobileDungeonImport}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                Load Dungeon
              </button>
              
              {/* HR separator */}
              <hr className="border-gray-200" />

              <button
                onClick={handleMobileSVG}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                Download Floor SVG Image
              </button> 

              {/* HR separator */}
              <hr className="border-gray-200" />
              <div>
                <span className="text-sm font-semibold" style={{ color: theme.ui.panel === '#1f2937' ? '#60a5fa' : '#daa520' }}>All Data Backup</span>
              </div>
              <button
                onClick={handleMobileExport}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                Export All Data
              </button>
              
              <button
                onClick={handleMobileImport}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                Import All Data
              </button>
              
              {/* HR separator */}
              <hr className="border-gray-200" />

              <button
                onClick={handleMobileHelp}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                Help
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Modal */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={closeMenu}
        >
          <div 
            className="rounded-lg p-4 w-64 max-w-full mx-4"
            style={{ backgroundColor: theme.ui.panel }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.ui.panelText }}>Menu</h3>
            
            <div className="space-y-2">
              {/* Theme Selection */}
              <div className="border-b pb-2 mb-2" style={{ borderColor: theme.ui.border }}>
                <h4 className="text-sm font-semibold mb-2" style={{ color: theme.ui.panelText }}>Theme</h4>
                <select
                  value={themeName}
                  onChange={(e) => onThemeChange(e.target.value)}
                  className="px-2 py-1 rounded text-sm w-full"
                  style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
                >
                  {getThemeOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dungeon selection */}
              <div>
                <span className="text-sm font-semibold" style={{ color: theme.ui.panel === '#1f2937' ? '#60a5fa' : '#daa520' }}>Dungeon Save/Load</span>
                <select
                  value={selectedDungeonForExport}
                  onChange={(e) => setSelectedDungeonForExport(parseInt(e.target.value))}
                  className="px-2 py-1 rounded text-sm w-full mt-1"
                  style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
                >
                  {Array.from({ length: MAX_DUNGEONS }, (_, i) => i + 1).map(dungeonId => (
                    <option key={dungeonId} value={dungeonId}>
                      {dungeonNames[dungeonId] || `Dungeon ${dungeonId}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleDesktopDungeonExport}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                Save Dungeon
              </button>
              
              <button
                onClick={handleDesktopDungeonImport}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                Load Dungeon
              </button>
              
              {/* HR separator */}
              <hr className="border-gray-200" />

              <button
                onClick={handleDesktopSVG}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                Download Floor SVG Image
              </button> 

              {/* HR separator */}
              <hr className="border-gray-300" />
              
              <div>
                <span className="text-sm font-semibold" style={{ color: theme.ui.panel === '#1f2937' ? '#60a5fa' : '#daa520' }}>All Data Backup</span>
              </div>
              <button
                onClick={handleDesktopExport}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                Export All Data
              </button>
              
              <button
                onClick={handleDesktopImport}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                Import All Data
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Help Dialog */}
      <HelpDialog
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        language={language}
        onLanguageChange={onLanguageChange}
        theme={theme}
      />
    </div>
  )
}

export default Header