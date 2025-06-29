import { useState, useCallback, useRef, useEffect } from 'react'
import { MAX_FLOORS, MAX_DUNGEONS } from '../utils/constants'
import { exportFloorAsSVG, downloadSVG } from '../utils/svgExport'
import { getMessage } from '../utils/messages'
import { getTheme } from '../utils/themes'

const createEmptyFloor = (gridSize) => ({
  grid: new Array(gridSize.rows).fill(null).map(() => new Array(gridSize.cols).fill(null)),
  walls: [],
  items: [],
  doors: [],
  notes: []
})

const createEmptyDungeon = (gridSize) => {
  const floors = {}
  for (let i = 1; i <= MAX_FLOORS; i++) {
    floors[i] = createEmptyFloor(gridSize)
  }
  return floors
}

// Transform floor data to match new grid size
const transformFloorToNewGridSize = (floor, oldGridSize, newGridSize) => {
  if (!floor || !oldGridSize || !newGridSize) return floor
  
  const oldRows = oldGridSize.rows
  const newGrid = new Array(newGridSize.rows).fill(null).map(() => new Array(newGridSize.cols).fill(null))
  
  // Copy existing grid data that fits in new grid
  if (floor.grid) {
    for (let row = 0; row < Math.min(floor.grid.length, newGridSize.rows); row++) {
      for (let col = 0; col < Math.min(floor.grid[row]?.length || 0, newGridSize.cols); col++) {
        newGrid[row][col] = floor.grid[row][col]
      }
    }
  }
  
  // Filter and transform items
  const transformedItems = (floor.items || []).filter(
    item => item.row < newGridSize.rows && item.col < newGridSize.cols
  )
  
  // Transform walls coordinates
  const transformedWalls = (floor.walls || []).map(wall => {
    let newStartRow, newEndRow
    
    if (wall.startCol === wall.endCol) {
      // Vertical wall - keep coordinates as-is since Walls.jsx handles the transformation
      newStartRow = wall.startRow
      newEndRow = wall.endRow
    } else {
      // Horizontal wall - transform the row coordinate to bottom-up system
      newStartRow = newGridSize.rows - (oldRows - wall.startRow)
      newEndRow = newGridSize.rows - (oldRows - wall.endRow)
    }
    
    return {
      ...wall,
      startRow: newStartRow,
      endRow: newEndRow
    }
  }).filter(wall => {
    const isVertical = wall.startCol === wall.endCol
    
    if (isVertical) {
      return wall.startRow >= 0 && wall.endRow >= 0 &&
             wall.startRow <= newGridSize.rows && wall.endRow <= newGridSize.rows &&
             wall.startCol >= 0 && wall.endCol >= 0 &&
             wall.startCol <= newGridSize.cols && wall.endCol <= newGridSize.cols
    } else {
      return wall.startRow >= 0 && wall.endRow >= 0 &&
             wall.startRow <= newGridSize.rows && wall.endRow <= newGridSize.rows &&
             wall.startCol >= 0 && wall.endCol >= 0 &&
             wall.startCol <= newGridSize.cols && wall.endCol <= newGridSize.cols
    }
  })
  
  // Transform doors coordinates
  const transformedDoors = (floor.doors || []).map(door => {
    let newStartRow, newEndRow
    
    if (door.startCol === door.endCol) {
      // Vertical door - keep coordinates as-is since rendering handles the transformation
      newStartRow = door.startRow
      newEndRow = door.endRow
    } else {
      // Horizontal door - transform the row coordinate to bottom-up system
      newStartRow = newGridSize.rows - (oldRows - door.startRow)
      newEndRow = newGridSize.rows - (oldRows - door.endRow)
    }
    
    return {
      ...door,
      startRow: newStartRow,
      endRow: newEndRow
    }
  }).filter(door => {
    const isVertical = door.startCol === door.endCol
    
    if (isVertical) {
      return door.startRow >= 0 && door.endRow >= 0 &&
             door.startRow <= newGridSize.rows && door.endRow <= newGridSize.rows &&
             door.startCol >= 0 && door.endCol >= 0 &&
             door.startCol <= newGridSize.cols && door.endCol <= newGridSize.cols
    } else {
      return door.startRow >= 0 && door.endRow >= 0 &&
             door.startRow <= newGridSize.rows && door.endRow <= newGridSize.rows &&
             door.startCol >= 0 && door.endCol >= 0 &&
             door.startCol <= newGridSize.cols && door.endCol <= newGridSize.cols
    }
  })
  
  // Filter notes to remove those outside new grid bounds
  const transformedNotes = (floor.notes || []).filter(
    note => note.row < newGridSize.rows && note.col < newGridSize.cols
  )
  
  return {
    ...floor,
    grid: newGrid,
    items: transformedItems,
    walls: transformedWalls,
    doors: transformedDoors,
    notes: transformedNotes
  }
}

