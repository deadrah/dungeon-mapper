import React from 'react'
import { TOOLS } from '../../utils/constants'

const TOOL_GROUPS = [
  {
    name: 'Line Tools',
    tools: [
      { id: TOOLS.LINE, name: 'Line [1]', icon: '│', description: 'Draw walls', key: '1' },
      { id: 'spacer_1', name: '', icon: '', description: 'Spacer', isDisabled: true },
      { id: TOOLS.DOOR_OPEN, name: 'Door Open [2]', icon: '□', description: 'Open door (transparent)', key: '2' },
      { id: TOOLS.DOOR_CLOSED, name: 'Door Closed [3]', icon: '█', description: 'Closed door (black)', key: '3' },
      { id: TOOLS.LINE_ARROW_NORTH, name: 'Line Arrow', icon: '↑', description: 'One-way door north', key: '' },
      { id: TOOLS.LINE_ARROW_SOUTH, name: 'Line Arrow', icon: '↓', description: 'One-way door south', key: '' },
      { id: TOOLS.LINE_ARROW_WEST, name: 'Line Arrow', icon: '←', description: 'One-way door west', key: '' },
      { id: TOOLS.LINE_ARROW_EAST, name: 'Line Arrow', icon: '→', description: 'One-way door east', key: '' },
    ]
  },
  {
    name: 'Grid Tools',
    tools: [
      { id: TOOLS.BLOCK_COLOR, name: 'Fill [4]', icon: '■', description: 'Fill grid blocks', key: '4' },
      { id: TOOLS.DARK_ZONE, name: 'Dark Zone', icon: 'Ξ', description: 'Dark area', key: '' },
      { id: TOOLS.CHEST, name: 'Chest [5]', icon: '□', description: 'Treasure chest', key: '5' },
      { id: TOOLS.WARP_POINT, name: 'Warp', icon: '◊', description: 'Teleport point', key: '' },
      { id: TOOLS.SHUTE, name: 'Shute', icon: '●', description: 'Shute', key: '' },
      { id: TOOLS.ELEVATOR, name: 'Elevator', icon: 'E', description: 'Elevator', key: '' },
      { id: TOOLS.STAIRS_UP_SVG, name: 'Stairs Up', icon: '▲', description: 'Stairs going up', key: '' },
      { id: TOOLS.STAIRS_DOWN_SVG, name: 'Stairs Down', icon: '▼', description: 'Stairs going down', key: '' },
      { id: TOOLS.EVENT_MARKER, name: 'Event', icon: '!', description: 'Event marker', key: '' },
      { id: TOOLS.NOTE, name: 'Note', icon: '📝', description: 'Text memo', key: '' },
      { id: TOOLS.ARROW_NORTH, name: 'Arrow', icon: '↑', description: 'North arrow', key: '' },
      { id: TOOLS.ARROW_SOUTH, name: 'Arrow', icon: '↓', description: 'South arrow', key: '' },
      { id: TOOLS.ARROW_WEST, name: 'Arrow', icon: '←', description: 'West arrow', key: '' },
      { id: TOOLS.ARROW_EAST, name: 'Arrow', icon: '→', description: 'East arrow', key: '' },
      { id: TOOLS.CURRENT_POSITION, name: 'Current Position [q]', icon: '●', description: 'Current position marker', key: 'q' },
      { id: TOOLS.ERASER, name: 'Eraser [e]', icon: '⌫', description: 'Erase objects with left click/drag', key: 'e' }
    ]
  }
]

const ToolPanel = ({ activeTool, setActiveTool }) => {
  // Flatten all tools with their defined keyboard shortcuts
  const allTools = []
  TOOL_GROUPS.forEach(group => {
    group.tools.forEach(tool => {
      allTools.push(tool)
    })
  })

  // Create a key-to-tool mapping for external use
  const getKeyToToolMapping = () => {
    const keyMap = {}
    allTools.forEach(tool => {
      if (tool.key && !tool.isDisabled) {
        keyMap[tool.key.toLowerCase()] = tool.id
      }
    })
    return keyMap
  }

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-2 text-center text-sm font-bold border-b border-gray-600">
        Tools
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {TOOL_GROUPS.map((group, groupIndex) => (
          <div key={group.name}>
            <div className="px-2 py-1 text-xs font-bold bg-gray-700 border-b border-gray-600">
              {group.name}
            </div>
            <div className="grid grid-cols-2 gap-px">
              {group.tools.map((tool) => {
                // Handle spacer items (non-interactive)
                if (tool.isDisabled) {
                  return (
                    <div
                      key={tool.id}
                      className="py-2 flex flex-col items-center justify-center text-xs border-b border-gray-700 bg-gray-800"
                    >
                      <span className="text-lg">{tool.icon}</span>
                      <span className="text-xs truncate w-full text-center px-1">{tool.name}</span>
                    </div>
                  )
                }
                
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`py-2 flex flex-col items-center justify-center text-xs border-b border-gray-700 transition-colors hover:bg-gray-600 ${
                      activeTool === tool.id ? 'text-white' : ''
                    }`}
                    style={activeTool === tool.id ? { backgroundColor: '#496fc1' } : {}}
                    title={`${tool.name} - ${tool.description}${tool.key ? ` (${tool.key})` : ''}`}
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <span className="text-xs truncate w-full text-center px-1">{tool.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Export function to get key mappings
export const getToolKeyMappings = () => {
  const keyMap = {}
  TOOL_GROUPS.forEach(group => {
    group.tools.forEach(tool => {
      if (tool.key && !tool.isDisabled) {
        keyMap[tool.key.toLowerCase()] = tool.id
      }
    })
  })
  return keyMap
}

export default ToolPanel