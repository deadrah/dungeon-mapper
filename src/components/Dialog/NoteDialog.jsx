import React, { useState, useEffect } from 'react'

const NoteDialog = ({ isOpen, onClose, onSave, onDelete, initialText = '', theme }) => {
  const [text, setText] = useState(initialText)

  useEffect(() => {
    if (isOpen) {
      setText(initialText)
    }
  }, [isOpen, initialText])

  const handleSave = () => {
    onSave(text)
    onClose()
  }

  const handleCancel = () => {
    setText(initialText)
    onClose()
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleCancel}
    >
      <div 
        className="rounded-lg p-6 w-96 max-w-full mx-4"
        style={{ backgroundColor: theme?.ui?.panel || '#ffffff' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: theme?.ui?.panelText || '#000000' }}>メモを入力</h2>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="メモを入力してください..."
          className="w-full h-32 p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: theme?.ui?.background || '#ffffff',
            color: theme?.ui?.text || '#374151',
            border: `1px solid ${theme?.ui?.border || '#d1d5db'}`
          }}
          autoFocus
        />
        
        <div className="flex justify-between mt-4">
          {/* Left side - Delete button (only show if there's initial text) */}
          <div>
            {initialText && onDelete && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded transition-colors"
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#b91c1c'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#dc2626'
                }}
              >
                削除
              </button>
            )}
          </div>
          
          {/* Right side - Cancel and Save buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded transition-colors"
              style={{
                backgroundColor: theme?.ui?.button || '#f3f4f6',
                color: theme?.ui?.panelText || '#374151'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme?.ui?.buttonHover || '#e5e7eb'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = theme?.ui?.button || '#f3f4f6'
              }}
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded transition-colors"
              style={{
                backgroundColor: theme?.ui?.buttonActive || '#3b82f6',
                color: theme?.ui?.panelText || '#ffffff'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme?.ui?.buttonActiveHover || '#2563eb'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = theme?.ui?.buttonActive || '#3b82f6'
              }}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDialog