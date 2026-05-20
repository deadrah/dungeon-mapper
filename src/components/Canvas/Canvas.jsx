import React, { useState, useRef, useEffect, useCallback } from 'react'
import Grid from './Grid'
import Items from './Items'
import Walls from './Walls'
import Doors from './Doors'
import NoteDialog from '../Dialog/NoteDialog'
import { GRID_SIZE, MIN_ZOOM, MAX_ZOOM, TOOLS } from '../../utils/constants'

// 高速ドラッグでセルが抜けないように、(r1,c1)→(r2,c2) の中間セルを Bresenham で列挙する（両端含む）
const cellsBetween = (r1, c1, r2, c2) => {
  const cells = []
  const dr = Math.abs(r2 - r1)
  const dc = Math.abs(c2 - c1)
  const sr = r1 < r2 ? 1 : -1
  const sc = c1 < c2 ? 1 : -1
  let err = dc - dr
  let r = r1
  let c = c1
  while (true) {
    cells.push([r, c])
    if (r === r2 && c === c2) break
    const e2 = err * 2
    if (e2 > -dr) { err -= dr; c += sc }
    if (e2 < dc) { err += dc; r += sr }
  }
  return cells
}

// Tool options definitions for cycling functionality
const TOOL_OPTIONS = {
  [TOOLS.SHUTE]: ['filled', 'outline'],
  [TOOLS.EVENT_MARKER]: ['default', 'combat', 'healing', 'trash'],
  [TOOLS.ARROW]: ['north', 'south', 'east', 'west', 'rotate'],
  [TOOLS.DOOR_ITEM]: ['closed', 'open']
}

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
  const [eventType, setEventType] = useState('default') // 'default', 'combat', 'healing'
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
  // 1本指 panning 状態は state ではなく ref のみで管理。
  // setIsSingleFingerPanning による React レンダーが panning 中のメインスレッドを占有し、touchmove が drop される問題を回避するため。
  
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

  // 高速ドラッグ時のセル抜け補間用：前回処理したセル位置を保持する
  const lastLineCellRef = useRef(null) // ラインドラッグ用 { row, col }（ライン座標系）
  const lastFillCellRef = useRef(null) // 塗りつぶしドラッグ用 { row, col }（表示行座標系）

  // 1本指スワイプ用：仮想化境界での DOM 再生成と state closure capture を回避するため、追跡情報を ref で保持
  const lastTouchPosRef = useRef({ x: 0, y: 0 })
  const singleTouchStartRef = useRef({ x: 0, y: 0, time: 0 })
  const isSingleFingerPanningRef = useRef(false)


  // panning 中の setOffset を requestAnimationFrame で 1 フレーム 1 回にまとめる。
  // touchmove ごとに setOffset を呼ぶと毎フレーム Canvas 再レンダー → 大量 SVG 要素再計算でメインスレッドが詰まり、
  // 次の touchmove が drop されるため。
  const pendingPanDeltaRef = useRef({ x: 0, y: 0 })
  const panRafScheduledRef = useRef(false)

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

  // Helper functions for deletion priority
  const getNextGridDeletionTarget = useCallback((row, col) => {
    // 1. メモチェック
    const existingNote = getNoteAt(row, col)
    if (existingNote) return 'note'
    
    // 2. アイテムチェック  
    const item = (floorData.items || []).find(item => item.row === row && item.col === col)
    if (item) return 'item'
    
    // 3. グリッド塗りチェック
    if (floorData.grid?.[row]?.[col]) return 'grid'
    
    return null
  }, [floorData.items, floorData.grid, getNoteAt])

  const getNextLineDeletionTarget = useCallback((row, col) => {
    // 1. ライン系ツール（ドア、矢印）チェック
    const door = (floorData.doors || []).find(door => 
      door.startRow === row && door.startCol === col
    )
    if (door) return 'door'
    
    // 2. ライン（壁）チェック
    const wall = (floorData.walls || []).find(wall => 
      wall.startRow === row && wall.startCol === col
    )
    if (wall) return 'wall'
    
    return null
  }, [floorData.doors, floorData.walls])

  const handleMouseDown = useCallback((e) => {
    // Prevent context menu on right click
    if (e.button === 2) {
      e.preventDefault()
    }

    // 新しいドラッグの開始ごとに補間用 ref を初期化（前回 mouseup を取り逃した場合の保険）
    // 左ボタン（塗り／ERASER）／右ボタン（削除）どちらの開始でもリセットする
    if (e.button === 0 || e.button === 2) {
      lastFillCellRef.current = null
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
      // capture phase で発火しているので、bubble で子（Grid セル）の onMouseDown が呼ばれて
      // 編集処理が走らないように伝播を止める
      e.stopPropagation()
    }
  }, [getNoteAt, appState.activeTool, deleteNoteAt])

  const handleMouseMove = useCallback((e) => {
    // Handle note dragging
    if (draggedNote && !isDraggingNote) {
      // Check if mouse moved enough to start dragging (increased threshold to 15px)
      const deltaX = e.clientX - dragStartPos.x
      const deltaY = e.clientY - dragStartPos.y
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      if (distance > 15) {
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
      isSingleFingerPanningRef.current = false

      e.preventDefault()
    } else if (e.touches.length === 1) {
      // Single finger touch - prepare for potential panning
      const touch = e.touches[0]
      // 追跡情報はすべて ref に書く（closure capture を回避）
      singleTouchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      }
      lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY }
      isSingleFingerPanningRef.current = false
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
    } else if (e.touches.length === 1) {
      // 1本指スワイプ：ref のみ参照（state の closure capture を避ける）
      const touch = e.touches[0]
      const start = singleTouchStartRef.current
      const deltaX = touch.clientX - start.x
      const deltaY = touch.clientY - start.y
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // 距離だけで判定（時間制限なし）。タップとの区別は他経路で取られているため
      if (!isSingleFingerPanningRef.current && distance > 10) {
        isSingleFingerPanningRef.current = true
        // setState は呼ばない（panning 中の再レンダーで touchmove が drop されるため）
      }

      if (isSingleFingerPanningRef.current) {

        const last = lastTouchPosRef.current
        const panDeltaX = touch.clientX - last.x
        const panDeltaY = touch.clientY - last.y

        // touchmove 毎の setOffset を rAF にまとめる（再レンダー負荷を 60fps に絞る）
        pendingPanDeltaRef.current.x += panDeltaX
        pendingPanDeltaRef.current.y += panDeltaY
        if (!panRafScheduledRef.current) {
          panRafScheduledRef.current = true
          requestAnimationFrame(() => {
            panRafScheduledRef.current = false
            const dx = pendingPanDeltaRef.current.x
            const dy = pendingPanDeltaRef.current.y
            pendingPanDeltaRef.current = { x: 0, y: 0 }
            if (dx !== 0 || dy !== 0) {
              setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }))
            }
          })
        }

        lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY }
      }
    }
  }, [isPanning, initialPinchDistance, initialZoom, getDistance, setZoom, lastMousePos])

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length === 0) {
      // All fingers lifted
      setIsPanning(false)
      setInitialPinchDistance(null)
      setInitialZoom(1)
      setIsTwoFingerActive(false)
      isSingleFingerPanningRef.current = false
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
      // 関数型 setter で最新の walls を基準に削除する（連続呼び出しでの取りこぼし防止）
      updateCurrentFloorData('walls', (prevWalls) =>
        (prevWalls || []).filter(wall =>
          !(wall.startRow === actualRow && wall.startCol === col &&
            ((isVertical && wall.endRow !== wall.startRow) || (!isVertical && wall.endCol !== wall.startCol)))
        )
      )
    } else if (isDraggingLine) {
      // 関数型 setter で最新の walls を見て既存壁の重複チェック → 追加（連続呼び出しで stale な walls を見ない）
      updateCurrentFloorData('walls', (prevWalls) => {
        const walls = prevWalls || []
        const exists = walls.some(wall =>
          wall.startRow === actualRow && wall.startCol === col &&
          ((isVertical && wall.endRow !== wall.startRow) || (!isVertical && wall.endCol !== wall.startCol))
        )
        if (exists) return walls
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
        return [...walls, newWall]
      })
    }
  }, [isDraggingLine, isDraggingErase, dragLineType, appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, updateCurrentFloorData])

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
    // 補間用の前回セル参照もリセット（次のドラッグの起点を新規にする）
    lastLineCellRef.current = null
    lastFillCellRef.current = null
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
    
    // Helper function to detect if the event is from touch (mobile) vs mouse (PC)
    const isTouchEvent = event && (
      event.type === 'touchstart' || 
      event.type === 'touchend' || 
      event.pointerType === 'touch' ||
      (event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents) ||
      // Additional check for mobile user agent as fallback
      (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    );
    
    
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
    
    // Handle eraser tool for lines with priority-based deletion
    if (appState.activeTool === TOOLS.ERASER) {
      const deletionTarget = getNextLineDeletionTarget(actualRow, col)

      if (deletionTarget === 'door') {
        // 関数型 setter で最新の doors から削除（高速ドラッグでの連続呼び出しに対応）
        updateCurrentFloorData('doors', (prevDoors) =>
          (prevDoors || []).filter(door =>
            !(door.startRow === actualRow && door.startCol === col)
          )
        )
      } else if (deletionTarget === 'wall') {
        // 同セル・同方向の壁のみ削除（最新の walls 基準）
        updateCurrentFloorData('walls', (prevWalls) =>
          (prevWalls || []).filter(wall => !(
            wall.startRow === actualRow && wall.startCol === col &&
            (isVertical
              ? (wall.endRow === actualRow + 1 && wall.endCol === col)
              : (wall.endRow === actualRow && wall.endCol === col + 1))
          ))
        )
      }
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
        lastLineCellRef.current = { row, col }
        
        // Store initial mouse position for direction detection
        if (event) {
          const rect = event.target.closest('svg').getBoundingClientRect()
          setDragStartMousePos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          })
        }
      } else if (isTouchEvent) {
        // Existing wall found and touch event - delete it (mobile touch improvement)
        const newWalls = floorData.walls.filter((_, index) => index !== existingWallIndex)
        updateCurrentFloorData('walls', newWalls)
      }
      // For PC mouse click on existing wall, do nothing (maintain existing behavior)
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
          // Check if existing door is the same type as current tool
          const existingDoor = floorData.doors[existingDoorIndex]
          
          if (existingDoor.type === appState.activeTool && isTouchEvent) {
            // Same tool type and touch event - delete the existing door (mobile touch improvement)
            const newDoors = floorData.doors.filter((_, index) => index !== existingDoorIndex)
            updateCurrentFloorData('doors', newDoors)
          } else {
            // Different tool type, or PC mouse click - replace existing door with new type
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
    lastLineCellRef.current = { row, col }

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
      // Line tool: Remove walls only（関数型 setter で最新の walls 基準）
      updateCurrentFloorData('walls', (prevWalls) =>
        (prevWalls || []).filter(wall =>
          !(wall.startRow === actualRow && wall.startCol === col &&
            ((isVertical && wall.endRow !== wall.startRow) || (!isVertical && wall.endCol !== wall.startCol)))
        )
      )
    } else if (otherLineTools.includes(appState.activeTool)) {
      // Door tools: Remove doors only（関数型 setter で最新の doors 基準）
      updateCurrentFloorData('doors', (prevDoors) =>
        (prevDoors || []).filter(door =>
          !(door.startRow === actualRow && door.startCol === col)
        )
      )
    }
  }, [appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, updateCurrentFloorData])

  const handleGridClick = useCallback((row, col, _event = null, isDragging = false) => {
    // Ensure coordinates are within bounds
    if (row < 0 || row >= appState.gridSize.rows || col < 0 || col >= appState.gridSize.cols) {
      return;
    }

    // Helper function to get current option for a tool
    const getCurrentOption = (tool) => {
      switch(tool) {
        case TOOLS.SHUTE: return shuteStyle
        case TOOLS.EVENT_MARKER: return eventType
        case TOOLS.ARROW: return arrowDirection
        case TOOLS.DOOR_ITEM: return doorState
        default: return null
      }
    }

    // Helper function to get option from existing item
    const getOptionFromItem = (item, tool) => {
      switch(tool) {
        case TOOLS.SHUTE: return item.shuteStyle || 'filled'
        case TOOLS.EVENT_MARKER: return item.eventType || 'default'
        case TOOLS.ARROW: return item.arrowDirection || item.type.replace('arrow_', '')
        case TOOLS.DOOR_ITEM: return item.doorState || 'closed'
        default: return null
      }
    }

    // Helper function to get next option in cycle
    const getNextOption = (tool, currentOption) => {
      const options = TOOL_OPTIONS[tool]
      if (!options) return null
      
      const currentIndex = options.indexOf(currentOption)
      if (currentIndex === -1) return options[0] // fallback to first option
      
      const nextIndex = (currentIndex + 1) % options.length
      return nextIndex === 0 ? 'DELETE' : options[nextIndex]
    }
    
    // Helper function to detect if the event is from touch (mobile) vs mouse (PC)
    const isTouchEvent = _event && (
      _event.type === 'touchstart' || 
      _event.type === 'touchend' || 
      _event.pointerType === 'touch' ||
      (_event.sourceCapabilities && _event.sourceCapabilities.firesTouchEvents) ||
      // Additional check for mobile user agent as fallback
      (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    );
    
    
    // Don't handle grid clicks if we're in the middle of dragging a note
    if (isDraggingNote) {
      return;
    }
    
    // Don't handle grid clicks if a note drag has been initiated (but not yet in dragging mode)
    // Exception: Allow NOTE tool to proceed for opening dialog
    if (draggedNote && appState.activeTool !== TOOLS.NOTE) {
      return;
    }
    
    // For NOTE tool, always allow grid clicks to proceed - but handle existing notes carefully
    if (appState.activeTool === TOOLS.NOTE && draggedNote) {
      // If note tool is active and we have a dragged note, it means we clicked on an existing note
      // Let the mouseUp handler deal with it - don't open dialog here
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
    
    // Handle eraser tool with priority-based deletion
    if (appState.activeTool === TOOLS.ERASER) {
      const deletionTarget = getNextGridDeletionTarget(actualRow, col)

      if (deletionTarget === 'note') {
        // Remove notes at this position (highest priority)
        deleteNoteAt(actualRow, col)
      } else if (deletionTarget === 'item') {
        // 関数型 setter で最新の items から削除（高速ドラッグでの連続呼び出しに対応）
        updateCurrentFloorData('items', (prevItems) =>
          (prevItems || []).filter(item => !(item.row === actualRow && item.col === col))
        )
      } else if (deletionTarget === 'grid') {
        // isDragging && 同じボタンの ref のみ補間対象
        const prev = lastFillCellRef.current
        const isDragInterpolation = isDragging && prev && prev.button === 0 && (prev.row !== row || prev.col !== col)

        if (isDragInterpolation) {
          const path = cellsBetween(prev.row, prev.col, row, col).slice(1)
          updateCurrentFloorData('grid', (prevGrid) => {
            const newGrid = [...(prevGrid || [])]
            const touchedRows = new Set()
            for (const [dispRow, c] of path) {
              if (dispRow < 0 || dispRow >= appState.gridSize.rows) continue
              if (c < 0 || c >= appState.gridSize.cols) continue
              const aRow = appState.gridSize.rows - 1 - dispRow
              if (!newGrid[aRow]) continue
              if (!touchedRows.has(aRow)) {
                newGrid[aRow] = [...newGrid[aRow]]
                touchedRows.add(aRow)
              }
              newGrid[aRow][c] = null
            }
            return newGrid
          })
        } else if (actualRow >= 0 && actualRow < appState.gridSize.rows) {
          updateCurrentFloorData('grid', (prevGrid) => {
            const newGrid = [...(prevGrid || [])]
            if (!newGrid[actualRow]) return newGrid
            newGrid[actualRow] = [...newGrid[actualRow]]
            newGrid[actualRow][col] = null
            return newGrid
          })
        }
        // 単発はリセット、ドラッグはボタン付きで保存
        lastFillCellRef.current = isDragging ? { button: 0, row, col } : null
      }
      return;
    }
    
    if (appState.activeTool === TOOLS.BLOCK_COLOR || appState.activeTool === TOOLS.DARK_ZONE) {
      // Use gray color for DARK_ZONE, otherwise use selected color
      const colorToUse = appState.activeTool === TOOLS.DARK_ZONE ? '#b0b0b0' : selectedColor

      // isDragging && 同じボタンの ref のみ補間対象（単発・ボタン跨ぎは補間しない）
      const prev = lastFillCellRef.current
      const isDragInterpolation = isDragging && prev && prev.button === 0 && (prev.row !== row || prev.col !== col)

      if (isDragInterpolation) {
        // 高速ドラッグでセルを跨いだ場合：前回セルから現在セルまでの中間を全て塗る（前回セルは前フレームで処理済みなので除く）
        const path = cellsBetween(prev.row, prev.col, row, col).slice(1)
        // 関数型 setter で必ず最新の grid を基準に塗る（連続呼び出しでの上書き消失を防ぐ）
        updateCurrentFloorData('grid', (prevGrid) => {
          const newGrid = [...(prevGrid || [])]
          const touchedRows = new Set()
          for (const [dispRow, c] of path) {
            if (dispRow < 0 || dispRow >= appState.gridSize.rows) continue
            if (c < 0 || c >= appState.gridSize.cols) continue
            const aRow = appState.gridSize.rows - 1 - dispRow
            if (!touchedRows.has(aRow)) {
              newGrid[aRow] = [...(newGrid[aRow] || [])]
              touchedRows.add(aRow)
            }
            newGrid[aRow][c] = colorToUse
          }
          return newGrid
        })
      } else if (actualRow >= 0 && actualRow < appState.gridSize.rows) {
        // 単独クリック / ドラッグの初回セル：従来通り（タッチ同色トグル含む）
        updateCurrentFloorData('grid', (prevGrid) => {
          const newGrid = [...(prevGrid || [])]
          newGrid[actualRow] = [...(newGrid[actualRow] || [])]
          const existingColor = newGrid[actualRow][col]

          // If same color exists and it's a touch event, delete it (mobile touch improvement)
          if (existingColor === colorToUse && isTouchEvent) {
            delete newGrid[actualRow][col]
            // Clean up empty row if needed
            if (Object.keys(newGrid[actualRow]).length === 0) {
              delete newGrid[actualRow]
            }
          } else {
            // Different color, no color, or PC mouse click - apply new color
            newGrid[actualRow][col] = colorToUse
          }
          return newGrid
        })
      }

      // 単発はリセット、ドラッグはボタン付きで保存
      lastFillCellRef.current = isDragging ? { button: 0, row, col } : null
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
            ...(appState.activeTool === TOOLS.DOOR_ITEM && { doorState }),
            ...(appState.activeTool === TOOLS.EVENT_MARKER && { eventType })
          }
          const newItems = [...(floorData.items || []), newItem]
          updateCurrentFloorData('items', newItems)
        } else {
          // Check if current tool has cycling options
          const existingItem = floorData.items[existingItemIndex]
          const currentToolType = appState.activeTool === TOOLS.ARROW ? `arrow_${arrowDirection}` : appState.activeTool
          const hasOptions = TOOL_OPTIONS[appState.activeTool]
          
          // For tools with options, check if same tool + same option for cycling
          if (hasOptions) {
            const isSameTool = (appState.activeTool === TOOLS.ARROW && existingItem.type.startsWith('arrow_')) ||
                              (appState.activeTool !== TOOLS.ARROW && existingItem.type === appState.activeTool)
            
            if (isSameTool) {
              const existingOption = getOptionFromItem(existingItem, appState.activeTool)
              const currentOption = getCurrentOption(appState.activeTool)
              
              // Same tool + same option → cycle to next option
              if (existingOption === currentOption) {
                const nextOption = getNextOption(appState.activeTool, currentOption)
                
                if (nextOption === 'DELETE') {
                  // Delete the item and cycle back to first option
                  const newItems = floorData.items.filter((_, index) => index !== existingItemIndex)
                  updateCurrentFloorData('items', newItems)
                  
                  // Update state to first option for next click
                  const firstOption = TOOL_OPTIONS[appState.activeTool][0]
                  switch(appState.activeTool) {
                    case TOOLS.SHUTE: setShuteStyle(firstOption); break
                    case TOOLS.EVENT_MARKER: setEventType(firstOption); break
                    case TOOLS.ARROW: setArrowDirection(firstOption); break
                    case TOOLS.DOOR_ITEM: setDoorState(firstOption); break
                  }
                } else {
                  // Replace with next option
                  const newItems = [...(floorData.items || [])]
                  newItems[existingItemIndex] = {
                    ...existingItem,
                    type: appState.activeTool === TOOLS.ARROW ? `arrow_${nextOption}` : appState.activeTool,
                    ...(appState.activeTool === TOOLS.SHUTE && { shuteStyle: nextOption }),
                    ...(appState.activeTool === TOOLS.ARROW && { arrowDirection: nextOption, type: `arrow_${nextOption}` }),
                    ...(appState.activeTool === TOOLS.DOOR_ITEM && { doorState: nextOption }),
                    ...(appState.activeTool === TOOLS.EVENT_MARKER && { eventType: nextOption }),
                    id: Date.now() + Math.random()
                  }
                  updateCurrentFloorData('items', newItems)
                  
                  // Update state to match new option
                  switch(appState.activeTool) {
                    case TOOLS.SHUTE: setShuteStyle(nextOption); break
                    case TOOLS.EVENT_MARKER: setEventType(nextOption); break
                    case TOOLS.ARROW: setArrowDirection(nextOption); break
                    case TOOLS.DOOR_ITEM: setDoorState(nextOption); break
                  }
                }
                return // Exit early to prevent normal replacement logic
              }
              // Same tool + different option → continue to normal replacement logic below
            }
          }
          
          // Normal replacement logic for different tools or touch events
          // For arrow tools, also check if it's the same direction
          const isSameArrowType = appState.activeTool === TOOLS.ARROW && 
            existingItem.type === currentToolType
          
          // For other tools, check if type matches exactly
          const isSameType = appState.activeTool !== TOOLS.ARROW && 
            existingItem.type === currentToolType
          
          if ((isSameArrowType || isSameType) && isTouchEvent) {
            // Same tool type and touch event - delete the existing item (mobile touch improvement)
            const newItems = floorData.items.filter((_, index) => index !== existingItemIndex)
            updateCurrentFloorData('items', newItems)
          } else {
            // Different tool type, or PC mouse click - replace existing item with new type
            const newItems = [...(floorData.items || [])]
            newItems[existingItemIndex] = {
              type: currentToolType,
              row: actualRow,
              col,
              id: Date.now() + Math.random(),
              ...(appState.activeTool === TOOLS.WARP_POINT && { warpText }),
              ...(appState.activeTool === TOOLS.SHUTE && { shuteStyle }),
              ...(appState.activeTool === TOOLS.ARROW && { arrowDirection }),
              ...((appState.activeTool === TOOLS.STAIRS_UP_SVG || appState.activeTool === TOOLS.STAIRS_DOWN_SVG) && { stairsText }),
              ...(appState.activeTool === TOOLS.DOOR_ITEM && { doorState }),
              ...(appState.activeTool === TOOLS.EVENT_MARKER && { eventType })
            }
            updateCurrentFloorData('items', newItems)
          }
        }
      }
    }
  }, [appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, floorData.grid, floorData.items, selectedColor, warpText, shuteStyle, arrowDirection, stairsText, doorState, eventType, updateCurrentFloorData, isDraggingNote, draggedNote, getNoteAt, deleteNoteAt, setShuteStyle, setEventType, setArrowDirection, setDoorState])

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

  const handleGridRightClick = useCallback((row, col, isDragging = false) => {
    // Ensure coordinates are within bounds
    if (row < 0 || row >= appState.gridSize.rows || col < 0 || col >= appState.gridSize.cols) {
      return;
    }
    
    const actualRow = appState.gridSize.rows - 1 - row;
    
    // Define tool categories
    const lineTools = ['line'];
    const otherLineTools = ['door_open', 'door_closed', 'line_arrow_north', 'line_arrow_south', 'line_arrow_east', 'line_arrow_west'];
    const fillTools = [TOOLS.BLOCK_COLOR, TOOLS.DARK_ZONE];
    const otherGridTools = ['chest', 'warp_point', 'shute', 'elevator', 'stairs_up_svg', 'stairs_down_svg', 'current_position', 'event_marker', 'note', 'door_item', 'arrow_north', 'arrow_south', 'arrow_east', 'arrow_west', 'arrow'];
    
    if (fillTools.includes(appState.activeTool)) {
      // Fill category: Remove fill color（isDragging && 同じボタンの ref のみ補間対象）
      const prev = lastFillCellRef.current
      const isDragInterpolation = isDragging && prev && prev.button === 2 && (prev.row !== row || prev.col !== col)

      if (isDragInterpolation) {
        const path = cellsBetween(prev.row, prev.col, row, col).slice(1)
        updateCurrentFloorData('grid', (prevGrid) => {
          const newGrid = [...(prevGrid || [])]
          const touchedRows = new Set()
          for (const [dispRow, c] of path) {
            if (dispRow < 0 || dispRow >= appState.gridSize.rows) continue
            if (c < 0 || c >= appState.gridSize.cols) continue
            const aRow = appState.gridSize.rows - 1 - dispRow
            if (!newGrid[aRow]) continue
            if (!touchedRows.has(aRow)) {
              newGrid[aRow] = [...newGrid[aRow]]
              touchedRows.add(aRow)
            }
            newGrid[aRow][c] = null
          }
          return newGrid
        })
      } else if (actualRow >= 0 && actualRow < appState.gridSize.rows) {
        updateCurrentFloorData('grid', (prevGrid) => {
          const newGrid = [...(prevGrid || [])]
          if (!newGrid[actualRow]) return newGrid
          newGrid[actualRow] = [...newGrid[actualRow]]
          newGrid[actualRow][col] = null
          return newGrid
        })
      }

      // 単発はリセット、ドラッグはボタン付きで保存
      lastFillCellRef.current = isDragging ? { button: 2, row, col } : null
    } else if (lineTools.includes(appState.activeTool)) {
      // Line category: Remove walls only
      updateCurrentFloorData('walls', (prevWalls) =>
        (prevWalls || []).filter(wall =>
          !(wall.startRow === actualRow && wall.startCol === col)
        )
      )
    } else if (otherLineTools.includes(appState.activeTool)) {
      // Other Line tools category: Remove doors only
      updateCurrentFloorData('doors', (prevDoors) =>
        (prevDoors || []).filter(door =>
          !(door.startRow === actualRow && door.startCol === col)
        )
      )
    } else if (otherGridTools.includes(appState.activeTool)) {
      // Other Grid tools category: Remove items only
      updateCurrentFloorData('items', (prevItems) =>
        (prevItems || []).filter(item => !(item.row === actualRow && item.col === col))
      )

      // Special case: NOTE tool can delete notes with right-click
      if (appState.activeTool === TOOLS.NOTE) {
        deleteNoteAt(actualRow, col)
      }
    }
  }, [appState.activeTool, appState.gridSize.rows, appState.gridSize.cols, updateCurrentFloorData, deleteNoteAt])

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
        lastLineCellRef.current = null
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
              // 前回処理セルと現在セルの間を補間して全セルに対し handleLineEnter を呼ぶ（高速ドラッグでの抜け防止）
              const prev = lastLineCellRef.current
              if (prev && prev.row === lineY && prev.col !== col) {
                const step = prev.col < col ? 1 : -1
                for (let c = prev.col + step; ; c += step) {
                  if (c >= 0 && c < appState.gridSize.cols) {
                    handleLineEnter(lineY, c, false)
                  }
                  if (c === col) break
                }
              } else {
                handleLineEnter(lineY, col, false)
              }
              lastLineCellRef.current = { row: lineY, col }
            }
          } else if (dragLineType === 'vertical') {
            // For vertical lines, only allow same column as drag start
            const lineX = Math.round((mouseX - offset.x - 24) / cellSize)
            if (lineX === dragStartCol && row >= 0 && row < appState.gridSize.rows && lineX >= 0 && lineX <= appState.gridSize.cols) {
              const prev = lastLineCellRef.current
              if (prev && prev.col === lineX && prev.row !== row) {
                const step = prev.row < row ? 1 : -1
                for (let r = prev.row + step; ; r += step) {
                  if (r >= 0 && r < appState.gridSize.rows) {
                    handleLineEnter(r, lineX, true)
                  }
                  if (r === row) break
                }
              } else {
                handleLineEnter(row, lineX, true)
              }
              lastLineCellRef.current = { row, col: lineX }
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

  // touchmove / touchend は Canvas wrapper の React プロップで受ける。
  // document リスナーにすると、ダイアログ上のタッチも受け取ってしまい、
  // マップが「貫通」して動いたり、ダイアログ内スクロールが preventDefault でキャンセルされる問題が起きる。
  // cell/line click rect を 1 個に集約した現在は、仮想化境界での DOM unmount 問題は解消済みなので
  // React プロップで十分。

  return (
    <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: theme.grid.canvasBackground }}>
      <div
        ref={canvasRef}
        className="w-full h-full"
        onMouseDownCapture={handleMouseDown}
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
          isSingleFingerPanningRef={isSingleFingerPanningRef}
          isPanning={isPanning}
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

      {/* Event type selector */}
      {appState.activeTool === TOOLS.EVENT_MARKER && (
        <div className="absolute bottom-16 right-4 p-2 rounded shadow-lg z-50" style={{ backgroundColor: theme.ui.panel }}>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-8 h-8 rounded border text-center text-xs"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}`, fontSize: '14px', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', fontWeight: 'bold' }}
          >
            <option value="default">!</option>
            <option value="combat">×</option>
            <option value="healing">◎</option>
            <option value="trash">🗑️</option>
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