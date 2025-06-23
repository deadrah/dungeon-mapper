import React from 'react'
import { GRID_SIZE } from '../../utils/constants'

const Doors = ({ doors = [], zoom, offset, gridSize }) => {
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
        
        if (isArrow) {
          // Arrow doors: no border, just arrow SVG
          doorStyle = { backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' };
        } else if (isOpen) {
          doorStyle = { backgroundColor: '#ffffff', border: '2px solid #000000' };
        } else {
          doorStyle = { backgroundColor: '#000000', border: '2px solid #000000' };
        }
        
        if (isVertical) {
          // Vertical door: centered on vertical line (use coordinate transformation)
          const displayRow = gridSize.rows - 1 - door.startRow;
          const centerX = offset.x + door.startCol * cellSize + 24;
          const centerY = offset.y + displayRow * cellSize + 24;
          const doorWidth = isArrow ? cellSize * 0.5 : cellSize * 0.2;
          const doorHeight = isArrow ? cellSize * 0.5 : cellSize * 0.4;
          
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
              {isArrow && (
                <svg 
                  width={doorWidth * 2} 
                  height={doorHeight * 2} 
                  viewBox="0 0 20 20" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {door.type === 'line_arrow_north' && (
                    <path d="M10 1 L6 6 L8.5 6 L8.5 19 L11.5 19 L11.5 6 L14 6 Z" fill="#345dd1" stroke="#345dd1" strokeWidth="1"/>
                  )}
                  {door.type === 'line_arrow_south' && (
                    <path d="M10 19 L14 14 L11.5 14 L11.5 1 L8.5 1 L8.5 14 L6 14 Z" fill="#345dd1" stroke="#345dd1" strokeWidth="1"/>
                  )}
                  {door.type === 'line_arrow_east' && (
                    <path d="M19 10 L14 6 L14 8.5 L1 8.5 L1 11.5 L14 11.5 L14 14 Z" fill="#345dd1" stroke="#345dd1" strokeWidth="1"/>
                  )}
                  {door.type === 'line_arrow_west' && (
                    <path d="M1 10 L6 14 L6 11.5 L19 11.5 L19 8.5 L6 8.5 L6 6 Z" fill="#345dd1" stroke="#345dd1" strokeWidth="1"/>
                  )}
                </svg>
              )}
            </div>
          )
        } else {
          // Horizontal door: centered on horizontal line (no coordinate transformation)
          const displayRow = door.startRow;
          const centerX = offset.x + door.startCol * cellSize + 24;
          const centerY = offset.y + displayRow * cellSize + 24;
          const doorWidth = isArrow ? cellSize * 0.5 : cellSize * 0.4;
          const doorHeight = isArrow ? cellSize * 0.5 : cellSize * 0.2;
          
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
              {isArrow && (
                <svg 
                  width={doorWidth * 2} 
                  height={doorHeight * 2} 
                  viewBox="0 0 20 20" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {door.type === 'line_arrow_north' && (
                    <path d="M10 1 L6 6 L8.5 6 L8.5 19 L11.5 19 L11.5 6 L14 6 Z" fill="#345dd1" stroke="#345dd1" strokeWidth="1"/>
                  )}
                  {door.type === 'line_arrow_south' && (
                    <path d="M10 19 L14 14 L11.5 14 L11.5 1 L8.5 1 L8.5 14 L6 14 Z" fill="#345dd1" stroke="#345dd1" strokeWidth="1"/>
                  )}
                  {door.type === 'line_arrow_east' && (
                    <path d="M19 10 L14 6 L14 8.5 L1 8.5 L1 11.5 L14 11.5 L14 14 Z" fill="#345dd1" stroke="#345dd1" strokeWidth="1"/>
                  )}
                  {door.type === 'line_arrow_west' && (
                    <path d="M1 10 L6 14 L6 11.5 L19 11.5 L19 8.5 L6 8.5 L6 6 Z" fill="#345dd1" stroke="#345dd1" strokeWidth="1"/>
                  )}
                </svg>
              )}
            </div>
          )
        }
      })}
    </div>
  )
}

export default Doors