const INITIAL_STATE = {
  currentDungeon: 1,
  currentFloor: 1,
  gridSize: { rows: 20, cols: 20 },
  zoom: 1.0,
  activeTool: 'block_color',
  showNoteTooltips: true,
  language: 'ja',
  theme: 'default',
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
          showNoteTooltips: parsedState.showNoteTooltips !== undefined ? parsedState.showNoteTooltips : true,
          language: parsedState.language || 'ja',
          theme: parsedState.theme || 'default',
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
        
        // Convert old floors to new format and ensure doors and notes properties exist
        Object.keys(parsedState.floors).forEach(floorKey => {
          const floor = parsedState.floors[floorKey]
          if (!floor.doors) {
            floor.doors = []
          }
          if (!floor.notes) {
            floor.notes = []
          }
          // Migrate existing note items to notes array
          if (floor.items) {
            const noteItems = floor.items.filter(item => item.type === 'note')
            const nonNoteItems = floor.items.filter(item => item.type !== 'note')
            floor.notes = noteItems.map(item => ({
              row: item.row,
              col: item.col,
              text: item.text || '',
              id: item.id || (Date.now() + Math.random()).toString()
            }))
            floor.items = nonNoteItems
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
          language: parsedState.language || 'ja',
          theme: parsedState.theme || 'default',
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
          
          // Ensure doors and notes properties exist for all floors, and migrate notes
          if (convertedState.dungeons[mapKey].floors) {
            Object.keys(convertedState.dungeons[mapKey].floors).forEach(floorKey => {
              const floor = convertedState.dungeons[mapKey].floors[floorKey]
              if (!floor.doors) {
                floor.doors = []
              }
              if (!floor.notes) {
                floor.notes = []
              }
              // Migrate existing note items to notes array
              if (floor.items) {
                const noteItems = floor.items.filter(item => item.type === 'note')
                const nonNoteItems = floor.items.filter(item => item.type !== 'note')
                floor.notes = noteItems.map(item => ({
                  row: item.row,
                  col: item.col,
                  text: item.text || '',
                  id: item.id || (Date.now() + Math.random()).toString()
                }))
                floor.items = nonNoteItems
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
      
      // New format - ensure doors and notes properties exist for all floors in all dungeons, and migrate notes
      if (parsedState.dungeons) {
        Object.keys(parsedState.dungeons).forEach(dungeonKey => {
          const dungeon = parsedState.dungeons[dungeonKey]
          if (dungeon.floors) {
            Object.keys(dungeon.floors).forEach(floorKey => {
              const floor = dungeon.floors[floorKey]
              if (!floor.doors) {
                floor.doors = []
              }
              if (!floor.notes) {
                floor.notes = []
              }
              // Migrate existing note items to notes array
              if (floor.items) {
                const noteItems = floor.items.filter(item => item.type === 'note')
                const nonNoteItems = floor.items.filter(item => item.type !== 'note')
                if (noteItems.length > 0) {
                  floor.notes = noteItems.map(item => ({
                    row: item.row,
                    col: item.col,
                    text: item.text || '',
                    id: item.id || (Date.now() + Math.random()).toString()
                  }))
                  floor.items = nonNoteItems
                }
              }
            })
          }
        })
      }
      
      // Ensure language exists
      if (!parsedState.language) {
        parsedState.language = 'ja'
      }
      
      // Ensure theme exists
      if (!parsedState.theme) {
        parsedState.theme = 'default'
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
          const oldGridSize = { rows: dungeon.floors[floorKey].grid?.length || state.gridSize.rows, cols: state.gridSize.cols }
          newState.dungeons[dungeonKey].floors[floorKey] = transformFloorToNewGridSize(
            dungeon.floors[floorKey], 
            oldGridSize, 
            newSize
          )
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

  const setLanguage = useCallback((language) => {
    updateState(state => ({ ...state, language }))
  }, [updateState])

  const setTheme = useCallback((theme) => {
    updateState(state => ({ ...state, theme }))
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
      alert(getMessage(state.language, 'exportFailed'))
    }
  }, [state])

  // Export single dungeon as JSON file
  const exportDungeon = useCallback((dungeonId) => {
    try {
      if (!state.dungeons[dungeonId]) {
        alert(getMessage(state.language, 'dungeonNotExists'))
        return
      }

      const dungeonData = {
        dungeon: {
          id: dungeonId,
          name: state.dungeonNames[dungeonId] || `Dungeon ${dungeonId}`,
          data: state.dungeons[dungeonId]
        },
        gridSize: state.gridSize,
        exportType: 'single_dungeon',
        exportedAt: new Date().toISOString()
      }

      const dataStr = JSON.stringify(dungeonData)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const dungeonName = (state.dungeonNames[dungeonId] || `Dungeon_${dungeonId}`).replace(/[\\/:*?"<>|]/g, '_')
      const link = document.createElement('a')
      link.href = url
      link.download = `${dungeonName}_${timestamp}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export dungeon:', error)
      alert(getMessage(state.language, 'dungeonExportFailed'))
    }
  }, [state])

  // Import single dungeon from JSON file
  const importDungeon = useCallback((file, targetSlotId) => {
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          
          // Validate dungeon export format
          if (!importedData.dungeon || importedData.exportType !== 'single_dungeon') {
            alert(getMessage(state.language, 'invalidDungeonFile'))
            return
          }

          const dungeonData = importedData.dungeon
          
          // Use provided target slot or find next available slot
          let targetDungeonId = targetSlotId
          if (!targetDungeonId) {
            for (let i = 1; i <= MAX_DUNGEONS; i++) {
              if (!state.dungeons[i] || isFloorEmpty(state.dungeons[i])) {
                targetDungeonId = i
                break
              }
            }
            if (!targetDungeonId) {
              alert(getMessage(state.language, 'noAvailableSlots'))
              return
            }
          }

          // Confirm load operation
          let loadMessage
          if (targetSlotId) {
            if (state.dungeons[targetSlotId] && !isFloorEmpty(state.dungeons[targetSlotId])) {
              loadMessage = getMessage(state.language, 'loadDungeonOverwrite', {
                name: dungeonData.name,
                slot: targetSlotId,
                currentName: state.dungeonNames[targetSlotId] || `Dungeon ${targetSlotId}`
              })
            } else {
              loadMessage = getMessage(state.language, 'loadDungeon', {
                name: dungeonData.name,
                slot: targetSlotId
              })
            }
          } else {
            loadMessage = getMessage(state.language, 'loadDungeonAutoSlot', {
              name: dungeonData.name
            })
          }
          
          if (!window.confirm(loadMessage)) {
            return
          }

          // Ensure all floors have doors and notes properties, migrate notes, and transform coordinates if needed
          if (dungeonData.data && dungeonData.data.floors) {
            const importedGridSize = importedData.gridSize || { rows: 20, cols: 20 }
            
            Object.keys(dungeonData.data.floors).forEach(floorKey => {
              const floor = dungeonData.data.floors[floorKey]
              if (!floor.doors) {
                floor.doors = []
              }
              if (!floor.notes) {
                floor.notes = []
              }
              // Migrate existing note items to notes array
              if (floor.items) {
                const noteItems = floor.items.filter(item => item.type === 'note')
                const nonNoteItems = floor.items.filter(item => item.type !== 'note')
                if (noteItems.length > 0) {
                  floor.notes = noteItems.map(item => ({
                    row: item.row,
                    col: item.col,
                    text: item.text || '',
                    id: item.id || (Date.now() + Math.random()).toString()
                  }))
                  floor.items = nonNoteItems
                }
              }
              
              // Transform floor data to match current grid size if different
              if (importedGridSize.rows !== state.gridSize.rows || importedGridSize.cols !== state.gridSize.cols) {
                dungeonData.data.floors[floorKey] = transformFloorToNewGridSize(
                  floor,
                  importedGridSize,
                  state.gridSize
                )
              }
            })
          }

          // Import the dungeon
          updateState(state => ({
            ...state,
            dungeons: {
              ...state.dungeons,
              [targetDungeonId]: dungeonData.data
            },
            dungeonNames: {
              ...state.dungeonNames,
              [targetDungeonId]: dungeonData.name
            },
            currentDungeon: targetDungeonId
          }))

          alert(getMessage(state.language, 'dungeonLoadSuccess', { slot: targetDungeonId }))
        } catch (error) {
          console.error('Failed to parse imported dungeon file:', error)
          alert(getMessage(state.language, 'invalidJsonFile'))
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error('Failed to import dungeon:', error)
      alert(getMessage(state.language, 'dungeonImportFailed'))
    }
  }, [state, updateState])

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
              language: importedState.language || 'ja',
              theme: importedState.theme || 'default',
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
            
            // Convert old floors to new format and ensure doors and notes properties exist
            Object.keys(importedState.floors).forEach(floorKey => {
              const floor = importedState.floors[floorKey]
              if (!floor.doors) {
                floor.doors = []
              }
              if (!floor.notes) {
                floor.notes = []
              }
              // Migrate existing note items to notes array
              if (floor.items) {
                const noteItems = floor.items.filter(item => item.type === 'note')
                const nonNoteItems = floor.items.filter(item => item.type !== 'note')
                floor.notes = noteItems.map(item => ({
                  row: item.row,
                  col: item.col,
                  text: item.text || '',
                  id: item.id || (Date.now() + Math.random()).toString()
                }))
                floor.items = nonNoteItems
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
              language: importedState.language || 'ja',
              theme: importedState.theme || 'default',
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
              
              // Ensure doors and notes properties exist for all floors, and migrate notes
              if (processedState.dungeons[mapKey].floors) {
                Object.keys(processedState.dungeons[mapKey].floors).forEach(floorKey => {
                  const floor = processedState.dungeons[mapKey].floors[floorKey]
                  if (!floor.doors) {
                    floor.doors = []
                  }
                  if (!floor.notes) {
                    floor.notes = []
                  }
                  // Migrate existing note items to notes array
                  if (floor.items) {
                    const noteItems = floor.items.filter(item => item.type === 'note')
                    const nonNoteItems = floor.items.filter(item => item.type !== 'note')
                    floor.notes = noteItems.map(item => ({
                      row: item.row,
                      col: item.col,
                      text: item.text || '',
                      id: item.id || (Date.now() + Math.random()).toString()
                    }))
                    floor.items = nonNoteItems
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
          // New format - ensure doors and notes properties exist for all floors in all dungeons, and migrate notes
          else if (importedState.dungeons) {
            processedState = importedState
            Object.keys(processedState.dungeons).forEach(dungeonKey => {
              const dungeon = processedState.dungeons[dungeonKey]
              if (dungeon.floors) {
                Object.keys(dungeon.floors).forEach(floorKey => {
                  const floor = dungeon.floors[floorKey]
                  if (!floor.doors) {
                    floor.doors = []
                  }
                  if (!floor.notes) {
                    floor.notes = []
                  }
                  // Migrate existing note items to notes array
                  if (floor.items) {
                    const noteItems = floor.items.filter(item => item.type === 'note')
                    const nonNoteItems = floor.items.filter(item => item.type !== 'note')
                    if (noteItems.length > 0) {
                      floor.notes = noteItems.map(item => ({
                        row: item.row,
                        col: item.col,
                        text: item.text || '',
                        id: item.id || (Date.now() + Math.random()).toString()
                      }))
                      floor.items = nonNoteItems
                    }
                  }
                })
              }
            })
          }
          // Check if it's a valid DMapper file format
          else {
            alert(getMessage(state.language, 'unsupportedFileFormat'))
            return
          }
          
          // Confirm import operation
          if (!window.confirm(getMessage(state.language, 'importAllData'))) {
            return
          }
          
          // Handle grid size differences
          if (processedState.gridSize.rows !== state.gridSize.rows || processedState.gridSize.cols !== state.gridSize.cols) {
            const importedGridSize = processedState.gridSize
            const currentGridSize = state.gridSize
            
            // Ask user whether to restore imported grid size or keep current one
            const restoreGridSizeMessage = getMessage(state.language, 'restoreImportedGridSize', {
              oldRows: currentGridSize.rows,
              oldCols: currentGridSize.cols,
              newRows: importedGridSize.rows,
              newCols: importedGridSize.cols
            })
            
            const restoreGridSize = window.confirm(restoreGridSizeMessage)
            
            if (restoreGridSize) {
              // Keep imported grid size - no coordinate transformation needed
              processedState.gridSize = importedGridSize
            } else {
              // Keep current grid size - transform coordinates
              Object.keys(processedState.dungeons).forEach(dungeonKey => {
                const dungeon = processedState.dungeons[dungeonKey]
                if (dungeon.floors) {
                  Object.keys(dungeon.floors).forEach(floorKey => {
                    processedState.dungeons[dungeonKey].floors[floorKey] = transformFloorToNewGridSize(
                      dungeon.floors[floorKey],
                      importedGridSize,
                      currentGridSize
                    )
                  })
                }
              })
              processedState.gridSize = currentGridSize
            }
          }
          
          setState(processedState)
          historyRef.current = [JSON.parse(JSON.stringify(processedState))]
          historyIndexRef.current = 0
          
          alert(getMessage(state.language, 'importCompleted'))
        } catch (error) {
          console.error('Failed to parse imported file:', error)
          alert(getMessage(state.language, 'invalidJsonFile'))
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error('Failed to import state:', error)
      alert(getMessage(state.language, 'importFailed'))
    }
  }, [state])

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

  // Reset all dungeons
  const resetAllDungeons = useCallback(() => {
    updateState(state => ({
      ...state,
      currentDungeon: 1,
      currentFloor: 1,
      dungeons: {
        1: {
          name: 'Dungeon 1',
          floors: createEmptyDungeon(state.gridSize)
        }
      },
      dungeonNames: {
        1: 'Dungeon 1'
      }
    }))
  }, [updateState])

  // Note management functions
  const getNoteAt = useCallback((row, col) => {
    const floorData = getCurrentFloorData()
    return (floorData.notes || []).find(note => note.row === row && note.col === col)
  }, [getCurrentFloorData])

  const setNoteAt = useCallback((row, col, text) => {
    updateState(state => {
      const currentFloor = state.dungeons[state.currentDungeon]?.floors[state.currentFloor]
      if (!currentFloor) return state

      const notes = [...(currentFloor.notes || [])]
      const existingIndex = notes.findIndex(note => note.row === row && note.col === col)
      
      if (text.trim()) {
        const noteData = {
          row,
          col,
          text: text.trim(),
          id: Date.now() + Math.random()
        }
        
        if (existingIndex >= 0) {
          notes[existingIndex] = noteData
        } else {
          notes.push(noteData)
        }
      } else if (existingIndex >= 0) {
        notes.splice(existingIndex, 1)
      }

      return {
        ...state,
        dungeons: {
          ...state.dungeons,
          [state.currentDungeon]: {
            ...state.dungeons[state.currentDungeon],
            floors: {
              ...state.dungeons[state.currentDungeon].floors,
              [state.currentFloor]: {
                ...currentFloor,
                notes
              }
            }
          }
        }
      }
    })
  }, [updateState])

  const deleteNoteAt = useCallback((row, col) => {
    updateState(state => {
      const currentFloor = state.dungeons[state.currentDungeon]?.floors[state.currentFloor]
      if (!currentFloor) return state

      const notes = (currentFloor.notes || []).filter(note => !(note.row === row && note.col === col))

      return {
        ...state,
        dungeons: {
          ...state.dungeons,
          [state.currentDungeon]: {
            ...state.dungeons[state.currentDungeon],
            floors: {
              ...state.dungeons[state.currentDungeon].floors,
              [state.currentFloor]: {
                ...currentFloor,
                notes
              }
            }
          }
        }
      }
    })
  }, [updateState])

  const moveNoteAt = useCallback((fromRow, fromCol, toRow, toCol) => {
    updateState(state => {
      const currentFloor = state.dungeons[state.currentDungeon]?.floors[state.currentFloor]
      if (!currentFloor) return state

      const notes = [...(currentFloor.notes || [])]
      const sourceIndex = notes.findIndex(note => note.row === fromRow && note.col === fromCol)
      
      if (sourceIndex === -1) return state // Source note not found
      
      const sourceNote = notes[sourceIndex]
      const targetIndex = notes.findIndex(note => note.row === toRow && note.col === toCol)
      
      // Remove source note
      notes.splice(sourceIndex, 1)
      
      // If there's a target note, remove it too (overwrite)
      if (targetIndex !== -1) {
        const adjustedTargetIndex = targetIndex > sourceIndex ? targetIndex - 1 : targetIndex
        notes.splice(adjustedTargetIndex, 1)
      }
      
      // Add note at new position
      notes.push({
        row: toRow,
        col: toCol,
        text: sourceNote.text,
        id: Date.now() + Math.random()
      })

      return {
        ...state,
        dungeons: {
          ...state.dungeons,
          [state.currentDungeon]: {
            ...state.dungeons[state.currentDungeon],
            floors: {
              ...state.dungeons[state.currentDungeon].floors,
              [state.currentFloor]: {
                ...currentFloor,
                notes
              }
            }
          }
        }
      }
    })
  }, [updateState])

  // Export current floor as SVG
  const exportFloorSVG = useCallback(() => {
    try {
      const floorData = getCurrentFloorData()
      const dungeonName = state.dungeonNames?.[state.currentDungeon] || `Dungeon ${state.currentDungeon}`
      const currentTheme = getTheme(state.theme)
      const svgContent = exportFloorAsSVG(floorData, state.gridSize, dungeonName, state.currentFloor, currentTheme)
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const filename = `${dungeonName.replace(/[\\/:*?"<>|]/g, '_')}_Floor_${state.currentFloor}_${timestamp}.svg`
      downloadSVG(svgContent, filename)
    } catch (error) {
      console.error('Failed to export SVG:', error)
      alert(getMessage(state.language, 'svgExportFailed'))
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
    setLanguage,
    setTheme,
    currentTheme: getTheme(state.theme),
    updateCurrentFloorData,
    getCurrentFloorData,
    resetCurrentFloor,
    resetAllDungeons,
    exportState,
    importState,
    exportDungeon,
    importDungeon,
    exportFloorSVG,
    getNoteAt,
    setNoteAt,
    deleteNoteAt,
    moveNoteAt
  }
}