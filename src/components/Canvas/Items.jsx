import React, { useState } from 'react'
import { GRID_SIZE, TOOLS } from '../../utils/constants'

const ITEM_ICONS = {
  [TOOLS.STAIRS_UP]: '↑',
  [TOOLS.STAIRS_DOWN]: '↓',
  [TOOLS.CHEST]: '🧰',
  [TOOLS.DARK_ZONE]: '●',
  [TOOLS.WARP_POINT]: '◊',
  [TOOLS.SHUTE]: '●',
  [TOOLS.ELEVATOR]: 'E',
  [TOOLS.STAIRS_UP_SVG]: '▲',
  [TOOLS.STAIRS_DOWN_SVG]: '▼',
  [TOOLS.EVENT_MARKER]: '!',
  [TOOLS.NOTE]: '📝',
  [TOOLS.DOOR]: '┤',
  [TOOLS.ARROW_NORTH]: '↑',
  [TOOLS.ARROW_SOUTH]: '↓',
  [TOOLS.ARROW_EAST]: '→',
  [TOOLS.ARROW_WEST]: '←'
}

const Items = ({ items, zoom, offset, gridSize }) => {
  const cellSize = GRID_SIZE * zoom

  const renderItem = (item) => {
    // Default text rendering
    return ITEM_ICONS[item.type] || '?'
  }

  return (
    <div className="absolute inset-0" style={{ zIndex: 7, pointerEvents: 'none' }}>
      {items.map((item, index) => {
        // Special styling for different items
        const isElevator = item.type === TOOLS.ELEVATOR
        const isStairs = item.type === TOOLS.STAIRS_UP_SVG || item.type === TOOLS.STAIRS_DOWN_SVG
        
        let textColor = 'black'
        if (item.type === TOOLS.EVENT_MARKER) {
          textColor = '#ca0101'
        } else if (isElevator) {
          textColor = '#ffff00'
        } else if (isStairs) {
          textColor = '#0000ff'
        }
        
        const fontWeight = isElevator ? '900' : 'bold'
        
        return (
          <div
            key={index}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: offset.x + item.col * cellSize + 24,
              top: offset.y + (gridSize.rows - 1 - item.row) * cellSize + 24,
              width: cellSize,
              height: cellSize,
              fontSize: Math.max(12, cellSize * 0.6),
              backgroundColor: 'transparent',
              color: textColor,
              fontWeight: fontWeight
            }}
          >
            {renderItem(item)}
          </div>
        )
      })}
    </div>
  )
}

export default Items