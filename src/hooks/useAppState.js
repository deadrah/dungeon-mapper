import { useState, useCallback, useRef, useEffect } from 'react'
import { MAX_FLOORS, MAX_DUNGEONS } from '../utils/constants'
import { exportFloorAsSVG, downloadSVG } from '../utils/svgExport'

const createEmptyFloor = (gridSize) => ({
  grid: new Array(gridSize.rows).fill(null).map(() => new Array(gridSize.cols).fill(null)),
  walls: [],
  items: [],
  doors: []
})

const createEmptyDungeon = (gridSize) => {
  const floors = {}
  for (let i = 1; i <= MAX_FLOORS; i++) {
    floors[i] = createEmptyFloor(gridSize)
  }
  return floors
}

const INITIAL_STATE = {
  currentDungeon: 1,
  currentFloor: 1,
  gridSize: { rows: 20, cols: 20 },
  zoom: 1.0,
  activeTool: 'block_color',
  showNoteTooltips: true,
  dungeons: {
    1: {
      name: 'Dungeon 1',
      floors: createEmptyDungeon({ rows: 20, cols: 20 })
    }
  },
  dungeonNames: {
    1: 'Dungeon 1'
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
      if (parsedState.floors && !parsedState.dungeons && !parsedState.maps) {
        // Convert old format to new format
        const convertedState = {
          currentDungeon: 1,
          currentFloor: parsedState.currentFloor || 1,
          gridSize: parsedState.gridSize || { rows: 20, cols: 20 },
          zoom: parsedState.zoom || 1.0,
          activeTool: parsedState.activeTool || 'block_color',
          dungeons: {
            1: {
              name: 'Dungeon 1',
              floors: {}
            }
          },
          dungeonNames: {
            1: 'Dungeon 1'
          }
        }
        
        // Convert old floors to new format and ensure doors property exists
        Object.keys(parsedState.floors).forEach(floorKey => {
          const floor = parsedState.floors[floorKey]
          if (!floor.doors) {
            floor.doors = []
          }
          convertedState.dungeons[1].floors[floorKey] = floor
        })
        
        // Fill missing floors up to MAX_FLOORS
        for (let i = 1; i <= MAX_FLOORS; i++) {
          if (!convertedState.dungeons[1].floors[i]) {
            convertedState.dungeons[1].floors[i] = createEmptyFloor(convertedState.gridSize)
          }
        }
        
        return convertedState
      }

      // Convert maps format to dungeons format
      if (parsedState.maps && !parsedState.dungeons) {
        const convertedState = {
          currentDungeon: parsedState.currentMap || 1,
          currentFloor: parsedState.currentFloor || 1,
          gridSize: parsedState.gridSize || { rows: 20, cols: 20 },
          zoom: parsedState.zoom || 1.0,
          activeTool: parsedState.activeTool || 'block_color',
          showNoteTooltips: parsedState.showNoteTooltips !== undefined ? parsedState.showNoteTooltips : true,
          dungeons: {},
          dungeonNames: {}
        }
        
        // Convert maps to dungeons
        Object.keys(parsedState.maps).forEach(mapKey => {
          const map = parsedState.maps[mapKey]
          convertedState.dungeons[mapKey] = {
            name: map.name ? map.name.replace(/^Map /, 'Dungeon ') : `Dungeon ${mapKey}`,
            floors: map.floors || {}
          }
          
          // Ensure doors property exists for all floors
          if (convertedState.dungeons[mapKey].floors) {
            Object.keys(convertedState.dungeons[mapKey].floors).forEach(floorKey => {
              if (!convertedState.dungeons[mapKey].floors[floorKey].doors) {
                convertedState.dungeons[mapKey].floors[floorKey].doors = []
              }
            })
          }
        })
        
        // Convert mapNames to dungeonNames
        if (parsedState.mapNames) {
          Object.keys(parsedState.mapNames).forEach(mapKey => {
            const oldName = parsedState.mapNames[mapKey]
            convertedState.dungeonNames[mapKey] = oldName.replace(/^Map /, 'Dungeon ')
          })
        }
        
        return convertedState
      }
      
      // New format - ensure doors property exists for all floors in all dungeons
      if (parsedState.dungeons) {
        Object.keys(parsedState.dungeons).forEach(dungeonKey => {
          const dungeon = parsedState.dungeons[dungeonKey]
          if (dungeon.floors) {
            Object.keys(dungeon.floors).forEach(floorKey => {
              if (!dungeon.floors[floorKey].doors) {
                dungeon.floors[floorKey].doors = []
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

  const setCurrentDungeon = useCallback((dungeonId) => {
    updateState(state => {
      if (!state.dungeons[dungeonId]) {
        state.dungeons[dungeonId] = {
          name: `Dungeon ${dungeonId}`,
          floors: createEmptyDungeon(state.gridSize)
        }
        state.dungeonNames[dungeonId] = `Dungeon ${dungeonId}`
      }
      return { ...state, currentDungeon: dungeonId }
    })
  }, [updateState])

  const setCurrentFloor = useCallback((floor) => {
    updateState(state => {
      const currentDungeon = state.dungeons[state.currentDungeon]
      if (!currentDungeon.floors[floor]) {
        currentDungeon.floors[floor] = createEmptyFloor(state.gridSize)
      }
      return { ...state, currentFloor: floor }
    })
  }, [updateState])

  const setDungeonName = useCallback((dungeonId, name) => {
    updateState(state => ({
      ...state,
      dungeons: {
        ...state.dungeons,
        [dungeonId]: {
          ...state.dungeons[dungeonId],
          name
        }
      },
      dungeonNames: {
        ...state.dungeonNames,
        [dungeonId]: name
      }
    }))
  }, [updateState])

  const setGridSize = useCallback((newSize) => {
    updateState(state => {
      const newState = { ...state, gridSize: newSize }
      
      // Update all floors in all dungeons to match new grid size
      Object.keys(newState.dungeons).forEach(dungeonKey => {
        const dungeon = newState.dungeons[dungeonKey]
        Object.keys(dungeon.floors).forEach(floorKey => {
          const oldGrid = dungeon.floors[floorKey].grid
          const newGrid = new Array(newSize.rows).fill(null).map(() => new Array(newSize.cols).fill(null))
          
          // Copy existing data that fits in new grid
          for (let row = 0; row < Math.min(oldGrid.length, newSize.rows); row++) {
            for (let col = 0; col < Math.min(oldGrid[row].length, newSize.cols); col++) {
              newGrid[row][col] = oldGrid[row][col]
            }
          }
          
          // Filter items to fit within new grid bounds
          const filteredItems = dungeon.floors[floorKey].items.filter(
            item => item.row < newSize.rows && item.col < newSize.cols
          )
          
          newState.dungeons[dungeonKey].floors[floorKey] = {
            ...dungeon.floors[floorKey],
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

  const toggleNoteTooltips = useCallback(() => {
    updateState(state => ({ ...state, showNoteTooltips: !state.showNoteTooltips }))
  }, [updateState])

  const updateCurrentFloorData = useCallback((dataType, data) => {
    updateState(state => ({
      ...state,
      dungeons: {
        ...state.dungeons,
        [state.currentDungeon]: {
          ...state.dungeons[state.currentDungeon],
          floors: {
            ...state.dungeons[state.currentDungeon].floors,
            [state.currentFloor]: {
              ...state.dungeons[state.currentDungeon].floors[state.currentFloor],
              [dataType]: data
            }
          }
        }
      }
    }))
  }, [updateState])

  const getCurrentFloorData = useCallback(() => {
    const currentDungeon = state.dungeons[state.currentDungeon]
    if (!currentDungeon) return createEmptyFloor(state.gridSize)
    
    return currentDungeon.floors[state.currentFloor] || createEmptyFloor(state.gridSize)
  }, [state])

  // Check if a floor is completely empty
  const isFloorEmpty = (floor) => {
    if (!floor) return true
    
    // Check if grid has any non-null values
    const hasGridData = floor.grid && floor.grid.some(row => 
      row && row.some(cell => cell !== null)
    )
    
    // Check if there are any walls, items, or doors
    const hasWalls = floor.walls && floor.walls.length > 0
    const hasItems = floor.items && floor.items.length > 0
    const hasDoors = floor.doors && floor.doors.length > 0
    
    return !hasGridData && !hasWalls && !hasItems && !hasDoors
  }

  // Export state as JSON file
  const exportState = useCallback(() => {
    try {
      // Create optimized state for export
      const optimizedState = { ...state }
      
      // Remove empty floors from each dungeon
      if (optimizedState.dungeons) {
        Object.keys(optimizedState.dungeons).forEach(dungeonKey => {
          const dungeon = optimizedState.dungeons[dungeonKey]
          if (dungeon.floors) {
            const optimizedFloors = {}
            Object.keys(dungeon.floors).forEach(floorKey => {
              const floor = dungeon.floors[floorKey]
              if (!isFloorEmpty(floor)) {
                optimizedFloors[floorKey] = floor
              }
            })
            optimizedState.dungeons[dungeonKey] = {
              ...dungeon,
              floors: optimizedFloors
            }
          }
        })
      }
      
      const dataStr = JSON.stringify(optimizedState)
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
      alert('Export failed')
    }
  }, [state])

  // Import state from JSON file
  const importState = useCallback((file) => {
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedState = JSON.parse(e.target.result)
          
          // Process the imported state through the same conversion logic as loadStateFromStorage
          let processedState
          
          // Check if it's old format (has floors property directly)
          if (importedState.floors && !importedState.dungeons && !importedState.maps) {
            // Convert old format to new format
            processedState = {
              currentDungeon: 1,
              currentFloor: importedState.currentFloor || 1,
              gridSize: importedState.gridSize || { rows: 20, cols: 20 },
              zoom: importedState.zoom || 1.0,
              activeTool: importedState.activeTool || 'block_color',
              showNoteTooltips: importedState.showNoteTooltips !== undefined ? importedState.showNoteTooltips : true,
              dungeons: {
                1: {
                  name: 'Dungeon 1',
                  floors: {}
                }
              },
              dungeonNames: {
                1: 'Dungeon 1'
              }
            }
            
            // Convert old floors to new format and ensure doors property exists
            Object.keys(importedState.floors).forEach(floorKey => {
              const floor = importedState.floors[floorKey]
              if (!floor.doors) {
                floor.doors = []
              }
              processedState.dungeons[1].floors[floorKey] = floor
            })
            
            // Fill missing floors up to MAX_FLOORS
            for (let i = 1; i <= MAX_FLOORS; i++) {
              if (!processedState.dungeons[1].floors[i]) {
                processedState.dungeons[1].floors[i] = createEmptyFloor(processedState.gridSize)
              }
            }
          }
          // Convert maps format to dungeons format
          else if (importedState.maps && !importedState.dungeons) {
            processedState = {
              currentDungeon: importedState.currentMap || 1,
              currentFloor: importedState.currentFloor || 1,
              gridSize: importedState.gridSize || { rows: 20, cols: 20 },
              zoom: importedState.zoom || 1.0,
              activeTool: importedState.activeTool || 'block_color',
              showNoteTooltips: importedState.showNoteTooltips !== undefined ? importedState.showNoteTooltips : true,
              dungeons: {},
              dungeonNames: {}
            }
            
            // Convert maps to dungeons
            Object.keys(importedState.maps).forEach(mapKey => {
              const map = importedState.maps[mapKey]
              processedState.dungeons[mapKey] = {
                name: map.name ? map.name.replace(/^Map /, 'Dungeon ') : `Dungeon ${mapKey}`,
                floors: map.floors || {}
              }
              
              // Ensure doors property exists for all floors
              if (processedState.dungeons[mapKey].floors) {
                Object.keys(processedState.dungeons[mapKey].floors).forEach(floorKey => {
                  if (!processedState.dungeons[mapKey].floors[floorKey].doors) {
                    processedState.dungeons[mapKey].floors[floorKey].doors = []
                  }
                })
              }
            })
            
            // Convert mapNames to dungeonNames
            if (importedState.mapNames) {
              Object.keys(importedState.mapNames).forEach(mapKey => {
                const oldName = importedState.mapNames[mapKey]
                processedState.dungeonNames[mapKey] = oldName.replace(/^Map /, 'Dungeon ')
              })
            }
          }
          // New format - ensure doors property exists for all floors in all dungeons
          else if (importedState.dungeons) {
            processedState = importedState
            Object.keys(processedState.dungeons).forEach(dungeonKey => {
              const dungeon = processedState.dungeons[dungeonKey]
              if (dungeon.floors) {
                Object.keys(dungeon.floors).forEach(floorKey => {
                  if (!dungeon.floors[floorKey].doors) {
                    dungeon.floors[floorKey].doors = []
                  }
                })
              }
            })
          }
          // Check if it's a valid DMapper file format
          else {
            alert('Unsupported file format. Please select a JSON file exported from DMapper.')
            return
          }
          
          setState(processedState)
          historyRef.current = [JSON.parse(JSON.stringify(processedState))]
          historyIndexRef.current = 0
          
          alert('Import completed successfully')
        } catch (error) {
          console.error('Failed to parse imported file:', error)
          alert('Failed to read file. Please select a valid JSON file.')
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error('Failed to import state:', error)
      alert('Import failed')
    }
  }, [])

  // Reset current floor data
  const resetCurrentFloor = useCallback(() => {
    updateState(state => ({
      ...state,
      dungeons: {
        ...state.dungeons,
        [state.currentDungeon]: {
          ...state.dungeons[state.currentDungeon],
          floors: {
            ...state.dungeons[state.currentDungeon].floors,
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
      const dungeonName = state.dungeonNames?.[state.currentDungeon] || `Dungeon ${state.currentDungeon}`
      const svgContent = exportFloorAsSVG(floorData, state.gridSize, dungeonName, state.currentFloor)
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const filename = `${dungeonName.replace(/[^a-z0-9]/gi, '_')}_Floor_${state.currentFloor}_${timestamp}.svg`
      downloadSVG(svgContent, filename)
    } catch (error) {
      console.error('Failed to export SVG:', error)
      alert('SVG export failed')
    }
  }, [state, getCurrentFloorData])

  return {
    state,
    updateState,
    undo,
    redo,
    setCurrentDungeon,
    setCurrentFloor,
    setDungeonName,
    setZoom,
    setActiveTool,
    setGridSize,
    toggleNoteTooltips,
    updateCurrentFloorData,
    getCurrentFloorData,
    resetCurrentFloor,
    exportState,
    importState,
    exportFloorSVG
  }
}