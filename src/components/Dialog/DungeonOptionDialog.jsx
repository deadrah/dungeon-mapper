import React, { useState, useEffect, useRef } from 'react'
import { MAX_DUNGEONS, MAX_FLOORS_LIMIT, DEFAULT_MAX_FLOORS } from '../../utils/constants'
import { getMessage } from '../../utils/messages'

const DungeonOptionDialog = ({
  isOpen,
  onClose,
  currentDungeon,
  dungeonNames,
  onDungeonChange,
  onDungeonRename,
  gridSize,
  onGridSizeChange,
  maxFloors,
  onMaxFloorsChange,
  onDungeonReset,
  onDungeonExport,
  onDungeonImport,
  theme,
  language = 'ja'
}) => {
  const modalRef = useRef(null)
  const mouseDownInsideRef = useRef(false)
  const [selectedDungeon, setSelectedDungeon] = useState(currentDungeon)
  const [editingName, setEditingName] = useState('')
  const [isRenameMode, setIsRenameMode] = useState(false)
  const [pendingGridSize, setPendingGridSize] = useState({ rows: gridSize.rows, cols: gridSize.cols })
  const [pendingMaxFloors, setPendingMaxFloors] = useState(maxFloors || DEFAULT_MAX_FLOORS)

  // Update selected dungeon when currentDungeon changes
  useEffect(() => {
    setSelectedDungeon(currentDungeon)
  }, [currentDungeon])

  // Update pending grid size when actual grid size changes
  useEffect(() => {
    setPendingGridSize({ rows: gridSize.rows, cols: gridSize.cols })
  }, [gridSize.rows, gridSize.cols])

  // Update pending max floors when actual max floors changes
  useEffect(() => {
    setPendingMaxFloors(maxFloors || DEFAULT_MAX_FLOORS)
  }, [maxFloors])

  // Handle mouse events to prevent modal closing on drag selections
  useEffect(() => {
    if (!isOpen) return

    const handleMouseDown = (e) => {
      if (modalRef.current?.contains(e.target)) {
        mouseDownInsideRef.current = true
      } else {
        mouseDownInsideRef.current = false
      }
    }

    const handleMouseUp = (e) => {
      const clickedOutside = !modalRef.current?.contains(e.target)

      if (clickedOutside && !mouseDownInsideRef.current) {
        onClose()
      }

      mouseDownInsideRef.current = false
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isOpen, onClose])

  const handleRename = () => {
    setEditingName(dungeonNames[selectedDungeon] || `Dungeon ${selectedDungeon}`)
    setIsRenameMode(true)
  }

  const handleRenameSave = () => {
    if (editingName.trim()) {
      onDungeonRename(selectedDungeon, editingName.trim())
    }
    setIsRenameMode(false)
    setEditingName('')
  }

  const handleRenameCancel = () => {
    setIsRenameMode(false)
    setEditingName('')
  }

  const handleGridSizeChange = () => {
    const message = getMessage(language, 'changeGridSize', {
      oldRows: gridSize.rows,
      oldCols: gridSize.cols,
      newRows: pendingGridSize.rows,
      newCols: pendingGridSize.cols
    })
    if (window.confirm(message)) {
      onGridSizeChange(selectedDungeon, pendingGridSize)
    }
  }

  const handleMaxFloorsChange = () => {
    const currentMaxFloors = maxFloors || DEFAULT_MAX_FLOORS
    
    // If increasing floors or no data conflicts, execute directly
    if (pendingMaxFloors > currentMaxFloors) {
      onMaxFloorsChange(selectedDungeon, pendingMaxFloors)
      return
    }
    
    // If reducing floors, check for data conflicts
    onMaxFloorsChange(selectedDungeon, pendingMaxFloors, (floorsToRemove, confirmCallback) => {
      const message = `${getMessage(language, 'floorsWillBeDeleted')}\n\n${getMessage(language, 'affectedFloors')}: ${floorsToRemove.join(', ')}`
      
      if (window.confirm(message)) {
        confirmCallback()
      } else {
        setPendingMaxFloors(maxFloors || DEFAULT_MAX_FLOORS)
      }
    })
  }

  const handleDungeonReset = () => {
    const message = getMessage(language, 'resetDungeon', { dungeonId: selectedDungeon })
    if (window.confirm(message)) {
      onDungeonReset(selectedDungeon)
    }
  }

  const handleDungeonExport = () => {
    onDungeonExport(selectedDungeon)
  }

  const handleDungeonImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        onDungeonImport(file, selectedDungeon)
      }
    }
    input.click()
  }

  const handleClose = () => {
    setIsRenameMode(false)
    setEditingName('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        ref={modalRef}
        className="rounded-lg p-6 w-80 max-w-full mx-4"
        style={{ backgroundColor: theme.ui.panel }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: theme.ui.panelText }}>
          {getMessage(language, 'dungeonOptions')}
        </h2>
        
        {/* Dungeon Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: theme.ui.panelText }}>
            {getMessage(language, 'dungeon')}
          </label>
          <select
            value={selectedDungeon}
            onChange={(e) => {
              const dungeonId = parseInt(e.target.value)
              setSelectedDungeon(dungeonId)
              onDungeonChange(dungeonId)
            }}
            className="w-full px-3 py-2 rounded"
            style={{ 
              backgroundColor: theme.ui.input, 
              color: theme.ui.inputText, 
              border: `1px solid ${theme.ui.border}` 
            }}
          >
            {Array.from({ length: MAX_DUNGEONS }, (_, i) => i + 1).map(dungeonId => (
              <option key={dungeonId} value={dungeonId}>
                {dungeonNames[dungeonId] || `Dungeon ${dungeonId}`}
              </option>
            ))}
          </select>
        </div>

        <hr className="my-4" style={{ borderColor: theme.ui.border }} />

        {/* Rename Section */}
        <div className="mb-4">
          {isRenameMode ? (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.ui.panelText }}>
                {getMessage(language, 'dungeonName')}
              </label>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Dungeon name..."
                className="w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                style={{ 
                  backgroundColor: theme.ui.input, 
                  color: theme.ui.inputText, 
                  border: `1px solid ${theme.ui.border}` 
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameSave()
                  } else if (e.key === 'Escape') {
                    handleRenameCancel()
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRenameCancel}
                  className="px-3 py-1 rounded text-sm transition-colors"
                  style={{ backgroundColor: theme.ui.button, color: theme.ui.panelText }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonHover}
                  onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.button}
                >
                  {getMessage(language, 'cancel')}
                </button>
                <button
                  onClick={handleRenameSave}
                  className="px-3 py-1 rounded text-sm transition-colors"
                  style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                  onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
                >
                  {getMessage(language, 'save')}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleRename}
              className="w-full px-3 py-2 rounded text-sm transition-colors"
              style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
            >
              {getMessage(language, 'dungeonRename')}
            </button>
          )}
        </div>

        <hr className="my-3" style={{ borderColor: theme.ui.border, opacity: 0.5 }} />

        {/* Grid Size Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold" style={{ color: theme.ui.panelText }}>
              {getMessage(language, 'gridSize')}
            </h4>
            <div className="text-xs" style={{ color: theme.ui.panelText, opacity: 0.7 }}>
              {getMessage(language, 'current')}: {gridSize.cols}x{gridSize.rows}
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm" style={{ color: theme.ui.panelText }}>X:</span>
            <input
              type="number"
              value={pendingGridSize.cols}
              onChange={(e) => {
                const cols = Math.max(1, Math.min(50, parseInt(e.target.value) || 20))
                setPendingGridSize(prev => ({ ...prev, cols }))
              }}
              className="px-2 py-1 rounded text-sm w-16"
              style={{ 
                backgroundColor: theme.ui.input, 
                color: theme.ui.inputText, 
                border: `1px solid ${theme.ui.border}` 
              }}
              min="1"
              max="50"
            />
            <span className="text-sm" style={{ color: theme.ui.panelText }}>Y:</span>
            <input
              type="number"
              value={pendingGridSize.rows}
              onChange={(e) => {
                const rows = Math.max(1, Math.min(50, parseInt(e.target.value) || 20))
                setPendingGridSize(prev => ({ ...prev, rows }))
              }}
              className="px-2 py-1 rounded text-sm w-16"
              style={{ 
                backgroundColor: theme.ui.input, 
                color: theme.ui.inputText, 
                border: `1px solid ${theme.ui.border}` 
              }}
              min="1"
              max="50"
            />
          </div>
          {(pendingGridSize.rows !== gridSize.rows || pendingGridSize.cols !== gridSize.cols) && (
            <button
              onClick={handleGridSizeChange}
              className="w-full px-2 py-1 rounded text-sm transition-colors"
              style={{ 
                backgroundColor: theme.ui.resetButton, 
                color: theme.ui.resetButtonText
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.resetButtonHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.resetButton}
            >
              {getMessage(language, 'applyGridSizeChange')}
            </button>
          )}
        </div>

        <hr className="my-3" style={{ borderColor: theme.ui.border, opacity: 0.5 }} />

        {/* Max Floors Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold" style={{ color: theme.ui.panelText }}>
              {getMessage(language, 'maxFloors')}
            </h4>
            <div className="text-xs" style={{ color: theme.ui.panelText, opacity: 0.7 }}>
              {getMessage(language, 'current')}: {maxFloors || DEFAULT_MAX_FLOORS}
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm" style={{ color: theme.ui.panelText }}>
              {getMessage(language, 'floors')}:
            </span>
            <input
              type="number"
              value={pendingMaxFloors}
              onChange={(e) => {
                const floors = Math.max(1, Math.min(MAX_FLOORS_LIMIT, parseInt(e.target.value) || DEFAULT_MAX_FLOORS))
                setPendingMaxFloors(floors)
              }}
              className="px-2 py-1 rounded text-sm w-16"
              style={{ 
                backgroundColor: theme.ui.input, 
                color: theme.ui.inputText, 
                border: `1px solid ${theme.ui.border}` 
              }}
              min="1"
              max={MAX_FLOORS_LIMIT}
            />
            <span className="text-xs" style={{ color: theme.ui.panelText, opacity: 0.7 }}>
              (1-{MAX_FLOORS_LIMIT})
            </span>
          </div>
          {pendingMaxFloors !== (maxFloors || DEFAULT_MAX_FLOORS) && (
            <button
              onClick={handleMaxFloorsChange}
              className="w-full px-2 py-1 rounded text-sm transition-colors"
              style={{ 
                backgroundColor: theme.ui.resetButton, 
                color: theme.ui.resetButtonText
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.resetButtonHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.resetButton}
            >
              {getMessage(language, 'applyMaxFloorsChange')}
            </button>
          )}
        </div>

        <hr className="my-3" style={{ borderColor: theme.ui.border, opacity: 0.5 }} />

        {/* Dungeon Save/Load Section */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2" style={{ color: theme.ui.panelText }}>
            {getMessage(language, 'dungeonSaveLoad')}
          </h4>
          <div className="space-y-2">
            <button
              onClick={handleDungeonExport}
              className="w-full px-3 py-2 rounded text-sm transition-colors"
              style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
            >
              {getMessage(language, 'saveDungeon')}
            </button>
            
            <button
              onClick={handleDungeonImport}
              className="w-full px-3 py-2 rounded text-sm transition-colors"
              style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
            >
              {getMessage(language, 'loadDungeonButton')}
            </button>
          </div>
        </div>

        <hr className="my-3" style={{ borderColor: theme.ui.border, opacity: 0.5 }} />

        {/* Dungeon Reset Section */}
        <div className="mb-4">
          <button
            onClick={handleDungeonReset}
            className="w-full px-3 py-2 rounded text-sm transition-colors"
            style={{ 
              backgroundColor: theme.ui.resetButton, 
              color: theme.ui.resetButtonText
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.resetButtonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.resetButton}
          >
            {getMessage(language, 'dungeonReset')}
          </button>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded transition-colors"
            style={{ backgroundColor: theme.ui.button, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.button}
          >
            {getMessage(language, 'close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DungeonOptionDialog