import React from 'react'
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
  [TOOLS.DOOR_ITEM]: '🚪',
  [TOOLS.ARROW_NORTH]: '↑',
  [TOOLS.ARROW_SOUTH]: '↓',
  [TOOLS.ARROW_EAST]: '→',
  [TOOLS.ARROW_WEST]: '←',
  [TOOLS.ARROW_ROTATE]: '⟲'
}

const Items = ({ 
  items = [], 
  notes = [], 
  zoom, 
  offset, 
  gridSize, 
  showNoteTooltips = true, 
  theme,
  isDraggingNote = false,
  draggedNote = null,
  dragHoverCell = null,
  dragCurrentPos = null
}) => {
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
              fontSize: Math.max(10, cellSize * 0.40),
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '1',
              textShadow: '0 0 3px rgba(0,0,0,1)',
              top: '50%',
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
    
    // Special rendering for Door Item with SVG
    if (item.type === TOOLS.DOOR_ITEM) {
      const isOpen = item.doorState === 'open'
      return (
        <svg width={cellSize * 0.8} height={cellSize * 0.8} viewBox="0 0 24 24" fill="none">
          {isOpen ? (
            // Open door SVG
            <>
              <rect x="1" y="2" width="2" height="20" fill="#666"/>
              <rect x="19" y="2" width="2" height="20" fill="#666"/>
              <rect x="3" y="2" width="16" height="20" fill="#333"/>
              <line x1="3" y1="2" x2="3" y2="22" stroke="#aaa" strokeWidth="2"/>
              <line x1="19" y1="2" x2="19" y2="22" stroke="#aaa" strokeWidth="2"/>
            </>
          ) : (
            // Closed door SVG
            <>
              <rect x="1" y="2" width="2" height="20" fill="#666"/>
              <rect x="19" y="2" width="2" height="20" fill="#666"/>
              <rect x="3" y="2" width="8" height="20" fill="#ccc"/>
              <rect x="11" y="2" width="8" height="20" fill="#ccc"/>
              <line x1="11" y1="2" x2="11" y2="22" stroke="#999" strokeWidth="1"/>
              <circle cx="9" cy="12" r="0.5" fill="#666"/>
              <circle cx="13" cy="12" r="0.5" fill="#666"/>
            </>
          )}
        </svg>
      )
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
              fontSize: Math.max(8, cellSize * 0.4),
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '1',
              textShadow: '0 0 4px rgba(0,0,0,1)',
              top: '60%',
              left: '62%',
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
      {/* Drag hover cell highlight */}
      {isDraggingNote && dragHoverCell && (
        <div
          style={{
            position: 'absolute',
            left: offset.x + dragHoverCell.col * cellSize + 24,
            top: offset.y + (gridSize.rows - 1 - dragHoverCell.row) * cellSize + 24,
            width: cellSize,
            height: cellSize,
            backgroundColor: notes.find(note => note.row === dragHoverCell.row && note.col === dragHoverCell.col) 
              ? `${theme.items.teleport}40` // Semi-transparent teleport color for occupied cells
              : `${theme.items.arrow}40`, // Semi-transparent arrow color (blue) for empty cells
            border: '2px solid ' + (notes.find(note => note.row === dragHoverCell.row && note.col === dragHoverCell.col) 
              ? theme.items.teleport : theme.items.arrow),
            pointerEvents: 'none',
            zIndex: 16
          }}
        />
      )}
      
      {/* Dragged note ghost */}
      {isDraggingNote && draggedNote && dragCurrentPos && (
        <div
          style={{
            position: 'fixed',
            left: dragCurrentPos.x - cellSize / 2,
            top: dragCurrentPos.y - cellSize / 2,
            width: cellSize,
            height: cellSize,
            pointerEvents: 'none',
            zIndex: 1000,
            opacity: 0.7
          }}
        >
          {/* Ghost triangle */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 0,
              height: 0,
              borderLeft: `${cellSize * 0.25}px solid ${theme.items.noteTriangle}`,
              borderBottom: `${cellSize * 0.25}px solid transparent`,
              opacity: 0.8
            }}
          />
          {/* Ghost tooltip */}
          <div
            className="rounded px-1 py-1 shadow-lg"
            style={{
              position: 'absolute',
              left: cellSize / 2,
              top: cellSize / 2,
              fontSize: '8px',
              whiteSpace: 'nowrap',
              maxWidth: `${cellSize * 2}px`,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              backgroundColor: theme.items.note,
              borderColor: theme.items.noteBorder,
              border: `1px solid ${theme.items.noteBorder}`,
              color: theme.items.noteBorder,
              transform: 'translate(-50%, -50%)',
              opacity: 0.8
            }}
          >
            {draggedNote.text.length > 7 ? `${draggedNote.text.slice(0, 7)}...` : draggedNote.text}
          </div>
        </div>
      )}
      
      {/* New note system - rendered first so they appear behind items */}
      {notes.map((note, index) => {
        // Hide the note being dragged
        const isBeingDragged = isDraggingNote && draggedNote && 
          note.row === draggedNote.row && note.col === draggedNote.col
        
        if (isBeingDragged) return null
        
        return (
        <div key={`note-${index}`} className="absolute pointer-events-auto" style={{ zIndex: 14 }}>
          {/* Red triangle in top-left corner */}
          <div
            style={{
              position: 'absolute',
              left: offset.x + note.col * cellSize + 24,
              top: offset.y + (gridSize.rows - 1 - note.row) * cellSize + 24,
              width: 0,
              height: 0,
              borderLeft: `${cellSize * 0.25}px solid ${theme.items.noteTriangle}`,
              borderBottom: `${cellSize * 0.25}px solid transparent`,
              pointerEvents: 'none'
            }}
          />
          {/* Invisible clickable area covering the entire cell */}
          <div
            style={{
              position: 'absolute',
              left: offset.x + note.col * cellSize + 24,
              top: offset.y + (gridSize.rows - 1 - note.row) * cellSize + 24,
              width: cellSize,
              height: cellSize,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
            data-note-row={note.row}
            data-note-col={note.col}
            title={showNoteTooltips ? note.text : ''}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
          {/* Custom tooltip for notes */}
          {showNoteTooltips && note.text && (
            <div
              className="rounded shadow-lg"
              style={{
                position: 'absolute',
                left: offset.x + note.col * cellSize + 24 + cellSize / 2,
                top: offset.y + (gridSize.rows - 1 - note.row) * cellSize + 24 + cellSize / 2,
                padding: '2px 4px',
                fontSize: '9px',
                whiteSpace: 'nowrap',
                maxWidth: `${cellSize * 2}px`,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                zIndex: 100,
                backgroundColor: theme.items.note,
                borderColor: theme.items.noteBorder,
                border: `1px solid ${theme.items.noteBorder}`,
                color: theme.items.noteBorder,
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)'
              }}
              title={note.text}
            >
              {note.text.length > 7 ? `${note.text.slice(0, 7)}...` : note.text}
            </div>
          )}
        </div>
        )
      })}
      
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