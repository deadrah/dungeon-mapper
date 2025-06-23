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
  [TOOLS.ARROW_WEST]: '←',
  [TOOLS.ARROW_ROTATE]: '⟲'
}

const Items = ({ items = [], zoom, offset, gridSize, showNoteTooltips = true }) => {
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
    
    // Special rendering for Warp Point with text
    if (item.type === TOOLS.WARP_POINT) {
      return (
        <div style={{ 
          position: 'relative', 
          width: cellSize, 
          height: cellSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Diamond background */}
          <div style={{
            position: 'absolute',
            fontSize: Math.max(12, cellSize * 0.8),
            color: '#4bdcff'
          }}>
            ◊
          </div>
          {/* Text overlay */}
          {item.warpText && (
            <div style={{
              position: 'absolute',
              fontSize: Math.max(10, cellSize * 0.45),
              color: '#0c4b5b',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '1'
            }}>
              {item.warpText}
            </div>
          )}
        </div>
      )
    }
    
    // Special rendering for Shute with style options
    if (item.type === TOOLS.SHUTE) {
      const icon = item.shuteStyle === 'outline' ? '○' : '●'
      return icon
    }
    
    // Default text rendering
    return ITEM_ICONS[item.type] || '?'
  }

  return (
    <div className="absolute inset-0" style={{ zIndex: 15, pointerEvents: 'none' }}>
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
        
        const fontWeight = isElevator ? '900' : (item.type === TOOLS.ARROW_ROTATE ? 'normal' : 'bold')
        
        return (
          <div key={index} className="absolute pointer-events-none">
            {/* Main item */}
            <div
              className="flex items-center justify-center"
              style={{
                left: offset.x + item.col * cellSize + 24,
                top: offset.y + (gridSize.rows - 1 - item.row) * cellSize + 24,
                width: cellSize,
                height: cellSize,
                fontSize: fontSize,
                backgroundColor: 'transparent',
                color: textColor,
                fontWeight: fontWeight,
                position: 'absolute'
              }}
            >
              {renderItem(item)}
            </div>
            
            {/* Tooltip for notes */}
            {item.type === TOOLS.NOTE && showNoteTooltips && item.text && (
              <div
                className="bg-yellow-100 border border-yellow-300 rounded px-2 py-1 text-black shadow-lg"
                style={{
                  position: 'absolute',
                  left: offset.x + item.col * cellSize + 14,
                  top: offset.y + (gridSize.rows - 1 - item.row) * cellSize + 20,
                  fontSize: '8px',
                  whiteSpace: 'nowrap',
                  maxWidth: `${cellSize * 2}px`,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  zIndex: 100
                }}
                title={item.text}
              >
                {item.text.length > 6 ? `${item.text.slice(0, 6)}...` : item.text}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Items