import React, { useState, useEffect } from 'react'
import { MAX_FLOORS, MAX_DUNGEONS } from '../../utils/constants'
import { getMessage } from '../../utils/messages'

const FloorOptionDialog = ({
  isOpen,
  onClose,
  currentDungeon,
  currentFloor,
  dungeonNames,
  floors,
  allDungeons,
  onFloorChange,
  onFloorRename,
  onFloorReset,
  onExportSVG,
  onOpenCopyFloor,
  theme,
  language = 'ja'
}) => {
  const [selectedFloor, setSelectedFloor] = useState(currentFloor)
  const [editingName, setEditingName] = useState('')
  const [isRenameMode, setIsRenameMode] = useState(false)

  // Update selected floor when currentFloor changes
  useEffect(() => {
    setSelectedFloor(currentFloor)
  }, [currentFloor])

  const getFloorDisplayName = (floorId) => {
    const floorData = floors[floorId]
    const customName = floorData?.name
    return customName || `B${floorId}F`
  }

  const handleRename = () => {
    const currentName = floors[selectedFloor]?.name || ''
    setEditingName(currentName)
    setIsRenameMode(true)
  }

  const handleRenameSave = () => {
    onFloorRename(currentDungeon, selectedFloor, editingName.trim())
    setIsRenameMode(false)
    setEditingName('')
  }

  const handleRenameCancel = () => {
    setIsRenameMode(false)
    setEditingName('')
  }

  const handleFloorReset = () => {
    const floorName = getFloorDisplayName(selectedFloor)
    const message = getMessage(language, 'resetCurrentFloor', { floorName })
    if (window.confirm(message)) {
      onFloorReset()
    }
  }

  const handleExportSVG = () => {
    onExportSVG()
  }

  const handleCopyFloor = () => {
    onOpenCopyFloor(currentDungeon, selectedFloor)
  }

  const handleClose = () => {
    setIsRenameMode(false)
    setEditingName('')
    onClose()
  }

  const handleFloorSelect = (floorId) => {
    setSelectedFloor(floorId)
    onFloorChange(floorId)
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
          {getMessage(language, 'floorOptions')}
        </h2>
        
        {/* Floor Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: theme.ui.panelText }}>
            {getMessage(language, 'floor')}
          </label>
          <select
            value={selectedFloor}
            onChange={(e) => handleFloorSelect(parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded"
            style={{ 
              backgroundColor: theme.ui.input, 
              color: theme.ui.inputText, 
              border: `1px solid ${theme.ui.border}` 
            }}
          >
            {Array.from({ length: MAX_FLOORS }, (_, i) => i + 1).map(floorId => (
              <option key={floorId} value={floorId}>
                {getFloorDisplayName(floorId)}
              </option>
            ))}
          </select>
          <div className="text-xs mt-1" style={{ color: theme.ui.panelText, opacity: 0.7 }}>
            {dungeonNames[currentDungeon] || `Dungeon ${currentDungeon}`}
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: theme.ui.border }} />

        {/* Rename Section */}
        <div className="mb-4">
          {isRenameMode ? (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.ui.panelText }}>
                {getMessage(language, 'floorName')}
              </label>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Floor name (leave empty for default)..."
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
              {getMessage(language, 'floorRename')}
            </button>
          )}
        </div>

        <hr className="my-3" style={{ borderColor: theme.ui.border, opacity: 0.5 }} />

        {/* Copy Floor Section */}
        <div className="mb-4">
          <button
            onClick={handleCopyFloor}
            className="w-full px-3 py-2 rounded text-sm transition-colors"
            style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
          >
            {getMessage(language, 'floorCopy')}
          </button>
        </div>

        <hr className="my-3" style={{ borderColor: theme.ui.border, opacity: 0.5 }} />

        {/* Download SVG Section */}
        <div className="mb-4">
          <button
            onClick={handleExportSVG}
            className="w-full px-3 py-2 rounded text-sm transition-colors"
            style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
          >
            {getMessage(language, 'downloadFloorSvg')}
          </button>
        </div>

        <hr className="my-3" style={{ borderColor: theme.ui.border, opacity: 0.5 }} />

        {/* Floor Reset Section */}
        <div className="mb-4">
          <button
            onClick={handleFloorReset}
            className="w-full px-3 py-2 rounded text-sm transition-colors"
            style={{ 
              backgroundColor: theme.ui.resetButton, 
              color: theme.ui.resetButtonText
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.resetButtonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.resetButton}
          >
            {getMessage(language, 'floorReset')}
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

export default FloorOptionDialog