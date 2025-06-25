import React from 'react'
import { GRID_SIZE, TOOLS } from '../../utils/constants'

const Grid = ({ 
  gridSize, 
  zoom, 
  offset, 
  viewportSize,
  floorData = { grid: [], walls: [], items: [], doors: [] },
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
  isTwoFingerActive,
  isSingleFingerPanning,
  theme
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
      <div className="absolute left-0 top-0 z-10 border-r" style={{ backgroundColor: theme.header.background, borderColor: theme.header.border }}>
        {Array.from({ length: endRow - startRow }, (_, i) => startRow + i).map((row, index) => {
          const displayRow = gridSize.rows - 1 - row;
          const isFirst = index === 0;
          return (
            <div
              key={`row-header-${row}`}
              className={`text-xs px-1 border-b flex items-center justify-center font-mono ${isFirst ? 'border-t' : ''}`}
              style={{
                position: 'absolute',
                top: Math.round(offset.y + row * cellSize + 24),
                height: cellSize,
                width: '24px',
                fontSize: Math.max(8, Math.min(12, cellSize * 0.3)),
                color: theme.header.text,
                borderColor: theme.header.border
              }}
            >
              {displayRow < 10 ? `0${displayRow}` : displayRow}
            </div>
          );
        })}
      </div>

      {/* Column headers */}
      <div className="absolute left-0 top-0 z-10 border-b" style={{ backgroundColor: theme.header.background, borderColor: theme.header.border }}>
        {Array.from({ length: endCol - startCol }, (_, i) => startCol + i).map((col, index) => (
          <div
            key={`col-header-${col}`}
            className={`text-xs py-1 border-r flex items-center justify-center font-mono ${index === 0 ? 'border-l' : ''}`}
            style={{
              position: 'absolute',
              left: Math.round(offset.x + col * cellSize + 24),
              width: cellSize,
              height: '24px',
              fontSize: Math.max(8, Math.min(12, cellSize * 0.3)),
              color: theme.header.text,
              borderColor: theme.header.border
            }}
          >
            {col < 10 ? `0${col}` : col}
          </div>
        ))}
      </div>

      {/* Right row headers */}
      <div className="absolute left-0 top-0 z-10 border-l" style={{ backgroundColor: theme.header.background, borderColor: theme.header.border }}>
        {Array.from({ length: endRow - startRow }, (_, i) => startRow + i).map((row, index) => {
          const displayRow = gridSize.rows - 1 - row;
          const isFirst = index === 0;
          return (
            <div
              key={`row-header-right-${row}`}
              className={`text-xs px-1 border-b flex items-center justify-center font-mono ${isFirst ? 'border-t' : ''}`}
              style={{
                position: 'absolute',
                left: offset.x + gridSize.cols * cellSize + 24,
                top: offset.y + row * cellSize + 24,
                height: cellSize,
                width: '24px',
                fontSize: Math.max(8, Math.min(12, cellSize * 0.3)),
                color: theme.header.text,
                borderColor: theme.header.border
              }}
            >
              {displayRow < 10 ? `0${displayRow}` : displayRow}
            </div>
          );
        })}
      </div>

      {/* Bottom column headers */}
      <div className="absolute z-10 border-t" style={{ top: offset.y + gridSize.rows * cellSize + 24, backgroundColor: theme.header.background, borderColor: theme.header.border }}>
        {Array.from({ length: endCol - startCol }, (_, i) => startCol + i).map((col, index) => (
          <div
            key={`col-header-bottom-${col}`}
            className={`text-xs py-1 border-r flex items-center justify-center font-mono ${index === 0 ? 'border-l' : ''}`}
            style={{
              position: 'absolute',
              left: Math.round(offset.x + col * cellSize + 24),
              width: cellSize,
              height: '24px',
              fontSize: Math.max(8, Math.min(12, cellSize * 0.3)),
              color: theme.header.text,
              borderColor: theme.header.border
            }}
          >
            {col < 10 ? `0${col}` : col}
          </div>
        ))}
      </div>

      {/* Corner decorations */}
      {/* Top-left corner */}
      <div 
        className="absolute z-10" 
        style={{
          left: offset.x,
          top: offset.y,
          width: '24px',
          height: '24px',
          backgroundColor: theme.header.corner
        }}
      />
      
      {/* Top-right corner */}
      <div 
        className="absolute z-10" 
        style={{
          left: offset.x + gridSize.cols * cellSize + 24,
          top: offset.y,
          width: '24px',
          height: '24px',
          backgroundColor: theme.header.corner
        }}
      />
      
      {/* Bottom-left corner */}
      <div 
        className="absolute z-10" 
        style={{
          left: offset.x,
          top: offset.y + gridSize.rows * cellSize + 24,
          width: '24px',
          height: '24px',
          backgroundColor: theme.header.corner
        }}
      />
      
      {/* Bottom-right corner */}
      <div 
        className="absolute z-10" 
        style={{
          left: offset.x + gridSize.cols * cellSize + 24,
          top: offset.y + gridSize.rows * cellSize + 24,
          width: '24px',
          height: '24px',
          backgroundColor: theme.header.corner
        }}
      />

      <svg
        width={viewportSize.width}
        height={viewportSize.height}
        className="absolute inset-0"
        style={{ pointerEvents: 'auto', zIndex: 5 }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Grid background */}
        <rect
          x={Math.round(offset.x + 24)}
          y={Math.round(offset.y + 24)}
          width={gridSize.cols * cellSize}
          height={gridSize.rows * cellSize}
          fill={theme.grid.background}
        />
        
        {/* Grid lines - draw directly instead of using pattern */}
        {/* Vertical lines */}
        {Array.from({ length: gridSize.cols + 1 }, (_, i) => {
          const x = Math.round(offset.x + 24 + i * cellSize) - 0.5
          return (
            <line
              key={`v-line-${i}`}
              x1={x}
              y1={Math.round(offset.y + 24)}
              x2={x}
              y2={Math.round(offset.y + 24 + gridSize.rows * cellSize)}
              stroke={theme.grid.lines}
              strokeWidth="1"
              shapeRendering="crispEdges"
            />
          )
        })}
        
        
        {/* Horizontal lines */}
        {Array.from({ length: gridSize.rows + 1 }, (_, i) => {
          const y = Math.round(offset.y + 24 + i * cellSize) - 0.5
          return (
            <line
              key={`h-line-${i}`}
              x1={Math.round(offset.x + 24)}
              y1={y}
              x2={Math.round(offset.x + 24 + gridSize.cols * cellSize)}
              y2={y}
              stroke={theme.grid.lines}
              strokeWidth="1"
              shapeRendering="crispEdges"
            />
          )
        })}
        

        {/* Grid cells with colors */}
        {floorData && floorData.grid && floorData.grid.map((row, rowIndex) =>
          row && row.map((cellColor, colIndex) => {
            if (cellColor && rowIndex < gridSize.rows && colIndex < gridSize.cols) {
              const displayRow = gridSize.rows - 1 - rowIndex;
              return (
                <rect
                  key={`${rowIndex}-${colIndex}`}
                  x={offset.x + colIndex * cellSize + 23.5}
                  y={offset.y + displayRow * cellSize + 23.5}
                  width={cellSize}
                  height={cellSize}
                  fill={cellColor}
                  stroke={theme.grid.cellBorder}
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
                  pointerEvents: (isTwoFingerActive || isSingleFingerPanning) ? 'none' : 'all',
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

        {/* Note clickable areas for line tools - allow clicking existing notes */}
        {(activeTool === TOOLS.LINE || activeTool === TOOLS.DOOR_OPEN || activeTool === TOOLS.DOOR_CLOSED || 
          activeTool === TOOLS.LINE_ARROW_NORTH || activeTool === TOOLS.LINE_ARROW_SOUTH ||
          activeTool === TOOLS.LINE_ARROW_EAST || activeTool === TOOLS.LINE_ARROW_WEST) && 
         Array.from({ length: Math.min(endRow - startRow, gridSize.rows) }, (_, i) => startRow + i).map(row =>
          Array.from({ length: Math.min(endCol - startCol, gridSize.cols) }, (_, i) => startCol + i).map(col => {
            if (row >= gridSize.rows || col >= gridSize.cols) return null;
            
            // Only create clickable area if there's a note at this position
            // Note: Items use inverted row coordinates (gridSize.rows - 1 - item.row)
            const displayRow = gridSize.rows - 1 - row;
            const hasNote = (floorData.items || []).some(item => 
              item.row === displayRow && item.col === col && item.type === TOOLS.NOTE
            );
            
            if (!hasNote) return null;
            
            return (
              <rect
                key={`note-click-line-${row}-${col}`}
                x={offset.x + col * cellSize + 24}
                y={offset.y + row * cellSize + 24}
                width={cellSize}
                height={cellSize}
                fill="transparent"
                style={{ 
                  pointerEvents: (isTwoFingerActive || isSingleFingerPanning) ? 'none' : 'all',
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
                      pointerEvents: (isEnabled && !isTwoFingerActive && !isSingleFingerPanning) ? 'auto' : 'none',
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
                      pointerEvents: (isEnabled && !isTwoFingerActive && !isSingleFingerPanning) ? 'auto' : 'none',
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