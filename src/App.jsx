import React, { useEffect, useCallback } from 'react'
import { useAppState } from './hooks/useAppState'
import Header from './components/Header/Header'
import ToolPanel from './components/ToolPanel/ToolPanel'
import Canvas from './components/Canvas/Canvas'
import { TOOLS } from './utils/constants'

function App() {
  const {
    state,
    setCurrentFloor,
    setZoom,
    setActiveTool,
    setGridSize,
    updateCurrentFloorData,
    getCurrentFloorData,
    undo,
    redo,
    resetCurrentFloor,
    exportState,
    importState
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
      }
      
      // Tool selection with number keys
      const toolKeys = Object.values(TOOLS)
      const num = parseInt(e.key)
      if (num >= 1 && num <= toolKeys.length) {
        setActiveTool(toolKeys[num - 1])
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [exportState, undo, redo, setActiveTool])

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header
        currentFloor={state.currentFloor}
        maxFloors={state.maxFloors}
        setCurrentFloor={setCurrentFloor}
        zoom={state.zoom}
        setZoom={setZoom}
        gridSize={state.gridSize}
        onGridSizeChange={setGridSize}
        onExport={exportState}
        onImport={importState}
        onUndo={undo}
        onRedo={redo}
        onResetFloor={resetCurrentFloor}
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