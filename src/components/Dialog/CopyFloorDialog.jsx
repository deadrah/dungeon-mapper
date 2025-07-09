import React, { useState, useEffect, useRef } from 'react'
import { MAX_FLOORS, MAX_DUNGEONS, DEFAULT_MAX_FLOORS } from '../../utils/constants'
import { getMessage } from '../../utils/messages'

const CopyFloorDialog = ({
  isOpen,
  onClose,
  sourceDungeon,
  sourceFloor,
  dungeonNames,
  allDungeons,
  onFloorCopy,
  theme,
  language = 'ja'
}) => {
  const modalRef = useRef(null)
  const mouseDownInsideRef = useRef(false)
  const [copyTargetDungeon, setCopyTargetDungeon] = useState(1)
  const [copyTargetFloor, setCopyTargetFloor] = useState(1)

  // Reset target selections when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCopyTargetDungeon(1)
      setCopyTargetFloor(1)
    }
  }, [isOpen])

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

  const getSourceFloorDisplayName = () => {
    const floorData = allDungeons[sourceDungeon]?.floors[sourceFloor]
    const customName = floorData?.name
    const baseName = customName || `B${sourceFloor}F`
    
    // Check if floor has any data
    const hasData = floorData && (
      (floorData.grid && floorData.grid.some(row => row.some(cell => cell !== null))) ||
      (floorData.walls && floorData.walls.length > 0) ||
      (floorData.items && floorData.items.length > 0) ||
      (floorData.doors && floorData.doors.length > 0) ||
      (floorData.notes && floorData.notes.length > 0)
    )
    
    return hasData ? `*${baseName}` : baseName
  }

  const getTargetFloorDisplayName = (floorId) => {
    const targetFloorData = allDungeons[copyTargetDungeon]?.floors[floorId]
    const customName = targetFloorData?.name
    const baseName = customName || `B${floorId}F`
    
    // Check if floor has any data
    const hasData = targetFloorData && (
      (targetFloorData.grid && targetFloorData.grid.some(row => row.some(cell => cell !== null))) ||
      (targetFloorData.walls && targetFloorData.walls.length > 0) ||
      (targetFloorData.items && targetFloorData.items.length > 0) ||
      (targetFloorData.doors && targetFloorData.doors.length > 0) ||
      (targetFloorData.notes && targetFloorData.notes.length > 0)
    )
    
    return hasData ? `*${baseName}` : baseName
  }

  const handleCopyConfirm = () => {
    const sourceFloorName = getSourceFloorDisplayName()
    const targetFloorName = getTargetFloorDisplayName(copyTargetFloor)
    const targetDungeonName = dungeonNames[copyTargetDungeon] || `Dungeon ${copyTargetDungeon}`
    
    // Check for grid size differences
    const sourceGridSize = allDungeons[sourceDungeon]?.gridSize || { rows: 20, cols: 20 }
    const targetGridSize = allDungeons[copyTargetDungeon]?.gridSize || { rows: 20, cols: 20 }
    const hasGridSizeDifference = sourceGridSize.rows !== targetGridSize.rows || sourceGridSize.cols !== targetGridSize.cols
    
    let confirmMessage = getMessage(language, 'copyFloorConfirm', {
      sourceFloor: sourceFloorName,
      targetDungeon: targetDungeonName,
      targetFloor: targetFloorName
    })
    
    if (hasGridSizeDifference) {
      confirmMessage += getMessage(language, 'copyFloorGridSizeWarning', {
        sourceCols: sourceGridSize.cols,
        sourceRows: sourceGridSize.rows,
        targetCols: targetGridSize.cols,
        targetRows: targetGridSize.rows
      })
    }
    
    if (window.confirm(confirmMessage)) {
      onFloorCopy(sourceDungeon, sourceFloor, copyTargetDungeon, copyTargetFloor)
      onClose()
    }
  }

  const handleClose = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 60 }}
    >
      <div 
        ref={modalRef}
        className="rounded-lg p-6 w-80 max-w-full mx-4"
        style={{ backgroundColor: theme.ui.panel }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: theme.ui.panelText }}>
          {getMessage(language, 'copyFloorTitle')}
        </h2>
        
        {/* Source Floor Display */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: theme.ui.panelText }}>
            {getMessage(language, 'copySource')}
          </label>
          <div 
            className="w-full px-3 py-2 rounded bg-gray-100 text-sm"
            style={{ 
              backgroundColor: theme.ui.input, 
              color: theme.ui.inputText, 
              border: `1px solid ${theme.ui.border}`,
              opacity: 0.7
            }}
          >
            {dungeonNames[sourceDungeon] || `Dungeon ${sourceDungeon}`} - {getSourceFloorDisplayName()}
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: theme.ui.border }} />

        {/* Target Dungeon Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: theme.ui.panelText }}>
            {getMessage(language, 'copyTargetDungeon')}
          </label>
          <select
            value={copyTargetDungeon}
            onChange={(e) => setCopyTargetDungeon(parseInt(e.target.value))}
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
        
        {/* Target Floor Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: theme.ui.panelText }}>
            {getMessage(language, 'copyTargetFloor')}
          </label>
          <select
            value={copyTargetFloor}
            onChange={(e) => setCopyTargetFloor(parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded"
            style={{ 
              backgroundColor: theme.ui.input, 
              color: theme.ui.inputText, 
              border: `1px solid ${theme.ui.border}` 
            }}
          >
            {Array.from({ length: allDungeons[copyTargetDungeon]?.maxFloors || DEFAULT_MAX_FLOORS }, (_, i) => i + 1).map(floorId => (
              <option key={floorId} value={floorId}>
                {getTargetFloorDisplayName(floorId)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded text-sm transition-colors"
            style={{ backgroundColor: theme.ui.button, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.button}
          >
            {getMessage(language, 'cancel')}
          </button>
          <button
            onClick={handleCopyConfirm}
            className="px-4 py-2 rounded text-sm transition-colors"
            style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
          >
            {getMessage(language, 'copyExecute')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CopyFloorDialog