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
  getNoteAt,
  setNoteAt,
  deleteNoteAt,
  moveNoteAt,
  showNoteTooltips = true,
  theme
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
  const [stairsText, setStairsText] = useState('') // Text for stairs
  const [doorState, setDoorState] = useState('closed') // 'closed' or 'open'
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
  
  // Note dragging states
  const [isDraggingNote, setIsDraggingNote] = useState(false)
  const [draggedNote, setDraggedNote] = useState(null) // { row, col, text }
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
  const [dragCurrentPos, setDragCurrentPos] = useState({ x: 0, y: 0 })
  const [dragHoverCell, setDragHoverCell] = useState(null) // { row, col }
  
  // Stable reference for drag states to avoid useCallback dependency issues
  const dragStateRef = useRef({
    draggedNote: null,
    isDraggingNote: false,
    dragHoverCell: null
  })

  const floorData = getCurrentFloorData() || { grid: [], walls: [], items: [], doors: [] }

  // Update drag state ref when states change
  useEffect(() => {
    dragStateRef.current = {
      draggedNote,
      isDraggingNote,
      dragHoverCell
    }
  }, [draggedNote, isDraggingNote, dragHoverCell])

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
    // Prevent context menu on right click
    if (e.button === 2) {
      e.preventDefault()
    }
    
    // Check for note click first
    if (e.target.hasAttribute('data-note-row') && e.target.hasAttribute('data-note-col')) {
      const noteRow = parseInt(e.target.getAttribute('data-note-row'))
      const noteCol = parseInt(e.target.getAttribute('data-note-col'))
      const existingNote = getNoteAt(noteRow, noteCol)
      
      if (existingNote) {
        e.preventDefault()
        e.stopPropagation()
        
        if (e.button === 0) { // Left click - prepare for drag or dialog
          setDragStartPos({ x: e.clientX, y: e.clientY })
          setDraggedNote({ row: noteRow, col: noteCol, text: existingNote.text })
          // Don't open dialog immediately - wait to see if it's a drag
        } else if (e.button === 2 && appState.activeTool === TOOLS.NOTE) { // Right click with NOTE tool
          deleteNoteAt(noteRow, noteCol)
        }
        return
      }
    }
    
    if (e.button === 1 || e.shiftKey) { // Middle mouse or Shift+click for panning
      setIsPanning(true)
      setLastMousePos({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    }
  }, [getNoteAt, appState.activeTool, deleteNoteAt])

  const handleMouseMove = useCallback((e) => {
    // Handle note dragging
    if (draggedNote && !isDraggingNote) {
      // Check if mouse moved enough to start dragging (5px threshold)
      const deltaX = e.clientX - dragStartPos.x
      const deltaY = e.clientY - dragStartPos.y
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      if (distance > 5) {
        setIsDraggingNote(true)
        setDragCurrentPos({ x: e.clientX, y: e.clientY })
      }
    } else if (isDraggingNote) {
      // Update drag position and calculate hover cell
      setDragCurrentPos({ x: e.clientX, y: e.clientY })
      
      // Calculate which cell the mouse is over
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const cellSize = GRID_SIZE * appState.zoom
        const mouseX = e.clientX - rect.left - offset.x - 24
        const mouseY = e.clientY - rect.top - offset.y - 24
        
        const col = Math.floor(mouseX / cellSize)
        const row = appState.gridSize.rows - 1 - Math.floor(mouseY / cellSize)
        
        if (col >= 0 && col < appState.gridSize.cols && row >= 0 && row < appState.gridSize.rows) {
          setDragHoverCell({ row, col })
        } else {
          setDragHoverCell(null)
        }
      }
    } else if (isPanning && !isDraggingNote) {
      const deltaX = e.clientX - lastMousePos.x
      const deltaY = e.clientY - lastMousePos.y
      
      setOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      
      setLastMousePos({ x: e.clientX, y: e.clientY })
    }
  }, [isPanning, lastMousePos, draggedNote, isDraggingNote, dragStartPos, offset, appState.zoom, appState.gridSize])

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
    // Get stable references to current drag states
    const { draggedNote, isDraggingNote, dragHoverCell } = dragStateRef.current
    
    // Handle note dragging completion
    if (draggedNote) {
      if (isDraggingNote && dragHoverCell) {
        // Complete drag operation - move note to new cell
        const { row: fromRow, col: fromCol } = draggedNote
        const { row: toRow, col: toCol } = dragHoverCell
        
        if (fromRow !== toRow || fromCol !== toCol) {
          // Check if target cell has existing note
          const existingNote = getNoteAt(toRow, toCol)
          if (existingNote) {
            // Show confirmation dialog for overwrite
            if (window.confirm(`セル (${toRow}, ${toCol}) に既存のメモがあります。上書きしますか？`)) {
              // Remove source note and add to target
              deleteNoteAt(fromRow, fromCol)
              setNoteAt(toRow, toCol, draggedNote.text)
            }
          } else {
            // Move note to new cell
            moveNoteAt(fromRow, fromCol, toRow, toCol)
          }
        }
      } else if (!isDraggingNote) {
        // It was a click, not a drag - open dialog
        setNoteDialog({
          isOpen: true,
          row: draggedNote.row,
          col: draggedNote.col,
          text: draggedNote.text || ''
        })
      }
      
      // Reset drag states
      setIsDraggingNote(false)
      setDraggedNote(null)
      setDragStartPos({ x: 0, y: 0 })
      setDragCurrentPos({ x: 0, y: 0 })
      setDragHoverCell(null)
    }
    
    setIsPanning(false)
    setIsDraggingLine(false)
    setIsDraggingErase(false)
    setDragLineType(null)
    setDragStartRow(null)
    setDragStartCol(null)
    setDragStartMousePos(null)
    setDragDirectionDetected(false)
    setIsRightMouseDown(false) // Reset right mouse button state
  }, [getNoteAt, deleteNoteAt, setNoteAt, moveNoteAt])

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
      // For Door and Arrow tools, use the same line-based placement as Line tool
      // The isVertical parameter determines if this is a vertical or horizontal line click
      
      // Check if there's already a door at this position with the same orientation
      const existingDoorIndex = floorData.doors?.findIndex(door => {
        if (door.startRow === actualRow && door.startCol === col) {
          // Same position, check if same wall direction
          const doorIsVertical = door.startCol === door.endCol
          return doorIsVertical === isVertical
        }
        return false
      }) ?? -1
      
      // Check if the arrow tool is compatible with the wall direction
      const isArrowTool = appState.activeTool.startsWith('line_arrow_')
      
      let canPlace = true
      if (isArrowTool) {
        const isHorizontalArrow = appState.activeTool === 'line_arrow_east' || appState.activeTool === 'line_arrow_west'
        const isVerticalArrow = appState.activeTool === 'line_arrow_north' || appState.activeTool === 'line_arrow_south'
        
        // Vertical lines can only have horizontal arrows (east/west)
        // Horizontal lines can only have vertical arrows (north/south)
        if (isVertical && !isHorizontalArrow) {
          canPlace = false
        } else if (!isVertical && !isVerticalArrow) {
          canPlace = false
        }
      }
      
      if (canPlace) {
        // Determine end coordinates based on line direction
        const endRow = isVertical ? actualRow + 1 : actualRow
        const endCol = isVertical ? col : col + 1
        
        if (existingDoorIndex === -1) {
          // Add new door
          const newDoor = {
            type: appState.activeTool,
            startRow: actualRow,
            startCol: col,
            endRow: endRow,
            endCol: endCol,
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
            endRow: endRow,
            endCol: endCol,
            id: Date.now() + Math.random()
          }
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

  const handleGridClick = useCallback((row, col, _event = null) => {
    // Ensure coordinates are within bounds
    if (row < 0 || row >= appState.gridSize.rows || col < 0 || col >= appState.gridSize.cols) {
      return;
    }
    
    // Don't handle grid clicks if we're in the middle of dragging a note
    if (isDraggingNote) {
      return;
    }
    
    // Don't handle grid clicks if a note drag has been initiated (but not yet in dragging mode)
    if (draggedNote) {
      return;
    }
    
    const actualRow = appState.gridSize.rows - 1 - row;
    
    // Check if there's an existing note at this location (new notes system)
    const existingNote = getNoteAt(actualRow, col)
    
    // If there's an existing note, handle it based on the tool
    if (existingNote && appState.activeTool !== TOOLS.ERASER) {
      // For NOTE tool, let the normal flow handle it to avoid duplicate dialogs
      if (appState.activeTool !== TOOLS.NOTE) {
        setNoteDialog({
          isOpen: true,
          row: actualRow,
          col,
          text: existingNote.text || ''
        })
        return
      }
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
      // Remove notes at this position (new notes system)
      deleteNoteAt(actualRow, col)
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
      const existingNoteData = getNoteAt(actualRow, col)
      const existingText = existingNoteData ? existingNoteData.text || '' : ''
      
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
            ...(appState.activeTool === TOOLS.ARROW && { arrowDirection }),
            ...((appState.activeTool === TOOLS.STAIRS_UP_SVG || appState.activeTool === TOOLS.STAIRS_DOWN_SVG) && { stairsText }),
            ...(appState.activeTool === TOOLS.DOOR_ITEM && { doorState })
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
            ...(appState.activeTool === TOOLS.ARROW && { arrowDirection }),
            ...((appState.activeTool === TOOLS.STAIRS_UP_SVG || appState.activeTool === TOOLS.STAIRS_DOWN_SVG) && { stairsText }),
            ...(appState.activeTool === TOOLS.DOOR_ITEM && { doorState })
          }
          updateCurrentFloorData('items', newItems)
        }
      }
    }
  }, [appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, floorData.grid, floorData.items, selectedColor, warpText, shuteStyle, arrowDirection, stairsText, updateCurrentFloorData, isDraggingNote, draggedNote, getNoteAt, deleteNoteAt])

  const handleNoteDialogSave = useCallback((text) => {
    const { row, col } = noteDialog
    setNoteAt(row, col, text)
  }, [noteDialog, setNoteAt])

  const handleNoteDialogDelete = useCallback(() => {
    const { row, col } = noteDialog
    deleteNoteAt(row, col)
  }, [noteDialog, deleteNoteAt])

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
      
      // Special case: NOTE tool can delete notes with right-click
      if (appState.activeTool === TOOLS.NOTE) {
        deleteNoteAt(actualRow, col)
      }
    }
  }, [appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, floorData.grid, floorData.items, floorData.walls, floorData.doors, updateCurrentFloorData, deleteNoteAt])

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
  }, [handleMouseMove, isDraggingLine, isDraggingErase, isRightMouseDown, dragLineType, dragStartRow, dragStartCol, dragStartMousePos, dragDirectionDetected, offset, appState.zoom, appState.gridSize, handleLineEnter, floorData.walls, updateCurrentFloorData])

  return (
    <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: theme.grid.canvasBackground }}>
      <div
        ref={canvasRef}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{ 
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          cursor: isDraggingNote ? 'grabbing' : 'default'
        }}
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
          theme={theme}
        />
        
        <Walls
          walls={floorData.walls}
          zoom={appState.zoom}
          offset={offset}
          gridSize={appState.gridSize}
          theme={theme}
        />
        
        <Items
          items={floorData.items}
          notes={floorData.notes || []}
          zoom={appState.zoom}
          offset={offset}
          gridSize={appState.gridSize}
          showNoteTooltips={showNoteTooltips}
          theme={theme}
          isDraggingNote={isDraggingNote}
          draggedNote={draggedNote}
          dragHoverCell={dragHoverCell}
          dragCurrentPos={dragCurrentPos}
        />
        
        <Doors
          doors={floorData.doors || []}
          zoom={appState.zoom}
          offset={offset}
          gridSize={appState.gridSize}
          theme={theme}
        />

      </div>
      
      {/* Color picker for block color tool */}
      {appState.activeTool === TOOLS.BLOCK_COLOR && (
        <div className="absolute bottom-16 right-4 p-2 rounded shadow-lg z-50" style={{ backgroundColor: theme.ui.panel }}>
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
        <div className="absolute bottom-16 right-4 p-2 rounded shadow-lg z-50" style={{ backgroundColor: theme.ui.panel }}>
          <input
            type="text"
            value={warpText}
            onChange={(e) => {
              const value = e.target.value.slice(0, 2)
              setWarpText(value)
            }}
            placeholder="A"
            maxLength={2}
            className="w-8 h-8 rounded border text-center text-xs"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}`, fontSize: '14px', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', fontWeight: 'bold' }}
          />
        </div>
      )}

      {/* Style selector for shute tool */}
      {appState.activeTool === TOOLS.SHUTE && (
        <div className="absolute bottom-16 right-4 p-2 rounded shadow-lg z-50" style={{ backgroundColor: theme.ui.panel }}>
          <select
            value={shuteStyle}
            onChange={(e) => setShuteStyle(e.target.value)}
            className="w-8 h-8 rounded border text-center text-xs"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}`, fontSize: '14px', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', fontWeight: 'bold' }}
          >
            <option value="filled">●</option>
            <option value="outline">○</option>
          </select>
        </div>
      )}

      {/* Stairs text input */}
      {(appState.activeTool === TOOLS.STAIRS_UP_SVG || appState.activeTool === TOOLS.STAIRS_DOWN_SVG) && (
        <div className="absolute bottom-16 right-4 p-2 rounded shadow-lg z-50" style={{ backgroundColor: theme.ui.panel }}>
          <input
            type="text"
            value={stairsText}
            onChange={(e) => setStairsText(e.target.value)}
            placeholder=""
            maxLength={2}
            className="w-8 h-8 rounded border text-center text-xs"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}`, fontSize: '14px', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', fontWeight: 'bold' }}
          />
        </div>
      )}

      {/* Arrow direction selector */}
      {appState.activeTool === TOOLS.ARROW && (
        <div className="absolute bottom-16 right-4 p-2 rounded shadow-lg z-50" style={{ backgroundColor: theme.ui.panel }}>
          <select
            value={arrowDirection}
            onChange={(e) => setArrowDirection(e.target.value)}
            className="w-8 h-8 rounded border text-center text-xs"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}`, fontSize: '14px', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', fontWeight: 'bold' }}
          >
            <option value="north">↑</option>
            <option value="south">↓</option>
            <option value="west">←</option>
            <option value="east">→</option>
            <option value="rotate">⟲</option>
          </select>
        </div>
      )}

      {/* Door state selector */}
      {appState.activeTool === TOOLS.DOOR_ITEM && (
        <div className="absolute bottom-16 right-4 p-2 rounded shadow-lg z-50" style={{ backgroundColor: theme.ui.panel }}>
          <select
            value={doorState}
            onChange={(e) => setDoorState(e.target.value)}
            className="w-8 h-8 rounded border text-center text-xs"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}`, fontSize: '14px', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', fontWeight: 'bold' }}
          >
            <option value="closed">■</option>
            <option value="open">□</option>
          </select>
        </div>
      )}
      
      {/* Zoom indicator */}
      <div 
        className="absolute bottom-4 right-4 rounded shadow-lg text-xs cursor-pointer transition-colors z-50 flex items-center justify-center"
        onClick={() => setZoom(1.0)}
        title="Click to reset zoom to 100%"
        style={{ 
          backgroundColor: theme.ui.button, 
          color: theme.ui.panelText,
          pointerEvents: 'auto',
          width: '48px',
          height: '40px'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonHover}
        onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.button}
      >
        {Math.round(appState.zoom * 100)}%
      </div>
      
      {/* Note dialog */}
      <NoteDialog
        isOpen={noteDialog.isOpen}
        onClose={handleNoteDialogClose}
        onSave={handleNoteDialogSave}
        onDelete={handleNoteDialogDelete}
        initialText={noteDialog.text}
        theme={theme}
      />
    </div>
  )
}

export default Canvas