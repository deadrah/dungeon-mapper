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
  [TOOLS.NOTE]: 'N',
  [TOOLS.DOOR]: '┤',
  [TOOLS.ARROW_NORTH]: '↑',
  [TOOLS.ARROW_SOUTH]: '↓',
  [TOOLS.ARROW_EAST]: '→',
  [TOOLS.ARROW_WEST]: '←'
}

const Items = ({ items, zoom, offset, gridSize, onUpdateItem }) => {
  const cellSize = GRID_SIZE * zoom
  const [editingNote, setEditingNote] = useState(null)
  const [noteText, setNoteText] = useState('')

  const handleNoteClick = (item, index) => {
    if (item.type === TOOLS.NOTE) {
      setEditingNote(index)
      setNoteText(item.note || '')
    }
  }

  const handleNoteSave = (item, index) => {
    if (onUpdateItem) {
      onUpdateItem(index, { ...item, note: noteText })
    }
    setEditingNote(null)
    setNoteText('')
  }

  const handleNoteCancel = () => {
    setEditingNote(null)
    setNoteText('')
  }

  return (
    <div className="absolute inset-0">
      {items.map((item, index) => {
        const isNote = item.type === TOOLS.NOTE
        const isEditing = editingNote === index
        
        return (
          <div key={index} className="relative">
            <div
              className={`absolute flex items-center justify-center text-black font-bold ${
                isNote ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'
              }`}
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
              onClick={() => handleNoteClick(item, index)}
              title={isNote && item.note ? item.note : undefined}
            >
              {item.type === TOOLS.DARK_ZONE ? '' : (ITEM_ICONS[item.type] || '?')}
            </div>
            
            {/* Note editing tooltip */}
            {isEditing && (
              <div
                className="absolute bg-white border border-gray-300 rounded shadow-lg p-2 z-50"
                style={{
                  left: offset.x + item.col * cellSize + 24 + cellSize,
                  top: offset.y + (gridSize.rows - 1 - item.row) * cellSize + 24,
                  minWidth: '200px'
                }}
              >
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="メモを入力..."
                  className="w-full h-20 p-1 border border-gray-300 rounded text-sm resize-none"
                  autoFocus
                />
                <div className="flex justify-end space-x-1 mt-2">
                  <button
                    onClick={() => handleNoteSave(item, index)}
                    className="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded text-xs"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleNoteCancel}
                    className="bg-gray-500 hover:bg-gray-400 text-white px-2 py-1 rounded text-xs"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Items