import React from 'react'
import { GRID_SIZE } from '../../utils/constants'

const Walls = ({ walls, zoom, offset, gridSize }) => {
  const cellSize = GRID_SIZE * zoom

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        {walls.map((wall, index) => {
          // For vertical lines (startCol === endCol), we need different coordinate handling
          const isVertical = wall.startCol === wall.endCol;
          
          if (isVertical) {
            // Vertical line: startRow and endRow represent the grid line positions
            const displayRow = gridSize.rows - 1 - wall.startRow;
            return (
              <line
                key={wall.id || index}
                x1={offset.x + wall.startCol * cellSize + 24}
                y1={offset.y + displayRow * cellSize + 24}
                x2={offset.x + wall.endCol * cellSize + 24}
                y2={offset.y + (displayRow + 1) * cellSize + 24}
                stroke="#000000"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )
          } else {
            // Horizontal line: use normal coordinate transformation
            const displayRow = gridSize.rows - 1 - wall.startRow;
            return (
              <line
                key={wall.id || index}
                x1={offset.x + wall.startCol * cellSize + 24}
                y1={offset.y + displayRow * cellSize + 24}
                x2={offset.x + wall.endCol * cellSize + 24}
                y2={offset.y + displayRow * cellSize + 24}
                stroke="#000000"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )
          }
        })}
      </svg>
    </div>
  )
}

export default Walls