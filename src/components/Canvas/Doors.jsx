import React from 'react'
import { GRID_SIZE } from '../../utils/constants'

const Doors = ({ doors, zoom, offset, gridSize }) => {
  const cellSize = GRID_SIZE * zoom

  return (
    <div className="absolute inset-0 pointer-events-none">
      {doors.map((door, index) => {
        // Determine if door is on vertical or horizontal line
        const isVertical = door.startCol === door.endCol;
        
        // Determine door style based on type
        const isOpen = door.type === 'door_open';
        const isArrow = door.type?.startsWith('line_arrow_');
        
        let doorStyle;
        let arrowSymbol = '';
        
        if (isArrow) {
          // Arrow doors: no border, just arrow symbol
          doorStyle = { backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${cellSize * 0.5}px`, color: '#000000', fontWeight: 'bold' };
          switch (door.type) {
            case 'line_arrow_north': arrowSymbol = '↑'; break;
            case 'line_arrow_south': arrowSymbol = '↓'; break;
            case 'line_arrow_east': arrowSymbol = '→'; break;
            case 'line_arrow_west': arrowSymbol = '←'; break;
          }
        } else if (isOpen) {
          doorStyle = { backgroundColor: 'transparent', border: '2px solid #000000' };
        } else {
          doorStyle = { backgroundColor: '#000000', border: '1px solid #000000' };
        }
        
        if (isVertical) {
          // Vertical door: centered on vertical line
          const displayRow = gridSize.rows - 1 - door.startRow;
          const centerX = offset.x + door.startCol * cellSize + 24;
          const centerY = offset.y + displayRow * cellSize + 24;
          
          return (
            <div
              key={door.id || index}
              className="absolute"
              style={{
                left: centerX - cellSize * 0.1 + (isOpen ? -2 : isArrow ? -2 : -3),
                top: centerY + cellSize * 0.2 + (isOpen ? 0 : isArrow ? 0 : -2),
                width: isOpen ? cellSize * 0.2 : cellSize * 0.2 + 4,
                height: isOpen ? cellSize * 0.6 : cellSize * 0.6 + 4,
                ...doorStyle,
                borderRadius: '2px'
              }}
            >
              {isArrow && arrowSymbol}
            </div>
          )
        } else {
          // Horizontal door: centered on horizontal line
          const displayRow = gridSize.rows - 1 - door.startRow;
          const centerX = offset.x + door.startCol * cellSize + 24;
          const centerY = offset.y + displayRow * cellSize + 24;
          
          return (
            <div
              key={door.id || index}
              className="absolute"
              style={{
                left: centerX + cellSize * 0.2 + (isOpen ? 0 : isArrow ? 0 : -2),
                top: centerY - cellSize * 0.1 + (isOpen ? -2 : isArrow ? -2 : -3),
                width: isOpen ? cellSize * 0.6 : cellSize * 0.6 + 4,
                height: isOpen ? cellSize * 0.2 : cellSize * 0.2 + 4,
                ...doorStyle,
                borderRadius: '2px'
              }}
            >
              {isArrow && arrowSymbol}
            </div>
          )
        }
      })}
    </div>
  )
}

export default Doors