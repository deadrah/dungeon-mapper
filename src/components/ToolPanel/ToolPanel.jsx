import React from 'react'
import { TOOLS } from '../../utils/constants'

const TOOL_GROUPS = [
  {
    name: 'Line Tools',
    tools: [
      { id: TOOLS.LINE, name: 'Line', icon: '│', description: 'Draw walls' },
      { id: TOOLS.DOOR_OPEN, name: 'Door Open', icon: '□', description: 'Open door (transparent)' },
      { id: TOOLS.DOOR_CLOSED, name: 'Door Closed', icon: '█', description: 'Closed door (black)' },
      { id: TOOLS.LINE_ARROW_NORTH, name: '↑ Line Arrow', icon: '↑', description: 'One-way door north' },
      { id: TOOLS.LINE_ARROW_SOUTH, name: '↓ Line Arrow', icon: '↓', description: 'One-way door south' },
      { id: TOOLS.LINE_ARROW_EAST, name: '→ Line Arrow', icon: '→', description: 'One-way door east' },
      { id: TOOLS.LINE_ARROW_WEST, name: '← Line Arrow', icon: '←', description: 'One-way door west' },
    ]
  },
  {
    name: 'Grid Tools',
    tools: [
      { id: TOOLS.BLOCK_COLOR, name: 'Fill', icon: '■', description: 'Fill grid blocks' },
      { id: TOOLS.DARK_ZONE, name: 'Dark Zone', icon: '●', description: 'Dark area' },
      { id: TOOLS.CHEST, name: 'Chest', icon: '□', description: 'Treasure chest' },
      { id: TOOLS.WARP_POINT, name: 'Warp', icon: '◊', description: 'Teleport point' },
      { id: TOOLS.SHUTE, name: 'Shute', icon: '○', description: 'Shute' },
      { id: TOOLS.ELEVATOR, name: 'Elevator', icon: 'E', description: 'Elevator' },
      { id: TOOLS.STAIRS_UP_SVG, name: 'Stairs Up', icon: '↑', description: 'Stairs going up' },
      { id: TOOLS.STAIRS_DOWN_SVG, name: 'Stairs Down', icon: '↓', description: 'Stairs going down' },
      { id: TOOLS.EVENT_MARKER, name: 'Event', icon: '!', description: 'Event marker' },
      { id: TOOLS.NOTE, name: 'Note', icon: '📝', description: 'Text memo' },
      { id: TOOLS.ARROW_NORTH, name: '↑ Arrow', icon: '↑', description: 'North arrow' },
      { id: TOOLS.ARROW_SOUTH, name: '↓ Arrow', icon: '↓', description: 'South arrow' },
      { id: TOOLS.ARROW_EAST, name: '→ Arrow', icon: '→', description: 'East arrow' },
      { id: TOOLS.ARROW_WEST, name: '← Arrow', icon: '←', description: 'West arrow' }
    ]
  }
]

const ToolPanel = ({ activeTool, setActiveTool }) => {
  // Flatten all tools with keyboard shortcuts
  const allTools = []
  let keyIndex = 1
  TOOL_GROUPS.forEach(group => {
    group.tools.forEach(tool => {
      allTools.push({ ...tool, keyIndex: keyIndex <= 9 ? keyIndex : null })
      keyIndex++
    })
  })

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
                const toolWithKey = allTools.find(t => t.id === tool.id)
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`h-12 flex flex-col items-center justify-center text-xs border-b border-gray-700 transition-colors hover:bg-gray-600 ${
                      activeTool === tool.id ? 'text-white' : ''
                    }`}
                    style={activeTool === tool.id ? { backgroundColor: '#496fc1' } : {}}
                    title={`${tool.name} - ${tool.description}${toolWithKey?.keyIndex ? ` (${toolWithKey.keyIndex})` : ''}`}
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

export default ToolPanel