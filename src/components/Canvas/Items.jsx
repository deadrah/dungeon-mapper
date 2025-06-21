import React, { useState } from 'react'
import { GRID_SIZE, TOOLS } from '../../utils/constants'

const ITEM_ICONS = {
  [TOOLS.STAIRS_UP]: '↑',
  [TOOLS.STAIRS_DOWN]: '↓',
  [TOOLS.CHEST]: '□',
  [TOOLS.DARK_ZONE]: '●',
  [TOOLS.WARP_POINT]: '◊',
  [TOOLS.PIT_TRAP]: '○',
  [TOOLS.EVENT_MARKER]: '!',
  [TOOLS.DOOR]: '┤',
  [TOOLS.ARROW_NORTH]: '↑',
  [TOOLS.ARROW_SOUTH]: '↓',
  [TOOLS.ARROW_EAST]: '→',
  [TOOLS.ARROW_WEST]: '←'
}

const Items = ({ items, zoom, offset, gridSize }) => {
  const cellSize = GRID_SIZE * zoom

  return (
    <div className="absolute inset-0" style={{ zIndex: 7, pointerEvents: 'none' }}>
      {items.map((item, index) => (
        <div
          key={index}
          className="absolute flex items-center justify-center text-black font-bold pointer-events-none"
          style={{
            left: offset.x + item.col * cellSize + 24,
            top: offset.y + (gridSize.rows - 1 - item.row) * cellSize + 24,
            width: cellSize,
            height: cellSize,
            fontSize: Math.max(12, cellSize * 0.6),
            backgroundColor: item.type === TOOLS.DARK_ZONE ? 'rgba(0,0,0,0.3)' : 'transparent',
            color: item.type === TOOLS.DARK_ZONE ? 'white' : 
                   item.type === TOOLS.EVENT_MARKER ? '#ca0101' : 'black'
          }}
        >
          {item.type === TOOLS.DARK_ZONE ? '' : (ITEM_ICONS[item.type] || '?')}
        </div>
      ))}
    </div>
  )
}

export default Items