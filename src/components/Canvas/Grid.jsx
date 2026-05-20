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
  isTwoFingerActive,
  isSingleFingerPanningRef,
  isPanning,
  theme
}) => {
  const cellSize = GRID_SIZE * zoom

  // 通常の仮想化。 cell click rect を 1 個に集約したので touch target が個別 rect から外れた → 仮想化境界跨ぎでの DOM 変動は touch session に影響しない。
  const startCol = Math.max(0, Math.floor(-offset.x / cellSize))
  const endCol = Math.min(gridSize.cols, Math.ceil((-offset.x + viewportSize.width) / cellSize))
  const startRow = Math.max(0, Math.floor(-offset.y / cellSize))
  const endRow = Math.min(gridSize.rows, Math.ceil((-offset.y + viewportSize.height) / cellSize))

  // 第4引数の isDragging で「単発クリック」と「ドラッグ中のセル通過」を区別する。
  // ドラッグ判定が真のときだけ Canvas 側で Bresenham 補間が走る。

  // 集約された 1 個の cell click rect 上のイベントから row/col を逆算する。
  // SVG 全体は親 <g> で translate(offset.x, offset.y) しているので、 ローカル座標は (clientX - svgLeft - offset.x - 24) / cellSize。
  const pickCellFromEvent = (e) => {
    const svgEl = e.currentTarget.ownerSVGElement || e.currentTarget
    const svgRect = svgEl.getBoundingClientRect()
    const localX = e.clientX - svgRect.left - offset.x - 24
    const localY = e.clientY - svgRect.top - offset.y - 24
    const col = Math.floor(localX / cellSize)
    const row = Math.floor(localY / cellSize)
    if (row < 0 || row >= gridSize.rows || col < 0 || col >= gridSize.cols) return null
    return { row, col }
  }

  const handleCellAreaMouseDown = (e) => {
    e.stopPropagation()
    const cell = pickCellFromEvent(e)
    if (!cell) return
    e.preventDefault()
    if (e.button === 0) {
      onGridClick(cell.row, cell.col, e, false)
    } else if (e.button === 2) {
      onGridRightClick(cell.row, cell.col, false)
    }
  }

  const handleCellAreaMouseMove = (e) => {
    if (isPanning || isSingleFingerPanningRef?.current) return
    if (e.buttons !== 1 && e.buttons !== 2) return
    const cell = pickCellFromEvent(e)
    if (!cell) return
    if (e.buttons === 1) {
      onGridClick(cell.row, cell.col, e, true)
    } else if (e.buttons === 2) {
      onGridRightClick(cell.row, cell.col, true)
    }
  }

  const handleCellAreaContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const cell = pickCellFromEvent(e)
    if (!cell) return
    onGridRightClick(cell.row, cell.col, false)
  }

  // line clickable area も集約。 イベント座標から最寄りライン（row, col, isVertical）を逆算する。
  // 既存の個別 12px rect と同じヒット範囲（±6px）で判定。
  const pickLineFromEvent = (e) => {
    const svgEl = e.currentTarget.ownerSVGElement || e.currentTarget
    const svgRect = svgEl.getBoundingClientRect()
    const localX = e.clientX - svgRect.left - offset.x - 24
    const localY = e.clientY - svgRect.top - offset.y - 24
    const col = Math.floor(localX / cellSize)
    const row = Math.floor(localY / cellSize)
    if (row < 0 || row >= gridSize.rows || col < 0 || col >= gridSize.cols) return null
    const fracX = localX - col * cellSize
    const fracY = localY - row * cellSize
    const HIT = 6
    const distTop = fracY
    const distBottom = cellSize - fracY
    const distLeft = fracX
    const distRight = cellSize - fracX
    const minDist = Math.min(distTop, distBottom, distLeft, distRight)
    if (minDist > HIT) return null
    if (minDist === distTop) return { row, col, isVertical: false }
    if (minDist === distBottom) return { row: row + 1, col, isVertical: false }
    if (minDist === distLeft) return { row, col, isVertical: true }
    return { row, col: col + 1, isVertical: true }
  }

  // ドラッグ中の方向制約（既存挙動と同じ）：dragLineType が決まっていれば、 その方向のラインのみ受け付ける
  const respectsDragLineType = (line) => {
    if (!isDraggingLine || !dragLineType) return true
    if (dragLineType === 'horizontal') return !line.isVertical
    return line.isVertical
  }

  const handleLineAreaMouseDown = (e) => {
    const line = pickLineFromEvent(e)
    if (!line) return
    if (!respectsDragLineType(line)) return
    e.preventDefault()
    if (e.button === 0) {
      onLineClick(line.row, line.col, line.isVertical, e)
    } else if (e.button === 2) {
      onLineRightClick(line.row, line.col, line.isVertical, e)
    }
  }

  const handleLineAreaMouseMove = (e) => {
    if (isPanning || isSingleFingerPanningRef?.current) return
    if (e.buttons !== 1 && e.buttons !== 2) return
    const line = pickLineFromEvent(e)
    if (!line) return
    if (!respectsDragLineType(line)) return
    // ドラッグ中の通過：handleLineEnter 経由（line ドラッグの補間は Canvas 側）
    onLineEnter(line.row, line.col, line.isVertical)
  }

  const handleLineAreaContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const line = pickLineFromEvent(e)
    if (!line) return
    if (!respectsDragLineType(line)) return
    onLineRightClick(line.row, line.col, line.isVertical, e)
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Row headers */}
      <div className="absolute left-0 top-0 z-10 border-r" style={{ backgroundColor: theme.header.background, borderColor: theme.header.border, touchAction: 'none' }}>
        {Array.from({ length: endRow - startRow }, (_, i) => startRow + i).map((row, index) => {
          const displayRow = gridSize.rows - 1 - row;
          const isLast = index === endRow - startRow - 1;
          return (
            <div
              key={`row-header-${row}`}
              className={`text-xs px-1 flex items-center justify-center font-mono ${isLast ? '' : 'border-b'}`}
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
      <div className="absolute left-0 top-0 z-10 border-b" style={{ backgroundColor: theme.header.background, borderColor: theme.header.border, touchAction: 'none' }}>
        {Array.from({ length: endCol - startCol }, (_, i) => startCol + i).map((col, index) => {
          const isLast = index === endCol - startCol - 1;
          return (
            <div
              key={`col-header-${col}`}
              className={`text-xs py-1 flex items-center justify-center font-mono ${isLast ? '' : 'border-r'}`}
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
          );
        })}
      </div>

      {/* Right row headers */}
      <div className="absolute left-0 top-0 z-10 border-l" style={{ backgroundColor: theme.header.background, borderColor: theme.header.border, touchAction: 'none' }}>
        {Array.from({ length: endRow - startRow }, (_, i) => startRow + i).map((row, index) => {
          const displayRow = gridSize.rows - 1 - row;
          const isLast = index === endRow - startRow - 1;
          return (
            <div
              key={`row-header-right-${row}`}
              className={`text-xs px-1 flex items-center justify-center font-mono ${isLast ? '' : 'border-b'}`}
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
      <div className="absolute z-10 border-t" style={{ top: offset.y + gridSize.rows * cellSize + 24, backgroundColor: theme.header.background, borderColor: theme.header.border, touchAction: 'none' }}>
        {Array.from({ length: endCol - startCol }, (_, i) => startCol + i).map((col, index) => {
          const isLast = index === endCol - startCol - 1;
          return (
            <div
              key={`col-header-bottom-${col}`}
              className={`text-xs py-1 flex items-center justify-center font-mono ${isLast ? '' : 'border-r'}`}
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
          );
        })}
      </div>


      <svg
        width={viewportSize.width}
        height={viewportSize.height}
        className="absolute inset-0"
        style={{ pointerEvents: 'auto', zIndex: 5 }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/*
          全 SVG 要素を 1 つの <g> でラップし、 offset 反映はこの transform 属性 1 個だけにする。
          内部の rect/line の x/y/x1/x2/y1/y2 属性は不変 → setOffset で DOM 更新が起きない → panning 軽量化。
          副次効果として、 touch target だった rect の DOM 属性が変動しないので touch session も安定する。
        */}
        <g transform={`translate(${offset.x}, ${offset.y})`}>
        {/* Grid background */}
        <rect
          x={24}
          y={24}
          width={gridSize.cols * cellSize}
          height={gridSize.rows * cellSize}
          fill={theme.grid.background}
        />

        {/* Grid lines - draw directly instead of using pattern */}
        {/* Vertical lines */}
        {Array.from({ length: gridSize.cols + 1 }, (_, i) => {
          const x = Math.round(24 + i * cellSize) - 0.5
          return (
            <line
              key={`v-line-${i}`}
              x1={x}
              y1={24}
              x2={x}
              y2={Math.round(24 + gridSize.rows * cellSize)}
              stroke={theme.grid.lines}
              strokeWidth="1"
              shapeRendering="crispEdges"
            />
          )
        })}


        {/* Horizontal lines */}
        {Array.from({ length: gridSize.rows + 1 }, (_, i) => {
          const y = Math.round(24 + i * cellSize) - 0.5
          return (
            <line
              key={`h-line-${i}`}
              x1={24}
              y1={y}
              x2={Math.round(24 + gridSize.cols * cellSize)}
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
                  x={colIndex * cellSize + 23.5}
                  y={displayRow * cellSize + 23.5}
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

        {/*
          Grid cell clickable area – grid 系ツール（非 line/door/arrow）選択時に表示する。
          以前は 1 セル毎に個別 rect を配置していたが、性能と touch session 安定のため 1 個の大 rect に集約。
          イベントの clientX/Y から pickCellFromEvent で row/col を逆算する。
          ドラッグ通過は onMouseMove で受け、Canvas 側の Bresenham 補間で間のセルを補う。
        */}
        {(activeTool !== TOOLS.LINE && activeTool !== TOOLS.DOOR_OPEN && activeTool !== TOOLS.DOOR_CLOSED &&
          activeTool !== TOOLS.LINE_ARROW_NORTH && activeTool !== TOOLS.LINE_ARROW_SOUTH &&
          activeTool !== TOOLS.LINE_ARROW_EAST && activeTool !== TOOLS.LINE_ARROW_WEST) && (
          <rect
            key="cell-click-area"
            x={24}
            y={24}
            width={gridSize.cols * cellSize}
            height={gridSize.rows * cellSize}
            fill="transparent"
            style={{
              pointerEvents: isTwoFingerActive ? 'none' : 'all',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
            onMouseDown={handleCellAreaMouseDown}
            onMouseMove={handleCellAreaMouseMove}
            onContextMenu={handleCellAreaContextMenu}
          />
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
                x={col * cellSize + 24}
                y={row * cellSize + 24}
                width={cellSize}
                height={cellSize}
                fill="transparent"
                style={{
                  pointerEvents: isTwoFingerActive ? 'none' : 'all',
                  cursor: 'pointer',
                  touchAction: 'manipulation'
                }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  if (e.button === 0) {
                    onGridClick(row, col, e, false)
                  } else if (e.button === 2) {
                    onGridRightClick(row, col, false)
                  }
                }}
              />
            )
          })
        )}

        {/* Line tool clickable areas (includes eraser) */}
        {/*
          Line 系ツール（line, door, arrow, eraser）の line clickable area。
          以前は (rows+1)×cols + rows×(cols+1) の個別 rect を配置していたが、 仮想化境界跨ぎでの DOM unmount が touch session を断つため、
          1 個の大 rect に集約して pickLineFromEvent で最寄りライン（±6px）を逆算する形に変更。
        */}
        {(activeTool === 'line' || activeTool === 'door_open' || activeTool === 'door_closed' ||
          activeTool === 'line_arrow_north' || activeTool === 'line_arrow_south' ||
          activeTool === 'line_arrow_east' || activeTool === 'line_arrow_west' || activeTool === TOOLS.ERASER) && (
          <rect
            key="line-click-area"
            x={24}
            y={24}
            width={gridSize.cols * cellSize}
            height={gridSize.rows * cellSize}
            fill="transparent"
            style={{
              cursor: 'url(data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="2" fill="black"/></svg>) 8 8, crosshair',
              pointerEvents: isTwoFingerActive ? 'none' : 'auto',
              touchAction: 'manipulation'
            }}
            onMouseDown={handleLineAreaMouseDown}
            onMouseMove={handleLineAreaMouseMove}
            onContextMenu={handleLineAreaContextMenu}
          />
        )}
        </g>
      </svg>
    </div>
  )
}

export default Grid