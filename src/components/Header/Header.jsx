import React, { useState, useEffect } from 'react'
import { MAX_FLOORS, MAX_DUNGEONS } from '../../utils/constants'
import HelpDialog from '../Dialog/HelpDialog'
import DungeonOptionDialog from '../Dialog/DungeonOptionDialog'
import FloorOptionDialog from '../Dialog/FloorOptionDialog'
import CopyFloorDialog from '../Dialog/CopyFloorDialog'
import OptionDialog from '../Dialog/OptionDialog'

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


  const handleOpenCopyFloor = (sourceDungeon, sourceFloor) => {
    setCopyFloorSource({ dungeonId: sourceDungeon, floorId: sourceFloor })
    setIsCopyFloorOpen(true)
  }

  const handleCloseCopyFloor = () => {
    setIsCopyFloorOpen(false)
  }
  

  return (
    <div className="md:h-12 h-auto md:flex md:items-center md:justify-between px-2 md:px-4 py-2 md:py-0" style={{ backgroundColor: theme.ui.panel, color: theme.ui.panelText }}>
      <div className="flex md:items-center md:space-x-4 gap-2 md:gap-0 flex-wrap md:justify-start justify-between">
        <svg width="112" height="15" viewBox="0 0 112 15" className="h-5 md:mb-1 mt-1" style={{ marginTop: '6px' }}>
          <g fill={theme.ui.panelText} transform="translate(1,0)">
            <path d="M11.002,1.004c3.858,0,6.994,3.126,6.994,6.994c0,1.713-0.615,3.293-1.655,4.507c-0.125,0.15-0.258,0.3-0.399,0.441
              C14.678,14.218,12.932,15,11.002,15H4V1.004H11.002z M6.495,12.505h4.507c2.478,0,4.499-2.021,4.499-4.507
              c0-2.479-2.021-4.499-4.499-4.499H6.495V12.505z"/>
            <path d="M36.404,0.997v14.004h-2.503V6.086l-2.453,1.888l-2.046,1.58l-2.046-1.58l-2.453-1.888v8.915H22.4V0.997l2.503,1.929
              l4.499,3.468l4.499-3.468L36.404,0.997z"/>
            <path d="M51.891,15.001h-2.803l-1.28-2.504l-3.052-5.996l-3.053,5.996l-1.28,2.504H37.62l1.272-2.504l5.863-11.5l5.862,11.5
              L51.891,15.001z"/>
            <path d="M65.709,4.772c0,1.53-0.907,2.853-2.213,3.443c-0.341,0.158-0.706,0.266-1.089,0.308
              c-0.033,0.008-0.075,0.008-0.108,0.008v0.025h-6.704v6.44H53.1V0.992h0.002V0.988h8.832c1.047,0,1.987,0.424,2.669,1.106
              C65.284,2.784,65.709,3.732,65.709,4.772z M63.214,4.772c0-0.458-0.241-0.773-0.383-0.923c-0.166-0.158-0.457-0.366-0.897-0.366
              h-6.337v2.578h6.337c0.183,0,0.357-0.033,0.523-0.117C62.923,5.737,63.214,5.279,63.214,4.772z"/>
            <path d="M80.309,4.772c0,1.53-0.907,2.853-2.213,3.443c-0.341,0.158-0.706,0.266-1.089,0.308
              c-0.033,0.008-0.075,0.008-0.108,0.008v0.025h-6.704v6.44h-2.495V0.992h0.002V0.988h8.832c1.047,0,1.987,0.424,2.669,1.106
              C79.884,2.784,80.309,3.732,80.309,4.772z M77.813,4.772c0-0.458-0.241-0.773-0.383-0.923c-0.166-0.158-0.457-0.366-0.897-0.366
              h-6.337v2.578h6.337c0.183,0,0.357-0.033,0.523-0.117C77.522,5.737,77.813,5.279,77.813,4.772z"/>
            <path d="M84.794,4.78v1.297H93.8v2.495h-9.006v2.645c0,0.707,0.574,1.289,1.28,1.289h10.221v2.495H86.074
              c-2.087,0-3.775-1.696-3.775-3.784V4.78c0-2.087,1.688-3.784,3.775-3.784h10.221v2.495H86.074
              C85.368,3.491,84.794,4.073,84.794,4.78z"/>
            <path d="M109.625,12.497L110.897,15h-2.802l-1.281-2.503l-1.337-2.625l-0.06-0.11c-0.433-0.715-1.223-1.198-2.129-1.198h-2.495
              v6.437h-2.495V0.997h8.835c1.048,0,1.987,0.424,2.67,1.106c0.682,0.69,1.105,1.638,1.105,2.678c0,1.53-0.906,2.853-2.212,3.443
              c-0.341,0.158-0.707,0.266-1.089,0.308c-0.001,0-0.003,0-0.004,0L109.625,12.497z M107.134,6.069c0.184,0,0.357-0.033,0.524-0.117
              c0.465-0.208,0.757-0.665,0.757-1.172c0-0.458-0.241-0.773-0.383-0.923c-0.167-0.158-0.458-0.366-0.898-0.366h-6.337v2.578
              H107.134z"/>
          </g>
          <line fill="none" stroke={theme.ui.panelText} strokeWidth="3" x1="0" y1="8.33" x2="6" y2="8.33"/>
          <line fill="none" stroke={theme.ui.panelText} strokeWidth="3" x1="17" y1="8.33" x2="24" y2="8.33"/>
        </svg>
        
        <div className="flex items-center md:space-x-2 space-x-1 md:flex-row">
          <select
            value={currentDungeon}
            onChange={(e) => setCurrentDungeon(parseInt(e.target.value))}
            className="md:px-2 px-1 py-1.5 rounded text-sm h-8"
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

        <div className="flex items-center md:space-x-2 space-x-1">
          <select
            value={currentFloor}
            onChange={(e) => setCurrentFloor(parseInt(e.target.value))}
            className="md:px-2 px-1 py-1.5 rounded text-sm h-8"
            style={{ backgroundColor: theme.ui.input, color: theme.ui.inputText, border: `1px solid ${theme.ui.border}` }}
          >
            {Array.from({ length: MAX_FLOORS }, (_, i) => i + 1).map(floor => {
              const floorData = floors[floor]
              const customName = floorData?.name
              const baseName = customName || `B${floor}F`
              
              // Check if floor has any data
              const hasData = floorData && (
                (floorData.grid && floorData.grid.some(row => row.some(cell => cell !== null))) ||
                (floorData.walls && floorData.walls.length > 0) ||
                (floorData.items && floorData.items.length > 0) ||
                (floorData.doors && floorData.doors.length > 0) ||
                (floorData.notes && floorData.notes.length > 0)
              )
              
              const displayName = hasData ? `*${baseName}` : baseName
              
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
      

      {/* Option Dialog */}
      <OptionDialog
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onExport={onExport}
        onImport={onImport}
        onResetAllDungeons={onResetAllDungeons}
        language={language}
        onLanguageChange={onLanguageChange}
        theme={theme}
        themeName={themeName}
        onThemeChange={onThemeChange}
      />

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