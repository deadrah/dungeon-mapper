import { useState, useCallback, useRef, useEffect } from 'react'
import { MAX_FLOORS, MAX_MAPS } from '../utils/constants'
import { exportFloorAsSVG, downloadSVG } from '../utils/svgExport'

const createEmptyFloor = (gridSize) => ({
  grid: new Array(gridSize.rows).fill(null).map(() => new Array(gridSize.cols).fill(null)),
  walls: [],
  items: [],
  doors: []
})

const createEmptyMap = (gridSize) => {
  const floors = {}
  for (let i = 1; i <= MAX_FLOORS; i++) {
    floors[i] = createEmptyFloor(gridSize)
  }
  return floors
}

const INITIAL_STATE = {
  currentMap: 1,
  currentFloor: 1,
  gridSize: { rows: 20, cols: 20 },
  zoom: 1.0,
  activeTool: 'block_color',
  maps: {
    1: {
      name: 'Map 1',
      floors: createEmptyMap({ rows: 20, cols: 20 })
    }
  },
  mapNames: {
    1: 'Map 1'
  }
}

const STORAGE_KEY = 'dmapper_state'

// Load state from localStorage
const loadStateFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsedState = JSON.parse(saved)
      
      // Check if it's old format (has floors property directly)
      if (parsedState.floors && !parsedState.maps) {
        // Convert old format to new format
        const convertedState = {
          currentMap: 1,
          currentFloor: parsedState.currentFloor || 1,
          gridSize: parsedState.gridSize || { rows: 20, cols: 20 },
          zoom: parsedState.zoom || 1.0,
          activeTool: parsedState.activeTool || 'block_color',
          maps: {
            1: {
              name: 'Map 1',
              floors: {}
            }
          },
          mapNames: {
            1: 'Map 1'
          }
        }
        
        // Convert old floors to new format and ensure doors property exists
        Object.keys(parsedState.floors).forEach(floorKey => {
          const floor = parsedState.floors[floorKey]
          if (!floor.doors) {
            floor.doors = []
          }
          convertedState.maps[1].floors[floorKey] = floor
        })
        
        // Fill missing floors up to MAX_FLOORS
        for (let i = 1; i <= MAX_FLOORS; i++) {
          if (!convertedState.maps[1].floors[i]) {
            convertedState.maps[1].floors[i] = createEmptyFloor(convertedState.gridSize)
          }
        }
        
        return convertedState
      }
      
      // New format - ensure doors property exists for all floors in all maps
      if (parsedState.maps) {
        Object.keys(parsedState.maps).forEach(mapKey => {
          const map = parsedState.maps[mapKey]
          if (map.floors) {
            Object.keys(map.floors).forEach(floorKey => {
              if (!map.floors[floorKey].doors) {
                map.floors[floorKey].doors = []
              }
            })
          }
        })
      }
      
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

  const setCurrentMap = useCallback((mapId) => {
    updateState(state => {
      if (!state.maps[mapId]) {
        state.maps[mapId] = {
          name: `Map ${mapId}`,
          floors: createEmptyMap(state.gridSize)
        }
        state.mapNames[mapId] = `Map ${mapId}`
      }
      return { ...state, currentMap: mapId }
    })
  }, [updateState])

  const setCurrentFloor = useCallback((floor) => {
    updateState(state => {
      const currentMap = state.maps[state.currentMap]
      if (!currentMap.floors[floor]) {
        currentMap.floors[floor] = createEmptyFloor(state.gridSize)
      }
      return { ...state, currentFloor: floor }
    })
  }, [updateState])

  const setMapName = useCallback((mapId, name) => {
    updateState(state => ({
      ...state,
      maps: {
        ...state.maps,
        [mapId]: {
          ...state.maps[mapId],
          name
        }
      },
      mapNames: {
        ...state.mapNames,
        [mapId]: name
      }
    }))
  }, [updateState])

  const setGridSize = useCallback((newSize) => {
    updateState(state => {
      const newState = { ...state, gridSize: newSize }
      
      // Update all floors in all maps to match new grid size
      Object.keys(newState.maps).forEach(mapKey => {
        const map = newState.maps[mapKey]
        Object.keys(map.floors).forEach(floorKey => {
          const oldGrid = map.floors[floorKey].grid
          const newGrid = new Array(newSize.rows).fill(null).map(() => new Array(newSize.cols).fill(null))
          
          // Copy existing data that fits in new grid
          for (let row = 0; row < Math.min(oldGrid.length, newSize.rows); row++) {
            for (let col = 0; col < Math.min(oldGrid[row].length, newSize.cols); col++) {
              newGrid[row][col] = oldGrid[row][col]
            }
          }
          
          // Filter items to fit within new grid bounds
          const filteredItems = map.floors[floorKey].items.filter(
            item => item.row < newSize.rows && item.col < newSize.cols
          )
          
          newState.maps[mapKey].floors[floorKey] = {
            ...map.floors[floorKey],
            grid: newGrid,
            items: filteredItems
          }
        })
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
      maps: {
        ...state.maps,
        [state.currentMap]: {
          ...state.maps[state.currentMap],
          floors: {
            ...state.maps[state.currentMap].floors,
            [state.currentFloor]: {
              ...state.maps[state.currentMap].floors[state.currentFloor],
              [dataType]: data
            }
          }
        }
      }
    }))
  }, [updateState])

  const getCurrentFloorData = useCallback(() => {
    const currentMap = state.maps[state.currentMap]
    if (!currentMap) return createEmptyFloor(state.gridSize)
    
    return currentMap.floors[state.currentFloor] || createEmptyFloor(state.gridSize)
  }, [state])

  // Export state as JSON file
  const exportState = useCallback(() => {
    try {
      const dataStr = JSON.stringify(state, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const link = document.createElement('a')
      link.href = url
      link.download = `dmapper_${timestamp}.json`
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

  // Reset current floor data
  const resetCurrentFloor = useCallback(() => {
    updateState(state => ({
      ...state,
      maps: {
        ...state.maps,
        [state.currentMap]: {
          ...state.maps[state.currentMap],
          floors: {
            ...state.maps[state.currentMap].floors,
            [state.currentFloor]: createEmptyFloor(state.gridSize)
          }
        }
      }
    }))
  }, [updateState])

  // Export current floor as SVG
  const exportFloorSVG = useCallback(() => {
    try {
      const floorData = getCurrentFloorData()
      const mapName = state.mapNames?.[state.currentMap] || `Map ${state.currentMap}`
      const svgContent = exportFloorAsSVG(floorData, state.gridSize, mapName, state.currentFloor)
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const filename = `${mapName.replace(/[^a-z0-9]/gi, '_')}_Floor_${state.currentFloor}_${timestamp}.svg`
      downloadSVG(svgContent, filename)
    } catch (error) {
      console.error('Failed to export SVG:', error)
      alert('SVGエクスポートに失敗しました')
    }
  }, [state, getCurrentFloorData])

  return {
    state,
    updateState,
    undo,
    redo,
    setCurrentMap,
    setCurrentFloor,
    setMapName,
    setZoom,
    setActiveTool,
    setGridSize,
    updateCurrentFloorData,
    getCurrentFloorData,
    resetCurrentFloor,
    exportState,
    importState,
    exportFloorSVG
  }
}