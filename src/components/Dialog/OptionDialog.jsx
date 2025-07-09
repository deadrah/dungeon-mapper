import React, { useRef, useState, useEffect } from 'react'
import { getMessage } from '../../utils/messages'
import { getThemeOptions } from '../../utils/themes'

const OptionDialog = ({
  isOpen,
  onClose,
  onExport,
  onImport,
  onResetAllDungeons,
  language,
  onLanguageChange,
  theme,
  themeName,
  onThemeChange
}) => {
  const modalRef = useRef(null)
  const mouseDownInsideRef = useRef(false)

  // Handle mouse events to prevent modal closing on drag selections
  useEffect(() => {
    if (!isOpen) return

    const handleMouseDown = (e) => {
      if (modalRef.current?.contains(e.target)) {
        mouseDownInsideRef.current = true
      } else {
        mouseDownInsideRef.current = false
      }
    }

    const handleMouseUp = (e) => {
      const clickedOutside = !modalRef.current?.contains(e.target)

      if (clickedOutside && !mouseDownInsideRef.current) {
        onClose()
      }

      mouseDownInsideRef.current = false
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isOpen, onClose])
  const handleExport = () => {
    onExport()
    onClose()
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        onImport(file)
      }
    }
    input.click()
    onClose()
  }

  const handleResetAllDungeons = () => {
    const message = getMessage(language, 'resetAllDungeonsConfirm')
    if (window.confirm(message)) {
      onResetAllDungeons()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        ref={modalRef}
        className="rounded-lg p-6 w-80 max-w-full mx-4"
        style={{ backgroundColor: theme.ui.panel }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: theme.ui.panelText }}>
          {getMessage(language, 'option')}
        </h2>
        
        <div className="space-y-4">
          {/* Theme Selection */}
          <div className="border-b pb-4" style={{ borderColor: theme.ui.border }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: theme.ui.panelText }}>
              {getMessage(language, 'theme')}
            </h3>
            <select
              value={themeName}
              onChange={(e) => onThemeChange(e.target.value)}
              className="w-full px-3 py-2 rounded text-sm"
              style={{ 
                backgroundColor: theme.ui.input, 
                color: theme.ui.inputText, 
                border: `1px solid ${theme.ui.border}` 
              }}
            >
              {getThemeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selection */}
          <div className="border-b pb-4" style={{ borderColor: theme.ui.border }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: theme.ui.panelText }}>
              {getMessage(language, 'language')}
            </h3>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full px-3 py-2 rounded text-sm"
              style={{ 
                backgroundColor: theme.ui.input, 
                color: theme.ui.inputText, 
                border: `1px solid ${theme.ui.border}` 
              }}
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Data Backup Section */}
          <div className="border-b pb-4" style={{ borderColor: theme.ui.border }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: theme.ui.menuSectionHeading }}>
              {getMessage(language, 'allDataBackup')}
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                {getMessage(language, 'exportAllData')}
              </button>
              
              <button
                onClick={handleImport}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                {getMessage(language, 'importAllData')}
              </button>
            </div>
          </div>

          {/* Reset Section */}
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: theme.ui.resetButton }}>
              {getMessage(language, 'allDungeonReset')}
            </h3>
            <button
              onClick={handleResetAllDungeons}
              className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
              style={{ 
                backgroundColor: theme.ui.resetButton, 
                color: theme.ui.resetButtonText
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.resetButtonHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.resetButton}
            >
              {getMessage(language, 'resetAllDungeonsButton')}
            </button>
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded transition-colors"
              style={{ backgroundColor: theme.ui.button, color: theme.ui.panelText }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.button}
            >
              {getMessage(language, 'close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OptionDialog