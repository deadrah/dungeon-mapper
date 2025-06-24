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

const Items = ({ items = [], zoom, offset, gridSize, showNoteTooltips = true, theme }) => {
  const cellSize = GRID_SIZE * zoom

  const renderItem = (item) => {
    // Special rendering for Chest with SVG
    if (item.type === TOOLS.CHEST) {
      return (
        <svg width={cellSize * 0.8} height={cellSize * 0.8} viewBox="0 0 24 24" fill="none">
          {/* Chest base */}
          <rect x="4" y="12" width="16" height="8" stroke={theme.items.chest} strokeWidth="1.5" fill="none" rx="1"/>
          {/* Chest lid */}
          <path d="M4 12 Q4 8 12 8 Q20 8 20 12" stroke={theme.items.chest} strokeWidth="1.5" fill="none"/>
          {/* Chest lock */}
          <circle cx="12" cy="12" r="1.5" stroke={theme.items.chest} strokeWidth="1" fill={theme.items.chest}/>
          {/* Chest hinges */}
          <rect x="6" y="11" width="1" height="2" fill={theme.items.chest}/>
          <rect x="17" y="11" width="1" height="2" fill={theme.items.chest}/>
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
            fontSize: Math.max(12, cellSize * 0.7),
            color: theme.items.teleport
          }}>
            ◆
          </div>
          {/* Text overlay */}
          {item.warpText && (
            <div style={{
              position: 'absolute',
              fontSize: Math.max(10, cellSize * 0.45),
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '1',
              textShadow: '0 0 4px rgba(0,0,0,1)',
              top: '45%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
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
    
    // Special rendering for Stairs with SVG and text overlay
    if (item.type === TOOLS.STAIRS_UP_SVG || item.type === TOOLS.STAIRS_DOWN_SVG) {
      const isUp = item.type === TOOLS.STAIRS_UP_SVG
      return (
        <div style={{ 
          position: 'relative', 
          width: cellSize, 
          height: cellSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Stairs SVG */}
          <svg 
            width={cellSize * 0.7} 
            height={cellSize * 0.7} 
            viewBox="0 0 100 100"
          >
            {isUp ? (
              // Up stairs SVG (from up.svg)
              <g>
                <rect width="100" height="100" fill="transparent" />
                <rect x="10" y="70" width="19" height="20" fill="gray" />
                <rect x="30" y="50" width="19" height="40" fill="gray" />
                <rect x="50" y="30" width="19" height="60" fill="gray" />
                <rect x="70" y="10" width="19" height="80" fill="gray" />
              </g>
            ) : (
              // Down stairs SVG (from down.svg)
              <g>
                <rect width="100" height="100" fill="#333" />
                <rect x="10" y="10" width="18" height="80" fill="#eee" />
                <rect x="30" y="25" width="18" height="65" fill="#ccc" />
                <rect x="50" y="40" width="18" height="50" fill="#aaa" />
                <rect x="70" y="55" width="18" height="35" fill="#888" />
              </g>
            )}
          </svg>
          {/* Text overlay */}
          {item.stairsText && (
            <div style={{
              position: 'absolute',
              fontSize: Math.max(8, cellSize * 0.5),
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '1',
              textShadow: '0 0 4px rgba(0,0,0,1)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
              {item.stairsText}
            </div>
          )}
        </div>
      )
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
        
        let textColor = theme.items.note || 'black'
        let fontSize = Math.max(12, cellSize * 0.6)
        
        if (item.type === TOOLS.EVENT_MARKER) {
          textColor = theme.items.event
        } else if (isElevator) {
          textColor = theme.items.elevator
        } else if (isStairs) {
          textColor = theme.items.stairs
        } else if (isChest) {
          textColor = theme.items.chest
        } else if (isCurrentPosition) {
          textColor = theme.items.currentPosition
          fontSize = Math.max(8, cellSize * 0.4)  // Smaller size for current position
        } else if (item.type === TOOLS.SHUTE) {
          textColor = theme.items.shute
        } else if (item.type === TOOLS.ARROW || item.type === TOOLS.ARROW_NORTH || item.type === TOOLS.ARROW_SOUTH || item.type === TOOLS.ARROW_EAST || item.type === TOOLS.ARROW_WEST || item.type === TOOLS.ARROW_ROTATE) {
          textColor = theme.items.arrow
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
                className="rounded px-2 py-1 shadow-lg"
                style={{
                  position: 'absolute',
                  left: offset.x + item.col * cellSize + 14,
                  top: offset.y + (gridSize.rows - 1 - item.row) * cellSize + 20,
                  fontSize: '8px',
                  whiteSpace: 'nowrap',
                  maxWidth: `${cellSize * 2}px`,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  zIndex: 100,
                  backgroundColor: theme.items.note,
                  borderColor: theme.items.noteBorder,
                  border: `1px solid ${theme.items.noteBorder}`,
                  color: theme.items.noteBorder
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