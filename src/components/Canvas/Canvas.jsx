import React, { useState, useRef, useEffect, useCallback } from 'react'
import Grid from './Grid'
import Items from './Items'
import Walls from './Walls'
import Doors from './Doors'
import { GRID_SIZE, MIN_ZOOM, MAX_ZOOM, TOOLS } from '../../utils/constants'

const Canvas = ({ 
  appState, 
  setZoom, 
  updateCurrentFloorData,
  getCurrentFloorData 
}) => {
  const canvasRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [isDraggingLine, setIsDraggingLine] = useState(false)
  const [dragLineType, setDragLineType] = useState(null) // 'horizontal' or 'vertical'
  const [isDraggingErase, setIsDraggingErase] = useState(false)
  const [dragStartRow, setDragStartRow] = useState(null)
  const [dragStartCol, setDragStartCol] = useState(null)
  const [dragStartMousePos, setDragStartMousePos] = useState(null)
  const [dragDirectionDetected, setDragDirectionDetected] = useState(false)

  const floorData = getCurrentFloorData()

  useEffect(() => {
    const updateViewportSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setViewportSize({ width: rect.width, height: rect.height })
      }
    }

    updateViewportSize()
    window.addEventListener('resize', updateViewportSize)
    return () => window.removeEventListener('resize', updateViewportSize)
  }, [])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, appState.zoom * delta))
    setZoom(newZoom)
  }, [appState.zoom, setZoom])

  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || e.shiftKey) { // Middle mouse or Shift+click for panning
      setIsPanning(true)
      setLastMousePos({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    }
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      const deltaX = e.clientX - lastMousePos.x
      const deltaY = e.clientY - lastMousePos.y
      
      setOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      
      setLastMousePos({ x: e.clientX, y: e.clientY })
    }
  }, [isPanning, lastMousePos])

  const handleLineEnter = useCallback((row, col, isVertical) => {
    if (!isDraggingLine && !isDraggingErase) return;
    
    // Skip if dragging different line type
    const currentLineType = isVertical ? 'vertical' : 'horizontal';
    if (dragLineType !== currentLineType) return;
    
    // For line tool, we allow one extra row/col for boundaries
    if (isVertical) {
      if (row < 0 || row >= appState.gridSize.rows || col < 0 || col > appState.gridSize.cols) {
        return;
      }
    } else {
      if (row < 0 || row > appState.gridSize.rows || col < 0 || col >= appState.gridSize.cols) {
        return;
      }
    }
    
    const actualRow = appState.gridSize.rows - 1 - row;
    
    if (isDraggingErase) {
      // Remove wall at this position
      const newWalls = floorData.walls.filter(wall => 
        !(wall.startRow === actualRow && wall.startCol === col &&
          ((isVertical && wall.endRow !== wall.startRow) || (!isVertical && wall.endCol !== wall.startCol)))
      )
      updateCurrentFloorData('walls', newWalls)
    } else if (isDraggingLine) {
      const existingWallIndex = floorData.walls.findIndex(wall => 
        wall.startRow === actualRow && wall.startCol === col &&
        ((isVertical && wall.endRow !== wall.startRow) || (!isVertical && wall.endCol !== wall.startCol))
      )
      
      if (existingWallIndex === -1) {
        // Add new wall/line
        const newWall = isVertical ? {
          startRow: actualRow,
          startCol: col,
          endRow: actualRow + 1, // Vertical line
          endCol: col,
          id: Date.now() + Math.random()
        } : {
          startRow: actualRow,
          startCol: col,
          endRow: actualRow,
          endCol: col + 1, // Horizontal line
          id: Date.now() + Math.random()
        }
        const newWalls = [...floorData.walls, newWall]
        updateCurrentFloorData('walls', newWalls)
      }
    }
  }, [isDraggingLine, isDraggingErase, dragLineType, appState.gridSize.rows, appState.gridSize.cols, floorData.walls, updateCurrentFloorData])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
    setIsDraggingLine(false)
    setIsDraggingErase(false)
    setDragLineType(null)
    setDragStartRow(null)
    setDragStartCol(null)
    setDragStartMousePos(null)
    setDragDirectionDetected(false)
  }, [])

  const handleLineClick = useCallback((row, col, isVertical, event = null) => {
    // For line tool, we allow one extra row/col for boundaries
    if (isVertical) {
      if (row < 0 || row >= appState.gridSize.rows || col < 0 || col > appState.gridSize.cols) {
        return;
      }
    } else {
      if (row < 0 || row > appState.gridSize.rows || col < 0 || col >= appState.gridSize.cols) {
        return;
      }
    }
    
    const actualRow = appState.gridSize.rows - 1 - row;
    
    const existingWallIndex = floorData.walls.findIndex(wall => 
      wall.startRow === actualRow && wall.startCol === col &&
      ((isVertical && wall.endRow !== wall.startRow) || (!isVertical && wall.endCol !== wall.startCol))
    )
    
    if (appState.activeTool === 'line') {
      if (existingWallIndex === -1) {
        // Add immediate wall for single click
        const newWall = isVertical ? {
          startRow: actualRow,
          startCol: col,
          endRow: actualRow + 1, // Vertical line
          endCol: col,
          id: Date.now() + Math.random()
        } : {
          startRow: actualRow,
          startCol: col,
          endRow: actualRow,
          endCol: col + 1, // Horizontal line
          id: Date.now() + Math.random()
        }
        const newWalls = [...floorData.walls, newWall]
        updateCurrentFloorData('walls', newWalls)
        
        // Start dragging mode - wait for mouse movement to determine direction for additional lines
        setIsDraggingLine(true)
        setDragLineType(null) // Will be determined by mouse movement
        setDragStartRow(row)
        setDragStartCol(col)
        setDragDirectionDetected(false)
        
        // Store initial mouse position for direction detection
        if (event) {
          const rect = event.target.closest('svg').getBoundingClientRect()
          setDragStartMousePos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          })
        }
      }
    } else {
      // For Door and Arrow tools, place on existing walls only
      if (existingWallIndex !== -1) {
        // Found existing wall, place door/arrow on it
        const existingWall = floorData.walls[existingWallIndex]
        
        // Check if there's already a door on this wall
        const existingDoorIndex = floorData.doors?.findIndex(door => 
          door.startRow === actualRow && door.startCol === col
        ) ?? -1
        
        if (existingDoorIndex === -1) {
          // Add new door on the wall
          const newDoor = {
            type: appState.activeTool,
            startRow: actualRow,
            startCol: col,
            endRow: existingWall.endRow,
            endCol: existingWall.endCol,
            id: Date.now() + Math.random()
          }
          const newDoors = [...(floorData.doors || []), newDoor]
          updateCurrentFloorData('doors', newDoors)
        }
      }
    }
  }, [appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, floorData.walls, floorData.doors, updateCurrentFloorData])

  const handleLineRightClick = useCallback((row, col, isVertical, event = null) => {
    // For line tool, we allow one extra row/col for boundaries
    if (isVertical) {
      if (row < 0 || row >= appState.gridSize.rows || col < 0 || col > appState.gridSize.cols) {
        return;
      }
    } else {
      if (row < 0 || row > appState.gridSize.rows || col < 0 || col >= appState.gridSize.cols) {
        return;
      }
    }
    
    const actualRow = appState.gridSize.rows - 1 - row;
    
    // Start erase dragging mode - wait for mouse movement to determine direction
    setIsDraggingErase(true)
    setDragLineType(null) // Will be determined by mouse movement
    setDragStartRow(row)
    setDragStartCol(col)
    setDragDirectionDetected(false)
    
    // Store initial mouse position for direction detection
    if (event) {
      const rect = event.target.closest('svg').getBoundingClientRect()
      setDragStartMousePos({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      })
    }
    
    // Remove wall at this position
    const newWalls = floorData.walls.filter(wall => 
      !(wall.startRow === actualRow && wall.startCol === col &&
        ((isVertical && wall.endRow !== wall.startRow) || (!isVertical && wall.endCol !== wall.startCol)))
    )
    updateCurrentFloorData('walls', newWalls)
  }, [appState.gridSize.rows, appState.gridSize.cols, floorData.walls, updateCurrentFloorData])

  const handleGridClick = useCallback((row, col, event = null) => {
    // Ensure coordinates are within bounds
    if (row < 0 || row >= appState.gridSize.rows || col < 0 || col >= appState.gridSize.cols) {
      return;
    }
    
    const actualRow = appState.gridSize.rows - 1 - row;
    
    if (appState.activeTool === 'block_color') {
      const newGrid = [...floorData.grid]
      if (newGrid[actualRow] && actualRow >= 0 && actualRow < appState.gridSize.rows) {
        newGrid[actualRow] = [...newGrid[actualRow]]
        newGrid[actualRow][col] = selectedColor
        updateCurrentFloorData('grid', newGrid)
      }
    } else if (appState.activeTool === 'door_open' || appState.activeTool === 'door_closed' || 
               appState.activeTool === 'line_arrow_north' || appState.activeTool === 'line_arrow_south' ||
               appState.activeTool === 'line_arrow_east' || appState.activeTool === 'line_arrow_west') {
      // Door tool - place doors on existing walls
      const existingWall = floorData.walls.find(wall => 
        wall.startRow === actualRow && wall.startCol === col &&
        ((wall.startCol === wall.endCol) || (wall.startRow === wall.endRow))
      )
      
      if (existingWall) {
        // Check if there's already a door on this wall
        const existingDoorIndex = floorData.doors?.findIndex(door => 
          door.startRow === actualRow && door.startCol === col
        ) ?? -1
        
        if (existingDoorIndex === -1) {
          // Add new door on the wall
          const newDoor = {
            type: appState.activeTool,
            startRow: actualRow,
            startCol: col,
            endRow: existingWall.endRow,
            endCol: existingWall.endCol,
            id: Date.now() + Math.random()
          }
          const newDoors = [...(floorData.doors || []), newDoor]
          updateCurrentFloorData('doors', newDoors)
        }
      }
    } else if (Object.values(TOOLS).includes(appState.activeTool)) {
      // Check if there's already an item at this position
      const existingItemIndex = floorData.items.findIndex(item => item.row === actualRow && item.col === col)
      
      if (existingItemIndex === -1) {
        // Add new item
        const newItem = {
          type: appState.activeTool,
          row: actualRow,
          col,
          id: Date.now() + Math.random()
        }
        const newItems = [...floorData.items, newItem]
        updateCurrentFloorData('items', newItems)
      }
    }
  }, [appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, floorData.grid, floorData.items, floorData.walls, floorData.doors, selectedColor, updateCurrentFloorData])

  const handleGridRightClick = useCallback((row, col) => {
    // Ensure coordinates are within bounds
    if (row < 0 || row >= appState.gridSize.rows || col < 0 || col >= appState.gridSize.cols) {
      return;
    }
    
    const actualRow = appState.gridSize.rows - 1 - row;
    
    if (appState.activeTool === 'block_color') {
      const newGrid = [...floorData.grid]
      if (newGrid[actualRow] && actualRow >= 0 && actualRow < appState.gridSize.rows) {
        newGrid[actualRow] = [...newGrid[actualRow]]
        newGrid[actualRow][col] = null
        updateCurrentFloorData('grid', newGrid)
      }
    } else if (appState.activeTool === 'door_open' || appState.activeTool === 'door_closed' || 
               appState.activeTool === 'line_arrow_north' || appState.activeTool === 'line_arrow_south' ||
               appState.activeTool === 'line_arrow_east' || appState.activeTool === 'line_arrow_west') {
      // Remove door at this position
      const newDoors = (floorData.doors || []).filter(door => !(door.startRow === actualRow && door.startCol === col))
      updateCurrentFloorData('doors', newDoors)
    } else {
      // Remove item at this position
      const newItems = floorData.items.filter(item => !(item.row === actualRow && item.col === col))
      updateCurrentFloorData('items', newItems)
    }
  }, [appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, floorData.grid, floorData.items, floorData.walls, floorData.doors, updateCurrentFloorData])

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if ((isDraggingLine || isDraggingErase) && canvasRef.current) {
        // Handle line dragging with mouse coordinates
        const rect = canvasRef.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        
        // Direction detection - only if not yet detected
        if (!dragDirectionDetected && dragStartMousePos) {
          const deltaX = Math.abs(mouseX - dragStartMousePos.x)
          const deltaY = Math.abs(mouseY - dragStartMousePos.y)
          const threshold = 5 // Minimum movement to detect direction
          
          if (deltaX > threshold || deltaY > threshold) {
            const detectedType = deltaX > deltaY ? 'horizontal' : 'vertical'
            setDragLineType(detectedType)
            setDragDirectionDetected(true)
            
            // No need to add initial wall here since it was already added in handleLineClick
            // Direction detection is just for continuing the drag in the detected direction
          }
        }
        
        // Continue with normal dragging logic if direction is detected
        if (dragDirectionDetected && dragLineType) {
          const cellSize = 40 * appState.zoom // GRID_SIZE * zoom
          const col = Math.floor((mouseX - offset.x - 24) / cellSize)
          const row = Math.floor((mouseY - offset.y - 24) / cellSize)
          
          if (dragLineType === 'horizontal') {
            // For horizontal lines, only allow same row as drag start
            const lineY = Math.round((mouseY - offset.y - 24) / cellSize)
            if (lineY === dragStartRow && lineY >= 0 && lineY <= appState.gridSize.rows && col >= 0 && col < appState.gridSize.cols) {
              handleLineEnter(lineY, col, false)
            }
          } else if (dragLineType === 'vertical') {
            // For vertical lines, only allow same column as drag start
            const lineX = Math.round((mouseX - offset.x - 24) / cellSize)
            if (lineX === dragStartCol && row >= 0 && row < appState.gridSize.rows && lineX >= 0 && lineX <= appState.gridSize.cols) {
              handleLineEnter(row, lineX, true)
            }
          }
        }
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp, isDraggingLine, isDraggingErase, dragLineType, dragStartRow, dragStartCol, dragStartMousePos, dragDirectionDetected, offset, appState.zoom, appState.gridSize, handleLineEnter, floorData.walls, updateCurrentFloorData])

  return (
    <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: '#f8f8f8' }}>
      <div
        ref={canvasRef}
        className="w-full h-full"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Grid
          gridSize={appState.gridSize}
          zoom={appState.zoom}
          offset={offset}
          viewportSize={viewportSize}
          floorData={floorData}
          onGridClick={handleGridClick}
          onGridRightClick={handleGridRightClick}
          onLineClick={handleLineClick}
          onLineRightClick={handleLineRightClick}
          onLineEnter={handleLineEnter}
          activeTool={appState.activeTool}
          isDraggingLine={isDraggingLine}
          dragLineType={dragLineType}
          dragStartRow={dragStartRow}
          dragStartCol={dragStartCol}
        />
        
        <Walls
          walls={floorData.walls}
          zoom={appState.zoom}
          offset={offset}
          gridSize={appState.gridSize}
        />
        
        <Items
          items={floorData.items}
          zoom={appState.zoom}
          offset={offset}
          gridSize={appState.gridSize}
          onUpdateItem={(index, updatedItem) => {
            const newItems = [...floorData.items]
            newItems[index] = updatedItem
            updateCurrentFloorData('items', newItems)
          }}
        />
        
        <Doors
          doors={floorData.doors || []}
          zoom={appState.zoom}
          offset={offset}
          gridSize={appState.gridSize}
        />

      </div>
      
      {/* Color picker for block color tool */}
      {appState.activeTool === 'block_color' && (
        <div className="absolute top-4 right-4 bg-white p-2 rounded shadow-lg">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-8 h-8 rounded border"
          />
        </div>
      )}
      
      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
        {Math.round(appState.zoom * 100)}%
      </div>
    </div>
  )
}

export default Canvas