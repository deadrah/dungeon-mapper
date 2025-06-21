import { useState, useCallback, useRef, useEffect } from 'react'

const INITIAL_STATE = {
  currentFloor: 1,
  maxFloors: 10,
  gridSize: { rows: 20, cols: 20 },
  zoom: 1.0,
  activeTool: 'block_color',
  floors: {
    1: {
      grid: new Array(20).fill(null).map(() => new Array(20).fill(null)),
      walls: [],
      items: [],
      doors: []
    }
  }
}

const STORAGE_KEY = 'dmapper_state'

// Load state from localStorage
const loadStateFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsedState = JSON.parse(saved)
      // Ensure doors property exists for all floors
      Object.keys(parsedState.floors).forEach(floorKey => {
        if (!parsedState.floors[floorKey].doors) {
          parsedState.floors[floorKey].doors = []
        }
        // Remove any note items if they exist (cleanup for backward compatibility)
        if (parsedState.floors[floorKey].items) {
          parsedState.floors[floorKey].items = parsedState.floors[floorKey].items.filter(item => item.type !== 'note')
        }
      })
      return parsedState
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error)
  }
  return INITIAL_STATE
}

// Save state to localStorage
const saveStateToStorage = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save state to localStorage:', error)
  }
}

export const useAppState = () => {
  const [state, setState] = useState(loadStateFromStorage)
  const historyRef = useRef([JSON.parse(JSON.stringify(loadStateFromStorage()))])
  const historyIndexRef = useRef(0)
  const isUndoRedoRef = useRef(false)

  // Auto-save whenever state changes (except during undo/redo)
  useEffect(() => {
    if (!isUndoRedoRef.current) {
      saveStateToStorage(state)
    }
    isUndoRedoRef.current = false
  }, [state])

  const updateState = useCallback((updater) => {
    setState(prevState => {
      const newState = typeof updater === 'function' ? updater(prevState) : updater
      
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
      historyRef.current.push(JSON.parse(JSON.stringify(newState)))
      historyIndexRef.current = historyRef.current.length - 1
      
      return newState
    })
  }, [])

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--
      const newState = JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]))
      isUndoRedoRef.current = true
      setState(newState)
      // Auto-save the undo state
      saveStateToStorage(newState)
    }
  }, [])

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++
      const newState = JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]))
      isUndoRedoRef.current = true
      setState(newState)
      // Auto-save the redo state
      saveStateToStorage(newState)
    }
  }, [])

  const setCurrentFloor = useCallback((floor) => {
    updateState(state => {
      if (!state.floors[floor]) {
        state.floors[floor] = {
          grid: new Array(state.gridSize.rows).fill(null).map(() => new Array(state.gridSize.cols).fill(null)),
          walls: [],
          items: [],
          doors: []
        }
      }
      return { ...state, currentFloor: floor }
    })
  }, [updateState])

  const setGridSize = useCallback((newSize) => {
    updateState(state => {
      const newState = { ...state, gridSize: newSize }
      
      // Update all floors to match new grid size
      Object.keys(newState.floors).forEach(floorKey => {
        const oldGrid = newState.floors[floorKey].grid
        const newGrid = new Array(newSize.rows).fill(null).map(() => new Array(newSize.cols).fill(null))
        
        // Copy existing data that fits in new grid
        for (let row = 0; row < Math.min(oldGrid.length, newSize.rows); row++) {
          for (let col = 0; col < Math.min(oldGrid[row].length, newSize.cols); col++) {
            newGrid[row][col] = oldGrid[row][col]
          }
        }
        
        // Filter items to fit within new grid bounds
        const filteredItems = newState.floors[floorKey].items.filter(
          item => item.row < newSize.rows && item.col < newSize.cols
        )
        
        newState.floors[floorKey] = {
          ...newState.floors[floorKey],
          grid: newGrid,
          items: filteredItems
        }
      })
      
      return newState
    })
  }, [updateState])

  const setZoom = useCallback((zoom) => {
    updateState(state => ({ ...state, zoom: Math.max(0.1, Math.min(5, zoom)) }))
  }, [updateState])

  const setActiveTool = useCallback((tool) => {
    updateState(state => ({ ...state, activeTool: tool }))
  }, [updateState])

  const updateCurrentFloorData = useCallback((dataType, data) => {
    updateState(state => ({
      ...state,
      floors: {
        ...state.floors,
        [state.currentFloor]: {
          ...state.floors[state.currentFloor],
          [dataType]: data
        }
      }
    }))
  }, [updateState])

  const getCurrentFloorData = useCallback(() => {
    return state.floors[state.currentFloor] || {
      grid: new Array(state.gridSize.rows).fill(null).map(() => new Array(state.gridSize.cols).fill(null)),
      walls: [],
      items: [],
      doors: []
    }
  }, [state])

  // Export state as JSON file
  const exportState = useCallback(() => {
    try {
      const dataStr = JSON.stringify(state, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `dmapper_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export state:', error)
      alert('エクスポートに失敗しました')
    }
  }, [state])

  // Import state from JSON file
  const importState = useCallback((file) => {
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedState = JSON.parse(e.target.result)
          
          // Validate and ensure doors property exists for all floors
          if (importedState.floors) {
            Object.keys(importedState.floors).forEach(floorKey => {
              if (!importedState.floors[floorKey].doors) {
                importedState.floors[floorKey].doors = []
              }
              // Remove any note items if they exist (cleanup for backward compatibility)
              if (importedState.floors[floorKey].items) {
                importedState.floors[floorKey].items = importedState.floors[floorKey].items.filter(item => item.type !== 'note')
              }
            })
          }
          
          setState(importedState)
          historyRef.current = [JSON.parse(JSON.stringify(importedState))]
          historyIndexRef.current = 0
          
          alert('インポートが完了しました')
        } catch (error) {
          console.error('Failed to parse imported file:', error)
          alert('ファイルの読み込みに失敗しました。正しいJSONファイルを選択してください。')
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error('Failed to import state:', error)
      alert('インポートに失敗しました')
    }
  }, [])

  return {
    state,
    updateState,
    undo,
    redo,
    setCurrentFloor,
    setZoom,
    setActiveTool,
    setGridSize,
    updateCurrentFloorData,
    getCurrentFloorData,
    exportState,
    importState
  }
}