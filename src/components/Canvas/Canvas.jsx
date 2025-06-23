import React, { useState, useRef, useEffect, useCallback } from 'react'
import Grid from './Grid'
import Items from './Items'
import Walls from './Walls'
import Doors from './Doors'
import NoteDialog from '../Dialog/NoteDialog'
import { GRID_SIZE, MIN_ZOOM, MAX_ZOOM, TOOLS } from '../../utils/constants'

const Canvas = ({ 
  appState, 
  setZoom, 
  updateCurrentFloorData,
  getCurrentFloorData,
  showNoteTooltips = true
}) => {
  const canvasRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [warpText, setWarpText] = useState('A')
  const [shuteStyle, setShuteStyle] = useState('filled') // 'filled' (●) or 'outline' (○)
  const [arrowDirection, setArrowDirection] = useState('north') // 'north', 'south', 'east', 'west', 'rotate'
  const [isDraggingLine, setIsDraggingLine] = useState(false)
  const [dragLineType, setDragLineType] = useState(null) // 'horizontal' or 'vertical'
  const [isDraggingErase, setIsDraggingErase] = useState(false)
  const [dragStartRow, setDragStartRow] = useState(null)
  const [dragStartCol, setDragStartCol] = useState(null)
  const [dragStartMousePos, setDragStartMousePos] = useState(null)
  const [dragDirectionDetected, setDragDirectionDetected] = useState(false)
  const [isRightMouseDown, setIsRightMouseDown] = useState(false)
  const [noteDialog, setNoteDialog] = useState({ isOpen: false, row: null, col: null, text: '' })
  const [initialPinchDistance, setInitialPinchDistance] = useState(null)
  const [initialZoom, setInitialZoom] = useState(1)
  const [isTwoFingerActive, setIsTwoFingerActive] = useState(false)
  const [isSingleFingerPanning, setIsSingleFingerPanning] = useState(false)
  const [singleTouchStart, setSingleTouchStart] = useState({ x: 0, y: 0, time: 0 })

  const floorData = getCurrentFloorData() || { grid: [], walls: [], items: [], doors: [] }

  // Calculate distance between two touch points
  const getDistance = useCallback((touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.05 : 0.05
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, appState.zoom + delta))
    setZoom(newZoom)
  }, [appState.zoom, setZoom])

  useEffect(() => {
    const updateViewportSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setViewportSize({ width: rect.width, height: rect.height })
      }
    }

    updateViewportSize()
    window.addEventListener('resize', updateViewportSize)
    
    // Add wheel event listener with passive: false to allow preventDefault
    if (canvasRef.current) {
      canvasRef.current.addEventListener('wheel', handleWheel, { passive: false })
    }
    
    return () => {
      window.removeEventListener('resize', updateViewportSize)
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('wheel', handleWheel)
      }
    }
  }, [handleWheel])


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

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      // Two-finger touch for panning and pinch zoom
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const centerX = (touch1.clientX + touch2.clientX) / 2
      const centerY = (touch1.clientY + touch2.clientY) / 2
      
      // Initialize pinch zoom
      const distance = getDistance(touch1, touch2)
      setInitialPinchDistance(distance)
      setInitialZoom(appState.zoom)
      
      setIsPanning(true)
      setLastMousePos({ x: centerX, y: centerY })
      setIsTwoFingerActive(true)
      
      // Cancel single finger panning if it was active
      setIsSingleFingerPanning(false)
      
      e.preventDefault()
    } else if (e.touches.length === 1) {
      // Single finger touch - prepare for potential panning
      const touch = e.touches[0]
      setSingleTouchStart({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      })
      setLastMousePos({ x: touch.clientX, y: touch.clientY })
    }
  }, [getDistance, appState.zoom])

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && isPanning) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const centerX = (touch1.clientX + touch2.clientX) / 2
      const centerY = (touch1.clientY + touch2.clientY) / 2
      
      // Handle pinch zoom
      if (initialPinchDistance !== null) {
        const currentDistance = getDistance(touch1, touch2)
        const scale = currentDistance / initialPinchDistance
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, initialZoom * scale))
        setZoom(newZoom)
      }
      
      // Handle pan
      const deltaX = centerX - lastMousePos.x
      const deltaY = centerY - lastMousePos.y
      
      setOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      
      setLastMousePos({ x: centerX, y: centerY })
      e.preventDefault()
    } else if (e.touches.length === 1) {
      // Single finger touch - check for panning
      const touch = e.touches[0]
      const deltaX = touch.clientX - singleTouchStart.x
      const deltaY = touch.clientY - singleTouchStart.y
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      // Start panning if moved more than 10 pixels and not too long since touch start
      const timeSinceStart = Date.now() - singleTouchStart.time
      if (!isSingleFingerPanning && distance > 10 && timeSinceStart < 500) {
        setIsSingleFingerPanning(true)
        e.preventDefault()
      }
      
      // Continue panning if active
      if (isSingleFingerPanning) {
        const panDeltaX = touch.clientX - lastMousePos.x
        const panDeltaY = touch.clientY - lastMousePos.y
        
        setOffset(prev => ({
          x: prev.x + panDeltaX,
          y: prev.y + panDeltaY
        }))
        
        setLastMousePos({ x: touch.clientX, y: touch.clientY })
        e.preventDefault()
      }
    }
  }, [lastMousePos, isPanning, initialPinchDistance, initialZoom, getDistance, setZoom, singleTouchStart, isSingleFingerPanning])

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length === 0) {
      // All fingers lifted
      setIsPanning(false)
      setInitialPinchDistance(null)
      setInitialZoom(1)
      setIsTwoFingerActive(false)
      setIsSingleFingerPanning(false)
    } else if (e.touches.length < 2) {
      // Less than 2 fingers (end of pinch/two-finger pan)
      setIsPanning(false)
      setInitialPinchDistance(null)
      setInitialZoom(1)
      setIsTwoFingerActive(false)
    }
  }, [])

  const handleLineEnter = useCallback((row, col, isVertical) => {
    if (!isDraggingLine && !isDraggingErase) return;
    
    // Only allow line tool for dragging operations
    if (appState.activeTool !== 'line') return;
    
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
    
    // Use consistent coordinate transformation
    let actualRow;
    if (isVertical) {
      actualRow = appState.gridSize.rows - 1 - row;
    } else {
      actualRow = row;
    }
    
    if (isDraggingErase) {
      // Remove wall at this position
      const newWalls = (floorData.walls || []).filter(wall => 
        !(wall.startRow === actualRow && wall.startCol === col &&
          ((isVertical && wall.endRow !== wall.startRow) || (!isVertical && wall.endCol !== wall.startCol)))
      )
      updateCurrentFloorData('walls', newWalls)
    } else if (isDraggingLine) {
      const existingWallIndex = (floorData.walls || []).findIndex(wall => 
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
        const newWalls = [...(floorData.walls || []), newWall]
        updateCurrentFloorData('walls', newWalls)
      }
    }
  }, [isDraggingLine, isDraggingErase, dragLineType, appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, floorData.walls, updateCurrentFloorData])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
    setIsDraggingLine(false)
    setIsDraggingErase(false)
    setDragLineType(null)
    setDragStartRow(null)
    setDragStartCol(null)
    setDragStartMousePos(null)
    setDragDirectionDetected(false)
    setIsRightMouseDown(false) // Reset right mouse button state
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
    
    // Coordinate transformation
    let actualRow;
    if (isVertical) {
      actualRow = appState.gridSize.rows - 1 - row;
    } else {
      // For horizontal lines, use direct mapping without special cases
      // row represents the actual row position in the data model
      actualRow = row;
    }
    

    const existingWallIndex = (floorData.walls || []).findIndex(wall => {
      // Exact match for position and direction
      if (isVertical) {
        // Vertical wall: must start at this position and be vertical
        return wall.startRow === actualRow && wall.startCol === col && wall.endRow === actualRow + 1 && wall.endCol === col
      } else {
        // Horizontal wall: must start at this position and be horizontal  
        return wall.startRow === actualRow && wall.startCol === col && wall.endRow === actualRow && wall.endCol === col + 1
      }
    })
    
    // Handle eraser tool for lines
    if (appState.activeTool === TOOLS.ERASER) {
      // Remove walls at this position
      if (existingWallIndex !== -1) {
        const newWalls = (floorData.walls || []).filter((_, index) => index !== existingWallIndex)
        updateCurrentFloorData('walls', newWalls)
      }
      // Remove doors at this position
      const newDoors = (floorData.doors || []).filter(door => 
        !(door.startRow === actualRow && door.startCol === col)
      )
      updateCurrentFloorData('doors', newDoors)
      return;
    }
    
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
        const newWalls = [...(floorData.walls || []), newWall]
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
        const existingWall = (floorData.walls || [])[existingWallIndex]
        
        // Check if there's already a door on this specific wall (same position AND direction)
        const wallIsVertical = existingWall.startCol === existingWall.endCol
        const existingDoorIndex = floorData.doors?.findIndex(door => {
          if (door.startRow === actualRow && door.startCol === col) {
            // Same position, check if same wall direction
            const doorIsVertical = door.startCol === door.endCol
            return doorIsVertical === wallIsVertical
          }
          return false
        }) ?? -1
        
        // Check if the arrow tool is compatible with the wall direction
        const isArrowTool = appState.activeTool.startsWith('line_arrow_')
        
        let canPlace = true
        if (isArrowTool) {
          const isHorizontalArrow = appState.activeTool === 'line_arrow_east' || appState.activeTool === 'line_arrow_west'
          const isVerticalArrow = appState.activeTool === 'line_arrow_north' || appState.activeTool === 'line_arrow_south'
          
          // Vertical walls can only have horizontal arrows (east/west)
          // Horizontal walls can only have vertical arrows (north/south)
          if (wallIsVertical && !isHorizontalArrow) {
            canPlace = false
          } else if (!wallIsVertical && !isVerticalArrow) {
            canPlace = false
          }
        }
        
        if (canPlace) {
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
          } else {
            // Replace existing door with new type (overwrite)
            const newDoors = [...(floorData.doors || [])]
            newDoors[existingDoorIndex] = {
              type: appState.activeTool,
              startRow: actualRow,
              startCol: col,
              endRow: existingWall.endRow,
              endCol: existingWall.endCol,
              id: Date.now() + Math.random()
            }
            updateCurrentFloorData('doors', newDoors)
          }
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
    
    // Use consistent coordinate transformation with handleLineClick
    let actualRow;
    if (isVertical) {
      actualRow = appState.gridSize.rows - 1 - row;
    } else {
      actualRow = row;
    }
    
    // Store initial mouse position for potential drag operation (but don't start dragging yet)
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
    
    // Handle deletion based on active tool
    const lineTools = ['line'];
    const otherLineTools = ['door_open', 'door_closed', 'line_arrow_north', 'line_arrow_south', 'line_arrow_east', 'line_arrow_west'];
    
    if (lineTools.includes(appState.activeTool)) {
      // Line tool: Remove walls only
      const newWalls = (floorData.walls || []).filter(wall => 
        !(wall.startRow === actualRow && wall.startCol === col &&
          ((isVertical && wall.endRow !== wall.startRow) || (!isVertical && wall.endCol !== wall.startCol)))
      )
      updateCurrentFloorData('walls', newWalls)
    } else if (otherLineTools.includes(appState.activeTool)) {
      // Door tools: Remove doors only (regardless of wall existence)
      const newDoors = (floorData.doors || []).filter(door => 
        !(door.startRow === actualRow && door.startCol === col)
      )
      updateCurrentFloorData('doors', newDoors)
    }
  }, [appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, floorData.walls, floorData.doors, updateCurrentFloorData])

  const handleGridClick = useCallback((row, col, event = null) => {
    // Ensure coordinates are within bounds
    if (row < 0 || row >= appState.gridSize.rows || col < 0 || col >= appState.gridSize.cols) {
      return;
    }
    
    const actualRow = appState.gridSize.rows - 1 - row;
    
    // Check if there's an existing note at this location
    const existingNote = (floorData.items || []).find(item => item.row === actualRow && item.col === col && item.type === TOOLS.NOTE)
    
    // If there's an existing note, open the note dialog regardless of current tool (except Eraser)
    if (existingNote && appState.activeTool !== TOOLS.ERASER) {
      setNoteDialog({
        isOpen: true,
        row: actualRow,
        col,
        text: existingNote.text || ''
      })
      return
    }
    
    // Handle eraser tool
    if (appState.activeTool === TOOLS.ERASER) {
      // Remove grid fill
      const newGrid = [...(floorData.grid || [])]
      if (newGrid[actualRow] && actualRow >= 0 && actualRow < appState.gridSize.rows) {
        newGrid[actualRow] = [...newGrid[actualRow]]
        newGrid[actualRow][col] = null
        updateCurrentFloorData('grid', newGrid)
      }
      // Remove items at this position
      const newItems = (floorData.items || []).filter(item => !(item.row === actualRow && item.col === col))
      updateCurrentFloorData('items', newItems)
      return;
    }
    
    if (appState.activeTool === TOOLS.BLOCK_COLOR || appState.activeTool === TOOLS.DARK_ZONE) {
      const newGrid = [...(floorData.grid || [])]
      if (newGrid[actualRow] && actualRow >= 0 && actualRow < appState.gridSize.rows) {
        newGrid[actualRow] = [...newGrid[actualRow]]
        // Use gray color for DARK_ZONE, otherwise use selected color
        const colorToUse = appState.activeTool === TOOLS.DARK_ZONE ? '#b0b0b0' : selectedColor
        newGrid[actualRow][col] = colorToUse
        updateCurrentFloorData('grid', newGrid)
      }
      // Note: Door tools should be handled via handleLineClick, not handleGridClick
      // Grid clicks are only for items that go in cell centers
    } else if (appState.activeTool === TOOLS.NOTE) {
      // Special handling for NOTE tool - open dialog
      const existingItemIndex = (floorData.items || []).findIndex(item => item.row === actualRow && item.col === col && item.type === TOOLS.NOTE)
      const existingText = existingItemIndex >= 0 ? (floorData.items || [])[existingItemIndex].text || '' : ''
      
      setNoteDialog({
        isOpen: true,
        row: actualRow,
        col,
        text: existingText  // Only use existing text if there's already a note at this exact position
      })
    } else if (Object.values(TOOLS).includes(appState.activeTool) && appState.activeTool !== TOOLS.DARK_ZONE) {
      // Special handling for CURRENT_POSITION - only one per floor
      if (appState.activeTool === TOOLS.CURRENT_POSITION) {
        // Remove any existing current position markers on this floor
        const itemsWithoutCurrentPos = (floorData.items || []).filter(item => item.type !== TOOLS.CURRENT_POSITION)
        
        // Add new current position marker
        const newItem = {
          type: appState.activeTool,
          row: actualRow,
          col,
          id: Date.now() + Math.random()
        }
        const newItems = [...itemsWithoutCurrentPos, newItem]
        updateCurrentFloorData('items', newItems)
      } else {
        // Check if there's already an item at this position
        const existingItemIndex = (floorData.items || []).findIndex(item => item.row === actualRow && item.col === col)
        
        if (existingItemIndex === -1) {
          // Add new item
          const newItem = {
            type: appState.activeTool === TOOLS.ARROW ? `arrow_${arrowDirection}` : appState.activeTool,
            row: actualRow,
            col,
            id: Date.now() + Math.random(),
            ...(appState.activeTool === TOOLS.WARP_POINT && { warpText }),
            ...(appState.activeTool === TOOLS.SHUTE && { shuteStyle }),
            ...(appState.activeTool === TOOLS.ARROW && { arrowDirection })
          }
          const newItems = [...(floorData.items || []), newItem]
          updateCurrentFloorData('items', newItems)
        } else {
          // Replace existing item with new type
          const newItems = [...(floorData.items || [])]
          newItems[existingItemIndex] = {
            type: appState.activeTool === TOOLS.ARROW ? `arrow_${arrowDirection}` : appState.activeTool,
            row: actualRow,
            col,
            id: Date.now() + Math.random(),
            ...(appState.activeTool === TOOLS.WARP_POINT && { warpText }),
            ...(appState.activeTool === TOOLS.SHUTE && { shuteStyle }),
            ...(appState.activeTool === TOOLS.ARROW && { arrowDirection })
          }
          updateCurrentFloorData('items', newItems)
        }
      }
    }
  }, [appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, floorData.grid, floorData.items, floorData.walls, floorData.doors, selectedColor, warpText, shuteStyle, arrowDirection, updateCurrentFloorData])

  const handleNoteDialogSave = useCallback((text) => {
    const { row, col } = noteDialog
    const existingItemIndex = (floorData.items || []).findIndex(item => item.row === row && item.col === col && item.type === TOOLS.NOTE)
    
    if (text.trim()) {
      // Save note with text
      const noteItem = {
        type: TOOLS.NOTE,
        row,
        col,
        text: text.trim(),
        id: Date.now() + Math.random()
      }
      
      if (existingItemIndex >= 0) {
        // Update existing note
        const newItems = [...(floorData.items || [])]
        newItems[existingItemIndex] = noteItem
        updateCurrentFloorData('items', newItems)
      } else {
        // Add new note
        const newItems = [...(floorData.items || []), noteItem]
        updateCurrentFloorData('items', newItems)
      }
    } else if (existingItemIndex >= 0) {
      // Remove note if text is empty
      const newItems = (floorData.items || []).filter((_, index) => index !== existingItemIndex)
      updateCurrentFloorData('items', newItems)
    }
  }, [noteDialog, floorData.items, updateCurrentFloorData])

  const handleNoteDialogClose = useCallback(() => {
    // Reset dialog state completely
    setNoteDialog({ isOpen: false, row: null, col: null, text: '' })
  }, [])

  const handleGridRightClick = useCallback((row, col) => {
    // Ensure coordinates are within bounds
    if (row < 0 || row >= appState.gridSize.rows || col < 0 || col >= appState.gridSize.cols) {
      return;
    }
    
    const actualRow = appState.gridSize.rows - 1 - row;
    
    // Define tool categories
    const lineTools = ['line'];
    const otherLineTools = ['door_open', 'door_closed', 'line_arrow_north', 'line_arrow_south', 'line_arrow_east', 'line_arrow_west'];
    const fillTools = [TOOLS.BLOCK_COLOR, TOOLS.DARK_ZONE];
    const otherGridTools = ['chest', 'warp_point', 'shute', 'elevator', 'stairs_up_svg', 'stairs_down_svg', 'current_position', 'event_marker', 'note', 'arrow_north', 'arrow_south', 'arrow_east', 'arrow_west', 'arrow'];
    
    if (fillTools.includes(appState.activeTool)) {
      // Fill category: Remove fill color only
      const newGrid = [...(floorData.grid || [])]
      if (newGrid[actualRow] && actualRow >= 0 && actualRow < appState.gridSize.rows) {
        newGrid[actualRow] = [...newGrid[actualRow]]
        newGrid[actualRow][col] = null
        updateCurrentFloorData('grid', newGrid)
      }
    } else if (lineTools.includes(appState.activeTool)) {
      // Line category: Remove walls only
      const newWalls = (floorData.walls || []).filter(wall => 
        !(wall.startRow === actualRow && wall.startCol === col)
      )
      updateCurrentFloorData('walls', newWalls)
    } else if (otherLineTools.includes(appState.activeTool)) {
      // Other Line tools category: Remove doors only
      const newDoors = (floorData.doors || []).filter(door => 
        !(door.startRow === actualRow && door.startCol === col)
      )
      updateCurrentFloorData('doors', newDoors)
    } else if (otherGridTools.includes(appState.activeTool)) {
      // Other Grid tools category: Remove items only
      const newItems = (floorData.items || []).filter(item => !(item.row === actualRow && item.col === col))
      updateCurrentFloorData('items', newItems)
    }
  }, [appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, floorData.grid, floorData.items, floorData.walls, floorData.doors, updateCurrentFloorData])

  useEffect(() => {
    const handleGlobalMouseDown = (e) => {
      if (e.button === 2) { // Right mouse button
        setIsRightMouseDown(true)
      }
    }

    const handleGlobalMouseUp = (e) => {
      if (e.button === 2) { // Right mouse button
        setIsRightMouseDown(false)
        // Also clear drag states when right button is released
        if (isDraggingErase) {
          setIsDraggingErase(false)
          setDragLineType(null)
          setDragStartRow(null)
          setDragStartCol(null)
          setDragStartMousePos(null)
          setDragDirectionDetected(false)
        }
      }
    }

    const handleGlobalMouseMove = (e) => {
      // Handle potential drag start for right-click erase (when not yet in dragging mode)
      // Only allow drag start if right mouse button is still pressed
      if (!isDraggingErase && !isDraggingLine && isRightMouseDown && dragStartMousePos && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        
        const deltaX = Math.abs(mouseX - dragStartMousePos.x)
        const deltaY = Math.abs(mouseY - dragStartMousePos.y)
        const threshold = 5 // Minimum movement to start drag
        
        if (deltaX > threshold || deltaY > threshold) {
          // Start dragging mode only when mouse actually moves AND right button is still pressed
          setIsDraggingErase(true)
          setDragLineType(null) // Will be determined by direction
          setDragDirectionDetected(false)
        }
      }
      
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

    document.addEventListener('mousedown', handleGlobalMouseDown)
    document.addEventListener('mouseup', handleGlobalMouseUp)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousedown', handleGlobalMouseDown)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp, isDraggingLine, isDraggingErase, isRightMouseDown, dragLineType, dragStartRow, dragStartCol, dragStartMousePos, dragDirectionDetected, offset, appState.zoom, appState.gridSize, handleLineEnter, floorData.walls, updateCurrentFloorData])

  return (
    <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: '#f8f8f8' }}>
      <div
        ref={canvasRef}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onContextMenu={(e) => e.preventDefault()}
        style={{ touchAction: 'none' }}
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
          isTwoFingerActive={isTwoFingerActive}
          isSingleFingerPanning={isSingleFingerPanning}
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
          showNoteTooltips={showNoteTooltips}
        />
        
        <Doors
          doors={floorData.doors || []}
          zoom={appState.zoom}
          offset={offset}
          gridSize={appState.gridSize}
        />

      </div>
      
      {/* Color picker for block color tool */}
      {appState.activeTool === TOOLS.BLOCK_COLOR && (
        <div className="absolute bottom-16 right-4 bg-gray-800 p-2 rounded shadow-lg z-50">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-8 h-8 rounded border"
          />
        </div>
      )}

      {/* Text input for warp point tool */}
      {appState.activeTool === TOOLS.WARP_POINT && (
        <div className="absolute bottom-16 right-4 bg-gray-800 p-2 rounded shadow-lg z-50">
          <input
            type="text"
            value={warpText}
            onChange={(e) => {
              const value = e.target.value.slice(0, 2).toUpperCase()
              setWarpText(value)
            }}
            placeholder="A"
            maxLength={2}
            className="w-8 h-8 rounded border text-center text-xs bg-white text-black"
            style={{ fontSize: '14px', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', fontWeight: 'bold' }}
          />
        </div>
      )}

      {/* Style selector for shute tool */}
      {appState.activeTool === TOOLS.SHUTE && (
        <div className="absolute bottom-16 right-4 bg-gray-800 p-2 rounded shadow-lg z-50">
          <select
            value={shuteStyle}
            onChange={(e) => setShuteStyle(e.target.value)}
            className="w-8 h-8 rounded border text-center text-xs bg-white text-black"
            style={{ fontSize: '14px', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', fontWeight: 'bold' }}
          >
            <option value="filled">●</option>
            <option value="outline">○</option>
          </select>
        </div>
      )}

      {/* Arrow direction selector */}
      {appState.activeTool === TOOLS.ARROW && (
        <div className="absolute bottom-16 right-4 bg-gray-800 p-2 rounded shadow-lg z-50">
          <select
            value={arrowDirection}
            onChange={(e) => setArrowDirection(e.target.value)}
            className="w-8 h-8 rounded border text-center text-xs bg-white text-black"
            style={{ fontSize: '14px', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', fontWeight: 'bold' }}
          >
            <option value="north">↑</option>
            <option value="south">↓</option>
            <option value="west">←</option>
            <option value="east">→</option>
            <option value="rotate">⟲</option>
          </select>
        </div>
      )}
      
      {/* Zoom indicator */}
      <div 
        className="absolute bottom-4 right-4 bg-gray-800 rounded shadow-lg text-white text-xs cursor-pointer hover:bg-gray-700 transition-colors z-50 flex items-center justify-center"
        onClick={() => setZoom(1.0)}
        title="Click to reset zoom to 100%"
        style={{ 
          pointerEvents: 'auto',
          width: '48px',
          height: '40px'
        }}
      >
        {Math.round(appState.zoom * 100)}%
      </div>
      
      {/* Note dialog */}
      <NoteDialog
        isOpen={noteDialog.isOpen}
        onClose={handleNoteDialogClose}
        onSave={handleNoteDialogSave}
        initialText={noteDialog.text}
      />
    </div>
  )
}

export default Canvas