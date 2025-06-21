import React, { useState } from 'react'
import { GRID_SIZE, TOOLS } from '../../utils/constants'

const ITEM_ICONS = {
  [TOOLS.STAIRS_UP]: '↑',
  [TOOLS.STAIRS_DOWN]: '↓',
  [TOOLS.CHEST]: '□',
  [TOOLS.DARK_ZONE]: '●',
  [TOOLS.WARP_POINT]: '◊',
  [TOOLS.SHUTE]: '○',
  [TOOLS.ELEVATOR]: 'E',
  [TOOLS.STAIRS_UP_SVG]: '↑',
  [TOOLS.STAIRS_DOWN_SVG]: '↓',
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
    // Special rendering for SVG stairs
    if (item.type === TOOLS.STAIRS_UP_SVG) {
      return (
        <svg width={cellSize * 0.8} height={cellSize * 0.8} viewBox="0 0 20 20" fill="none">
          <path d="M2 18 L18 18 L18 15 L15 15 L15 12 L12 12 L12 9 L9 9 L9 6 L6 6 L6 3 L3 3 L3 6 L6 6 L6 9 L9 9 L9 12 L12 12 L12 15 L15 15 L15 18" stroke="#000" strokeWidth="1" fill="#ccc"/>
        </svg>
      )
    }
    
    if (item.type === TOOLS.STAIRS_DOWN_SVG) {
      return (
        <svg width={cellSize * 0.8} height={cellSize * 0.8} viewBox="0 0 20 20" fill="none">
          <path d="M18 2 L2 2 L2 5 L5 5 L5 8 L8 8 L8 11 L11 11 L11 14 L14 14 L14 17 L17 17 L17 14 L14 14 L14 11 L11 11 L11 8 L8 8 L8 5 L5 5 L5 2" stroke="#000" strokeWidth="1" fill="#ccc"/>
        </svg>
      )
    }
    
    // Default text rendering
    return ITEM_ICONS[item.type] || '?'
  }

  return (
    <div className="absolute inset-0" style={{ zIndex: 7, pointerEvents: 'none' }}>
      {items.map((item, index) => {
        // Special styling for elevator
        const isElevator = item.type === TOOLS.ELEVATOR
        const textColor = item.type === TOOLS.EVENT_MARKER ? '#ca0101' : 
                         isElevator ? '#ffff00' : 'black'
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