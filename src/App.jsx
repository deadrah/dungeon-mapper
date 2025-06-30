import React, { useEffect } from 'react'
import { useAppState } from './hooks/useAppState'
import Header from './components/Header/Header'
import ToolPanel, { getToolKeyMappings, getToolName } from './components/ToolPanel/ToolPanel'
import Canvas from './components/Canvas/Canvas'
import { TOOLS } from './utils/constants'

function App() {
  const {
    state,
    setCurrentDungeon,
    setCurrentFloor,
    setDungeonName,
    setFloorName,
    setZoom,
    setActiveTool,
    setGridSize,
    setDungeonGridSize,
    toggleNoteTooltips,
    setLanguage,
    setTheme,
    currentTheme,
    updateCurrentFloorData,
    getCurrentFloorData,
    undo,
    redo,
    resetCurrentFloor,
    resetDungeon,
    resetAllDungeons,
    exportState,
    importState,
    exportDungeon,
    importDungeon,
    exportFloorSVG,
    copyFloor,
    getNoteAt,
    setNoteAt,
    deleteNoteAt,
    moveNoteAt
  } = useAppState()


  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if text input field is focused - disable shortcuts to avoid conflicts
      const activeElement = document.activeElement
      const isTextInput = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable ||
        activeElement.getAttribute('contenteditable') === 'true'
      )
      
      if (isTextInput) {
        return // Don't process shortcuts when text input is active
      }
      
      if (e.ctrlKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            exportState()
            break
          case 'l':
            e.preventDefault()
            // Import requires file dialog, can't be triggered by keyboard
            break
          case 'z':
            e.preventDefault()
            undo()
            break
          case 'y':
            e.preventDefault()
            redo()
            break
        }
      } else {
        // Tool selection with custom key mappings
        const keyMappings = getToolKeyMappings()
        const pressedKey = e.key.toLowerCase()
        
        if (keyMappings[pressedKey]) {
          e.preventDefault()
          setActiveTool(keyMappings[pressedKey])
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [exportState, undo, redo, setActiveTool])

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: currentTheme.grid.background }}>
      <Header
        currentDungeon={state.currentDungeon}
        currentFloor={state.currentFloor}
        setCurrentDungeon={setCurrentDungeon}
        setCurrentFloor={setCurrentFloor}
        dungeonNames={state.dungeonNames || {}}
        setDungeonName={setDungeonName}
        setFloorName={setFloorName}
        floors={state.dungeons[state.currentDungeon]?.floors || {}}
        allDungeons={state.dungeons}
        zoom={state.zoom}
        setZoom={setZoom}
        gridSize={state.dungeons[state.currentDungeon]?.gridSize || state.gridSize}
        onGridSizeChange={setGridSize}
        onDungeonGridSizeChange={setDungeonGridSize}
        onDungeonReset={resetDungeon}
        onExport={exportState}
        onImport={importState}
        onExportDungeon={exportDungeon}
        onImportDungeon={importDungeon}
        onUndo={undo}
        onRedo={redo}
        onResetFloor={resetCurrentFloor}
        onResetAllDungeons={resetAllDungeons}
        onExportSVG={exportFloorSVG}
        onFloorCopy={copyFloor}
        showNoteTooltips={state.showNoteTooltips}
        onToggleNoteTooltips={toggleNoteTooltips}
        language={state.language}
        onLanguageChange={setLanguage}
        theme={currentTheme}
        themeName={state.theme}
        onThemeChange={setTheme}
        activeTool={state.activeTool}
        toolName={getToolName(state.activeTool)}
      />
      
      <div className="flex flex-1 overflow-hidden md:flex-row flex-col">
        <ToolPanel
          activeTool={state.activeTool}
          setActiveTool={setActiveTool}
          theme={currentTheme}
        />
        
        <Canvas
          appState={state}
          setZoom={setZoom}
          updateCurrentFloorData={updateCurrentFloorData}
          getCurrentFloorData={getCurrentFloorData}
          getNoteAt={getNoteAt}
          setNoteAt={setNoteAt}
          deleteNoteAt={deleteNoteAt}
          moveNoteAt={moveNoteAt}
          showNoteTooltips={state.showNoteTooltips}
          theme={currentTheme}
        />
      </div>
    </div>
  )
}

export default App