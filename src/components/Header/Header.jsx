import React, { useState, useEffect } from 'react'
import { MAX_FLOORS, MAX_DUNGEONS } from '../../utils/constants'
import HelpDialog from '../Dialog/HelpDialog'
import DungeonOptionDialog from '../Dialog/DungeonOptionDialog'
import FloorOptionDialog from '../Dialog/FloorOptionDialog'
import CopyFloorDialog from '../Dialog/CopyFloorDialog'
import { getMessage } from '../../utils/messages'
import { getThemeOptions } from '../../utils/themes'

const Header = ({ 
  currentDungeon,
  currentFloor, 
  setCurrentDungeon,
  setCurrentFloor,
  dungeonNames,
  setDungeonName,
  setFloorName,
  floors,
  allDungeons,
  // zoom, // 将来のズーム表示機能で使用予定
  // setZoom, // 将来のズーム操作機能で使用予定
  onExport,
  onImport,
  onExportDungeon,
  onImportDungeon,
  onUndo,
  onRedo,
  gridSize,
  onGridSizeChange,
  onDungeonGridSizeChange,
  onDungeonReset,
  onResetFloor,
  onResetAllDungeons,
  onExportSVG,
  onFloorCopy,
  showNoteTooltips,
  onToggleNoteTooltips,
  language,
  onLanguageChange,
  theme,
  themeName,
  onThemeChange,
  // activeTool, // 将来のツール状態表示で使用予定
  toolName
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isDungeonOptionOpen, setIsDungeonOptionOpen] = useState(false)
  const [isFloorOptionOpen, setIsFloorOptionOpen] = useState(false)
  const [isCopyFloorOpen, setIsCopyFloorOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [copyFloorSource, setCopyFloorSource] = useState({ dungeonId: 1, floorId: 1 })

  const closeMenu = () => setIsMenuOpen(false)
  
  const handleDesktopExport = () => {
    onExport()
    closeMenu()
  }

  const handleDesktopImport = () => {
    handleImportClick()
    closeMenu()
  }




  

  const handleResetAllDungeons = () => {
    const message = getMessage(language, 'resetAllDungeons')
    if (window.confirm(message)) {
      onResetAllDungeons()
      closeMenu()
    }
  }


  
  const handleImportClick = () => {
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
  }

  const handleOpenCopyFloor = (sourceDungeon, sourceFloor) => {
    setCopyFloorSource({ dungeonId: sourceDungeon, floorId: sourceFloor })
    setIsCopyFloorOpen(true)
  }

  const handleCloseCopyFloor = () => {
    setIsCopyFloorOpen(false)
  }
  

  return (
    <div className="md:h-12 h-auto md:flex md:items-center md:justify-between px-2 md:px-4 py-2 md:py-0" style={{ backgroundColor: theme.ui.panel, color: theme.ui.panelText }}>
      <div className="flex md:items-center md:space-x-4 gap-2 md:gap-0 justify-between md:justify-start">
        <h1 className="text-lg font-bold md:mb-0 mb-1">DMapper</h1>
        
        <div className="flex items-center space-x-2 md:flex-row">
          <select
            value={currentDungeon}
            onChange={(e) => setCurrentDungeon(parseInt(e.target.value))}
            className="px-2 py-1.5 rounded text-sm h-8"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
          >
            {Array.from({ length: MAX_DUNGEONS }, (_, i) => i + 1).map(dungeonId => (
              <option key={dungeonId} value={dungeonId}>
                {dungeonNames[dungeonId] || `Dungeon ${dungeonId}`}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsDungeonOptionOpen(true)}
            className="px-2 py-1.5 rounded text-sm h-8 w-8 flex items-center justify-center transition-colors"
            style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
            title="Dungeon Options"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
              <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={currentFloor}
            onChange={(e) => setCurrentFloor(parseInt(e.target.value))}
            className="px-2 py-1.5 rounded text-sm h-8"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
          >
            {Array.from({ length: MAX_FLOORS }, (_, i) => i + 1).map(floor => {
              const floorData = floors[floor]
              const customName = floorData?.name
              const displayName = customName || `B${floor}F`
              return (
                <option key={floor} value={floor}>
                  {displayName}
                </option>
              )
            })}
          </select>
          <button
            onClick={() => setIsFloorOptionOpen(true)}
            className="px-2 py-1.5 rounded text-sm h-8 w-8 flex items-center justify-center transition-colors"
            style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
            title="Floor Options"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
              <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </div>
        

        <button
          onClick={onToggleNoteTooltips}
          className="px-2 py-1 rounded text-sm w-8 h-8 transition-colors md:inline-flex hidden items-center justify-center"
          style={{
            backgroundColor: showNoteTooltips ? theme.ui.buttonActive : theme.ui.button,
            color: theme.ui.panelText
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = showNoteTooltips ? theme.ui.buttonActiveHover : theme.ui.buttonHover}
          onMouseLeave={(e) => e.target.style.backgroundColor = showNoteTooltips ? theme.ui.buttonActive : theme.ui.button}
          title={showNoteTooltips ? "Hide Note Tooltips" : "Show Note Tooltips"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
            <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M6 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center md:space-x-2 space-x-1 justify-between md:justify-end mt-2 md:mt-0">

        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            className="px-2 py-1 rounded text-sm transition-colors"
            style={{ backgroundColor: theme.ui.button, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.button}
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            onClick={onRedo}
            className="px-2 py-1 rounded text-sm transition-colors"
            style={{ backgroundColor: theme.ui.button, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.button}
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>
        </div>

        {/* スマホでは選択中のツール名を中央表示 */}
        <div className="md:hidden flex-1 text-center">
          <span className="text-sm" style={{ color: theme.ui.panelText }}>{toolName}</span>
        </div>

        <div className="flex items-center space-x-1 md:flex hidden">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="px-2 py-1.5 rounded text-sm w-8 h-8 transition-colors flex items-center justify-center"
            style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
            title="Option"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
              <path d="M2 4h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onToggleNoteTooltips}
            className="px-2 py-1.5 rounded text-sm w-8 h-8 transition-colors md:hidden"
            style={{
              backgroundColor: showNoteTooltips ? theme.ui.buttonActive : theme.ui.button,
              color: theme.ui.panelText
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = showNoteTooltips ? theme.ui.buttonActiveHover : theme.ui.buttonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = showNoteTooltips ? theme.ui.buttonActive : theme.ui.button}
            title={showNoteTooltips ? "Hide Note Tooltips" : "Show Note Tooltips"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.4em', pointerEvents: 'none'}}>
              <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M6 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="px-2 py-1.5 rounded text-sm w-8 h-8 md:block hidden transition-colors flex items-center justify-center"
            style={{ 
              backgroundColor: theme.ui.helpButton, 
              color: theme.ui.helpButtonText
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.helpButtonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.helpButton}
            title="ヘルプ"
          >
            ?
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="px-2 py-1.5 rounded text-sm w-8 h-8 md:hidden transition-colors"
            style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
            title="オプション"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
              <path d="M2 4h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="px-2 py-1.5 rounded text-sm w-8 h-8 md:hidden transition-colors"
            style={{ 
              backgroundColor: theme.ui.helpButton, 
              color: theme.ui.helpButtonText
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.helpButtonHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.helpButton}
            title="ヘルプ"
          >
            ?
          </button>
        </div>
      </div>
      
      {/* Dungeon Option Dialog */}
      <DungeonOptionDialog
        isOpen={isDungeonOptionOpen}
        onClose={() => setIsDungeonOptionOpen(false)}
        currentDungeon={currentDungeon}
        dungeonNames={dungeonNames}
        onDungeonChange={setCurrentDungeon}
        onDungeonRename={setDungeonName}
        gridSize={gridSize}
        onGridSizeChange={onDungeonGridSizeChange}
        onDungeonReset={onDungeonReset}
        onDungeonExport={onExportDungeon}
        onDungeonImport={onImportDungeon}
        theme={theme}
        language={language}
      />
      
      {/* Floor Option Dialog */}
      <FloorOptionDialog
        isOpen={isFloorOptionOpen}
        onClose={() => setIsFloorOptionOpen(false)}
        currentDungeon={currentDungeon}
        currentFloor={currentFloor}
        dungeonNames={dungeonNames}
        floors={floors}
        allDungeons={allDungeons}
        onFloorChange={setCurrentFloor}
        onFloorRename={setFloorName}
        onFloorReset={onResetFloor}
        onExportSVG={onExportSVG}
        onOpenCopyFloor={handleOpenCopyFloor}
        theme={theme}
        language={language}
      />

      {/* Copy Floor Dialog */}
      <CopyFloorDialog
        isOpen={isCopyFloorOpen}
        onClose={handleCloseCopyFloor}
        sourceDungeon={copyFloorSource.dungeonId}
        sourceFloor={copyFloorSource.floorId}
        dungeonNames={dungeonNames}
        allDungeons={allDungeons}
        onFloorCopy={onFloorCopy}
        theme={theme}
        language={language}
      />
      

      {/* Option Modal */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={closeMenu}
        >
          <div 
            className="rounded-lg p-4 w-64 max-w-full mx-4"
            style={{ backgroundColor: theme.ui.panel }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.ui.panelText }}>{getMessage(language, 'option')}</h3>
            
            <div className="space-y-2">
              {/* Theme Selection */}
              <div className="border-b pb-2 mb-2" style={{ borderColor: theme.ui.border }}>
                <h4 className="text-sm font-semibold mb-2" style={{ color: theme.ui.panelText }}>{getMessage(language, 'theme')}</h4>
                <select
                  value={themeName}
                  onChange={(e) => onThemeChange(e.target.value)}
                  className="px-2 py-1 rounded text-sm w-full"
                  style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
                >
                  {getThemeOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>



              
              <div>
                <span className="text-sm font-semibold" style={{ color: theme.ui.menuSectionHeading }}>{getMessage(language, 'allDataBackup')}</span>
              </div>
              <button
                onClick={handleDesktopExport}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                {getMessage(language, 'exportAllData')}
              </button>
              
              <button
                onClick={handleDesktopImport}
                className="w-full px-3 py-2 rounded text-sm text-left transition-colors"
                style={{ backgroundColor: theme.ui.buttonActive, color: theme.ui.panelText }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.ui.buttonActiveHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.ui.buttonActive}
              >
                {getMessage(language, 'importAllData')}
              </button>

              {/* HR separator */}
              <hr className="border-gray-300" />
              
              <div>
                <span className="text-sm font-semibold" style={{ color: theme.ui.resetButton }}>{getMessage(language, 'allDungeonReset')}</span>
              </div>
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
                {getMessage(language, 'resetAllDungeons')}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Help Dialog */}
      <HelpDialog
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        language={language}
        onLanguageChange={onLanguageChange}
        theme={theme}
      />
    </div>
  )
}

export default Header