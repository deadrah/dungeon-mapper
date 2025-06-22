import React from 'react'
import { GRID_SIZE, TOOLS } from '../../utils/constants'

const Grid = ({ 
  gridSize, 
  zoom, 
  offset, 
  viewportSize,
  floorData,
  onGridClick,
  onGridRightClick,
  onLineClick,
  onLineRightClick,
  onLineEnter,
  activeTool,
  isDraggingLine,
  dragLineType,
  dragStartRow,
  dragStartCol,
  isTwoFingerActive
}) => {
  const cellSize = GRID_SIZE * zoom

  const startCol = Math.max(0, Math.floor(-offset.x / cellSize))
  const endCol = Math.min(gridSize.cols, Math.ceil((-offset.x + viewportSize.width) / cellSize))
  const startRow = Math.max(0, Math.floor(-offset.y / cellSize))
  const endRow = Math.min(gridSize.rows, Math.ceil((-offset.y + viewportSize.height) / cellSize))

  const handleCellClick = (e, row, col) => {
    e.preventDefault()
    if (e.button === 0) {
      onGridClick(row, col, e)
    } else if (e.button === 2) {
      onGridRightClick(row, col)
    }
  }


  const handleCellMouseEnter = (e, row, col) => {
    if (e.buttons === 1) { // Left mouse button is pressed
      onGridClick(row, col, e)
    } else if (e.buttons === 2) { // Right mouse button is pressed
      onGridRightClick(row, col)
    }
  }

  const handleCellMouseOver = (e, row, col) => {
    if (e.buttons === 1) { // Left mouse button is pressed
      onGridClick(row, col, e)
    } else if (e.buttons === 2) { // Right mouse button is pressed
      onGridRightClick(row, col)
    }
  }

  const handleLineClick = (e, row, col, isVertical) => {
    e.preventDefault()
    if (e.button === 0) {
      onLineClick(row, col, isVertical, e)
    } else if (e.button === 2) {
      onLineRightClick(row, col, isVertical, e)
    }
  }

  const handleLineEnter = (e, row, col, isVertical) => {
    if (e.buttons === 1) { // Left mouse button is pressed
      onLineEnter(row, col, isVertical)
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Row headers */}
      <div className="absolute left-0 top-0 z-10 bg-gray-100 border-r">
        {Array.from({ length: endRow - startRow }, (_, i) => startRow + i).map(row => {
          const displayRow = gridSize.rows - 1 - row;
          return (
            <div
              key={`row-header-${row}`}
              className="text-xs text-gray-600 px-1 border-b flex items-center justify-center font-mono"
              style={{
                position: 'absolute',
                top: offset.y + row * cellSize + 24,
                height: cellSize,
                width: '24px',
                fontSize: Math.max(8, Math.min(12, cellSize * 0.3))
              }}
            >
              {displayRow < 10 ? `0${displayRow}` : displayRow}
            </div>
          );
        })}
      </div>

      {/* Column headers */}
      <div className="absolute left-0 top-0 z-10 bg-gray-100 border-b">
        {Array.from({ length: endCol - startCol }, (_, i) => startCol + i).map(col => (
          <div
            key={`col-header-${col}`}
            className="text-xs text-gray-600 py-1 border-r flex items-center justify-center font-mono"
            style={{
              position: 'absolute',
              left: offset.x + col * cellSize + 24,
              width: cellSize,
              height: '24px',
              fontSize: Math.max(8, Math.min(12, cellSize * 0.3))
            }}
          >
            {col < 10 ? `0${col}` : col}
          </div>
        ))}
      </div>

      {/* Right row headers */}
      <div className="absolute left-0 top-0 z-10 bg-gray-100 border-l">
        {Array.from({ length: endRow - startRow }, (_, i) => startRow + i).map(row => {
          const displayRow = gridSize.rows - 1 - row;
          return (
            <div
              key={`row-header-right-${row}`}
              className="text-xs text-gray-600 px-1 border-b flex items-center justify-center font-mono"
              style={{
                position: 'absolute',
                left: offset.x + gridSize.cols * cellSize + 24,
                top: offset.y + row * cellSize + 24,
                height: cellSize,
                width: '24px',
                fontSize: Math.max(8, Math.min(12, cellSize * 0.3))
              }}
            >
              {displayRow < 10 ? `0${displayRow}` : displayRow}
            </div>
          );
        })}
      </div>

      {/* Bottom column headers */}
      <div className="absolute z-10 bg-gray-100 border-t" style={{ top: offset.y + gridSize.rows * cellSize + 24 }}>
        {Array.from({ length: endCol - startCol }, (_, i) => startCol + i).map(col => (
          <div
            key={`col-header-bottom-${col}`}
            className="text-xs text-gray-600 py-1 border-r flex items-center justify-center font-mono"
            style={{
              position: 'absolute',
              left: offset.x + col * cellSize + 24,
              width: cellSize,
              height: '24px',
              fontSize: Math.max(8, Math.min(12, cellSize * 0.3))
            }}
          >
            {col < 10 ? `0${col}` : col}
          </div>
        ))}
      </div>

      {/* Corner decorations */}
      {/* Top-left corner */}
      <div 
        className="absolute z-10 bg-gray-200 border-r border-b" 
        style={{
          left: offset.x,
          top: offset.y,
          width: '24px',
          height: '24px'
        }}
      />
      
      {/* Top-right corner */}
      <div 
        className="absolute z-10 bg-gray-200 border-l border-b" 
        style={{
          left: offset.x + gridSize.cols * cellSize + 24,
          top: offset.y,
          width: '24px',
          height: '24px'
        }}
      />
      
      {/* Bottom-left corner */}
      <div 
        className="absolute z-10 bg-gray-200 border-r border-t" 
        style={{
          left: offset.x,
          top: offset.y + gridSize.rows * cellSize + 24,
          width: '24px',
          height: '24px'
        }}
      />
      
      {/* Bottom-right corner */}
      <div 
        className="absolute z-10 bg-gray-200 border-l border-t" 
        style={{
          left: offset.x + gridSize.cols * cellSize + 24,
          top: offset.y + gridSize.rows * cellSize + 24,
          width: '24px',
          height: '24px'
        }}
      />

      <svg
        width={viewportSize.width}
        height={viewportSize.height}
        className="absolute inset-0"
        style={{ pointerEvents: 'auto', zIndex: 5 }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Grid lines */}
        <defs>
          <pattern
            id="grid"
            width={cellSize}
            height={cellSize}
            patternUnits="userSpaceOnUse"
            x={offset.x + 24}
            y={offset.y + 24}
          >
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke="#999"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        
        {/* Grid background */}
        <rect
          x={offset.x + 24}
          y={offset.y + 24}
          width={gridSize.cols * cellSize}
          height={gridSize.rows * cellSize}
          fill="#d7e2f6"
        />
        
        {/* Grid pattern overlay */}
        <rect
          x={offset.x + 24}
          y={offset.y + 24}
          width={gridSize.cols * cellSize}
          height={gridSize.rows * cellSize}
          fill="url(#grid)"
        />

        {/* Grid cells with colors */}
        {floorData.grid.map((row, rowIndex) =>
          row.map((cellColor, colIndex) => {
            if (cellColor && rowIndex < gridSize.rows && colIndex < gridSize.cols) {
              const displayRow = gridSize.rows - 1 - rowIndex;
              return (
                <rect
                  key={`${rowIndex}-${colIndex}`}
                  x={offset.x + colIndex * cellSize + 24}
                  y={offset.y + displayRow * cellSize + 24}
                  width={cellSize}
                  height={cellSize}
                  fill={cellColor}
                  stroke="#999"
                  strokeWidth="1"
                />
              )
            }
            return null
          })
        )}

        {/* Grid cell clickable areas - only for non-line tools (eraser works on both) */}
        {(activeTool !== TOOLS.LINE && activeTool !== TOOLS.DOOR_OPEN && activeTool !== TOOLS.DOOR_CLOSED && 
          activeTool !== TOOLS.LINE_ARROW_NORTH && activeTool !== TOOLS.LINE_ARROW_SOUTH &&
          activeTool !== TOOLS.LINE_ARROW_EAST && activeTool !== TOOLS.LINE_ARROW_WEST) && 
         Array.from({ length: Math.min(endRow - startRow, gridSize.rows) }, (_, i) => startRow + i).map(row =>
          Array.from({ length: Math.min(endCol - startCol, gridSize.cols) }, (_, i) => startCol + i).map(col => {
            if (row >= gridSize.rows || col >= gridSize.cols) return null;
            return (
              <rect
                key={`click-${row}-${col}`}
                x={offset.x + col * cellSize + 24}
                y={offset.y + row * cellSize + 24}
                width={cellSize}
                height={cellSize}
                fill="transparent"
                style={{ 
                  pointerEvents: isTwoFingerActive ? 'none' : 'all',
                  cursor: 'pointer',
                  touchAction: 'manipulation'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCellClick(e, row, col)
                }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  handleCellClick(e, row, col)
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onGridRightClick(row, col)
                }}
                onMouseEnter={(e) => handleCellMouseEnter(e, row, col)}
                onMouseOver={(e) => handleCellMouseOver(e, row, col)}
              />
            )
          })
        )}

        {/* Line tool clickable areas (includes eraser) */}
        {(activeTool === 'line' || activeTool === 'door_open' || activeTool === 'door_closed' || 
          activeTool === 'line_arrow_north' || activeTool === 'line_arrow_south' ||
          activeTool === 'line_arrow_east' || activeTool === 'line_arrow_west' || activeTool === TOOLS.ERASER) && (
          <>
            {/* Horizontal line areas */}
            {(!isDraggingLine || dragLineType === 'horizontal') && Array.from({ length: Math.min(endRow - startRow + 1, gridSize.rows + 1) }, (_, i) => startRow + i).map(row =>
              Array.from({ length: Math.min(endCol - startCol, gridSize.cols) }, (_, i) => startCol + i).map(col => {
                // Allow horizontal lines at gridSize.rows (top boundary line)
                if (row > gridSize.rows || col >= gridSize.cols) return null;
                
                // During horizontal line dragging, only enable areas in the same row
                const isEnabled = !isDraggingLine || (dragLineType === 'horizontal' && row === dragStartRow);
                
                return (
                  <rect
                    key={`h-line-${row}-${col}`}
                    x={offset.x + col * cellSize + 24}
                    y={offset.y + row * cellSize + 24 - 6}
                    width={cellSize}
                    height={12}
                    fill="transparent"
                    onMouseDown={isEnabled ? (e) => handleLineClick(e, row, col, false) : undefined}
                    onContextMenu={isEnabled ? (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onLineRightClick(row, col, false, e)
                    } : undefined}
                    onMouseEnter={isEnabled ? (e) => handleLineEnter(e, row, col, false) : undefined}
                    style={{ 
                      cursor: isEnabled ? 'url(data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="2" fill="black"/></svg>) 8 8, crosshair' : 'default',
                      pointerEvents: (isEnabled && !isTwoFingerActive) ? 'auto' : 'none',
                      touchAction: 'manipulation'
                    }}
                  />
                )
              })
            )}

            {/* Vertical line areas */}
            {(!isDraggingLine || dragLineType === 'vertical') && Array.from({ length: Math.min(endRow - startRow, gridSize.rows) }, (_, i) => startRow + i).map(row =>
              Array.from({ length: Math.min(endCol - startCol + 1, gridSize.cols + 1) }, (_, i) => startCol + i).map(col => {
                if (row >= gridSize.rows || col > gridSize.cols) return null;
                
                // During vertical line dragging, only enable areas in the same column
                const isEnabled = !isDraggingLine || (dragLineType === 'vertical' && col === dragStartCol);
                
                return (
                  <rect
                    key={`v-line-${row}-${col}`}
                    x={offset.x + col * cellSize + 24 - 6}
                    y={offset.y + row * cellSize + 24}
                    width={12}
                    height={cellSize}
                    fill="transparent"
                    onMouseDown={isEnabled ? (e) => handleLineClick(e, row, col, true) : undefined}
                    onContextMenu={isEnabled ? (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onLineRightClick(row, col, true, e)
                    } : undefined}
                    onMouseEnter={isEnabled ? (e) => handleLineEnter(e, row, col, true) : undefined}
                    style={{ 
                      cursor: isEnabled ? 'url(data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="2" fill="black"/></svg>) 8 8, crosshair' : 'default',
                      pointerEvents: (isEnabled && !isTwoFingerActive) ? 'auto' : 'none',
                      touchAction: 'manipulation'
                    }}
                  />
                )
              })
            )}
          </>
        )}
      </svg>
    </div>
  )
}

export default Grid