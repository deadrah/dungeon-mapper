import React, { useState } from 'react'
import { GRID_SIZE, TOOLS } from '../../utils/constants'

const ITEM_ICONS = {
  [TOOLS.STAIRS_UP]: '↑',
  [TOOLS.STAIRS_DOWN]: '↓',
  [TOOLS.CHEST]: '□',
  [TOOLS.DARK_ZONE]: '●',
  [TOOLS.WARP_POINT]: '◊',
  [TOOLS.SHUTE]: '●',
  [TOOLS.ELEVATOR]: 'E',
  [TOOLS.STAIRS_UP_SVG]: '▲',
  [TOOLS.STAIRS_DOWN_SVG]: '▼',
  [TOOLS.CURRENT_POSITION]: '●',
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
    // Special rendering for Chest with SVG
    if (item.type === TOOLS.CHEST) {
      return (
        <svg width={cellSize * 0.8} height={cellSize * 0.8} viewBox="0 0 24 24" fill="none">
          {/* Chest base */}
          <rect x="4" y="12" width="16" height="8" stroke="#8B4513" strokeWidth="1.5" fill="none" rx="1"/>
          {/* Chest lid */}
          <path d="M4 12 Q4 8 12 8 Q20 8 20 12" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
          {/* Chest lock */}
          <circle cx="12" cy="12" r="1.5" stroke="#FFD700" strokeWidth="1" fill="#FFD700"/>
          {/* Chest hinges */}
          <rect x="6" y="11" width="1" height="2" fill="#654321"/>
          <rect x="17" y="11" width="1" height="2" fill="#654321"/>
        </svg>
      )
    }
    
    // Default text rendering
    return ITEM_ICONS[item.type] || '?'
  }

  return (
    <div className="absolute inset-0" style={{ zIndex: 7, pointerEvents: 'none' }}>
      {items.map((item, index) => {
        // Special styling for different items
        const isElevator = item.type === TOOLS.ELEVATOR
        const isStairs = item.type === TOOLS.STAIRS_UP_SVG || item.type === TOOLS.STAIRS_DOWN_SVG
        const isChest = item.type === TOOLS.CHEST
        const isCurrentPosition = item.type === TOOLS.CURRENT_POSITION
        
        let textColor = 'black'
        let fontSize = Math.max(12, cellSize * 0.6)
        
        if (item.type === TOOLS.EVENT_MARKER) {
          textColor = '#ca0101'
        } else if (isElevator) {
          textColor = '#b8860b'  // Dark goldenrod - darker yellow for better visibility
        } else if (isStairs) {
          textColor = '#0000ff'
        } else if (isChest) {
          textColor = '#ff8c00'  // Dark orange
        } else if (isCurrentPosition) {
          textColor = '#dc143c'  // Crimson red
          fontSize = Math.max(8, cellSize * 0.4)  // Smaller size for current position
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
              fontSize: fontSize,
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