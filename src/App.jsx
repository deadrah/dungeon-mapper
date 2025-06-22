import React, { useEffect, useCallback } from 'react'
import { useAppState } from './hooks/useAppState'
import Header from './components/Header/Header'
import ToolPanel, { getToolKeyMappings } from './components/ToolPanel/ToolPanel'
import Canvas from './components/Canvas/Canvas'
import { TOOLS } from './utils/constants'

function App() {
  const {
    state,
    setCurrentMap,
    setCurrentFloor,
    setMapName,
    setZoom,
    setActiveTool,
    setGridSize,
    updateCurrentFloorData,
    getCurrentFloorData,
    undo,
    redo,
    resetCurrentFloor,
    exportState,
    importState,
    exportFloorSVG
  } = useAppState()


  useEffect(() => {
    const handleKeyDown = (e) => {
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
    <div className="h-screen flex flex-col bg-gray-100">
      <Header
        currentMap={state.currentMap}
        currentFloor={state.currentFloor}
        setCurrentMap={setCurrentMap}
        setCurrentFloor={setCurrentFloor}
        mapNames={state.mapNames || {}}
        setMapName={setMapName}
        zoom={state.zoom}
        setZoom={setZoom}
        gridSize={state.gridSize}
        onGridSizeChange={setGridSize}
        onExport={exportState}
        onImport={importState}
        onUndo={undo}
        onRedo={redo}
        onResetFloor={resetCurrentFloor}
        onExportSVG={exportFloorSVG}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ToolPanel
          activeTool={state.activeTool}
          setActiveTool={setActiveTool}
        />
        
        <Canvas
          appState={state}
          setZoom={setZoom}
          updateCurrentFloorData={updateCurrentFloorData}
          getCurrentFloorData={getCurrentFloorData}
        />
      </div>
    </div>
  )
}

export default App