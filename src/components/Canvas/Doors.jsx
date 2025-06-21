import React from 'react'
import { GRID_SIZE } from '../../utils/constants'

const Doors = ({ doors, zoom, offset, gridSize }) => {
  const cellSize = GRID_SIZE * zoom

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 12 }}>
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
          doorStyle = { backgroundColor: '#d0d0d0', border: '2px solid #000000' };
        } else {
          doorStyle = { backgroundColor: '#000000', border: '2px solid #000000' };
        }
        
        if (isVertical) {
          // Vertical door: centered on vertical line
          const displayRow = gridSize.rows - 1 - door.startRow;
          const centerX = offset.x + door.startCol * cellSize + 24;
          const centerY = offset.y + displayRow * cellSize + 24;
          const doorWidth = cellSize * 0.2;
          const doorHeight = cellSize * 0.4;
          
          return (
            <div
              key={door.id || index}
              className="absolute"
              style={{
                left: centerX - doorWidth / 2,
                top: centerY + cellSize * 0.3,
                width: doorWidth,
                height: doorHeight,
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
          const doorWidth = cellSize * 0.4;
          const doorHeight = cellSize * 0.2;
          
          return (
            <div
              key={door.id || index}
              className="absolute"
              style={{
                left: centerX + cellSize * 0.3,
                top: centerY - doorHeight / 2,
                width: doorWidth,
                height: doorHeight,
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