import React, { useState, useEffect } from 'react'
import { MAX_DUNGEONS } from '../../utils/constants'
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
  onDungeonReset,
  onDungeonExport,
  onDungeonImport,
  theme,
  language = 'ja'
}) => {
  const [selectedDungeon, setSelectedDungeon] = useState(currentDungeon)
  const [editingName, setEditingName] = useState('')
  const [isRenameMode, setIsRenameMode] = useState(false)
  const [pendingGridSize, setPendingGridSize] = useState({ rows: gridSize.rows, cols: gridSize.cols })

  // Update selected dungeon when currentDungeon changes
  useEffect(() => {
    setSelectedDungeon(currentDungeon)
  }, [currentDungeon])

  // Update pending grid size when actual grid size changes
  useEffect(() => {
    setPendingGridSize({ rows: gridSize.rows, cols: gridSize.cols })
  }, [gridSize.rows, gridSize.cols])

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
      onClick={handleClose}
    >
      <div 
        className="rounded-lg p-6 w-80 max-w-full mx-4"
        style={{ backgroundColor: theme.ui.panel }}
        onClick={(e) => e.stopPropagation()}
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
          <h4 className="text-sm font-semibold mb-2" style={{ color: theme.ui.panelText }}>
            {getMessage(language, 'gridSize')}
          </h4>
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
          <div className="text-xs mb-2" style={{ color: theme.ui.panelText, opacity: 0.7 }}>
            {getMessage(language, 'current')}: {gridSize.cols}x{gridSize.rows}
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