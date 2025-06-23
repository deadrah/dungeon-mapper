import React from 'react'
import { TOOLS } from '../../utils/constants'

const TOOL_GROUPS = [
  {
    name: 'Line Tools',
    tools: [
      { id: TOOLS.LINE, name: 'Line [1]', icon: '│', description: 'Draw walls', key: '1' },
      { id: 'spacer_1', name: '', icon: '', description: 'Spacer', isDisabled: true },
      { id: TOOLS.DOOR_OPEN, name: 'Door Open [2]', icon: 'DOOR_OPEN_SVG', description: 'Open door (transparent)', key: '2' },
      { id: TOOLS.DOOR_CLOSED, name: 'Door Closed [3]', icon: 'DOOR_CLOSED_SVG', description: 'Closed door (black)', key: '3' },
      { id: TOOLS.LINE_ARROW_NORTH, name: 'Line Arrow', icon: '↑', description: 'One-way door north', key: '' },
      { id: TOOLS.LINE_ARROW_SOUTH, name: 'Line Arrow', icon: '↓', description: 'One-way door south', key: '' },
      { id: TOOLS.LINE_ARROW_WEST, name: 'Line Arrow', icon: '←', description: 'One-way door west', key: '' },
      { id: TOOLS.LINE_ARROW_EAST, name: 'Line Arrow', icon: '→', description: 'One-way door east', key: '' },
    ]
  },
  {
    name: 'Grid Tools',
    tools: [
      { id: TOOLS.BLOCK_COLOR, name: 'Fill [4]', icon: '█', description: 'Fill grid blocks', key: '4' },
      { id: TOOLS.DARK_ZONE, name: 'Dark Zone', icon: 'Ξ', description: 'Dark area', key: '' },
      { id: TOOLS.CHEST, name: 'Chest [5]', icon: '□', description: 'Treasure chest', key: '5' },
      { id: TOOLS.WARP_POINT, name: 'Teleport', icon: '◊', description: 'Teleport point', key: '' },
      { id: TOOLS.SHUTE, name: 'Shute/Pit', icon: '●', description: 'Shute / Pit', key: '' },
      { id: TOOLS.ELEVATOR, name: 'Elevator', icon: 'E', description: 'Elevator', key: '' },
      { id: TOOLS.STAIRS_UP_SVG, name: 'Stairs Up', icon: '▲', description: 'Stairs going up', key: '' },
      { id: TOOLS.STAIRS_DOWN_SVG, name: 'Stairs Down', icon: '▼', description: 'Stairs going down', key: '' },
      { id: TOOLS.EVENT_MARKER, name: 'Event', icon: '!', description: 'Event marker', key: '' },
      { id: TOOLS.NOTE, name: 'Note', icon: 'NOTE_SVG', description: 'Text memo', key: '' },
      { id: TOOLS.ARROW_NORTH, name: 'Arrow', icon: '↑', description: 'North arrow', key: '' },
      { id: TOOLS.ARROW_SOUTH, name: 'Arrow', icon: '↓', description: 'South arrow', key: '' },
      { id: TOOLS.ARROW_WEST, name: 'Arrow', icon: '←', description: 'West arrow', key: '' },
      { id: TOOLS.ARROW_EAST, name: 'Arrow', icon: '→', description: 'East arrow', key: '' },
      { id: TOOLS.CURRENT_POSITION, name: 'CurrentPos [q]', icon: '●', description: 'Current position marker', key: 'q' },
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
    <div className="md:w-48 w-full bg-gray-800 text-white flex flex-col md:max-h-none max-h-44">
      <div className="p-2 text-center text-sm font-bold border-b border-gray-600 md:block hidden">
        Tools
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-auto md:overflow-x-hidden">
        {TOOL_GROUPS.map((group, groupIndex) => (
          <div key={group.name} className="md:block">
            <div className="px-2 py-1 text-xs font-bold bg-gray-700 border-b border-gray-600 md:block hidden">
              {group.name}
            </div>
            <div className={`md:grid md:grid-cols-2 md:gap-px md:p-0 p-2 ${
              group.name === 'Grid Tools' 
                ? 'grid grid-cols-8 gap-1' // モバイルでGrid Toolsは8列グリッド（16個のツールを2行で表示）
                : 'flex gap-1' // Line Toolsは従来通り横スクロール
            }`}>
              {group.tools.map((tool) => {
                // Handle spacer items (non-interactive)
                if (tool.isDisabled) {
                  return (
                    <div
                      key={tool.id}
                      className={`md:py-1 py-1 flex flex-col items-center justify-center text-xs border-b border-gray-700 bg-gray-800 md:block hidden ${
                        group.name === 'Grid Tools' ? 'md:min-w-0' : 'md:min-w-0 min-w-12'
                      }`}
                    >
                      <span className="text-lg">
                      {tool.icon === 'NOTE_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em'}}>
                          <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          <path d="M6 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M6 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : tool.icon === 'DOOR_OPEN_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em'}}>
                          <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          <path d="M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : tool.icon === 'DOOR_CLOSED_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em'}}>
                          <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
                          <path d="M8 2v12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : tool.icon}
                    </span>
                      <span className="text-xs truncate w-full text-center px-1 md:block hidden">{tool.name}</span>
                    </div>
                  )
                }
                
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`md:py-1 py-1 flex flex-col items-center justify-center text-xs border-b border-gray-700 transition-colors hover:bg-gray-600 rounded md:rounded-none ${
                      group.name === 'Grid Tools' 
                        ? 'md:min-w-0' // Grid Toolsはグリッド表示
                        : 'md:min-w-0 min-w-12' // Line Toolsは最小幅設定
                    } ${activeTool === tool.id ? 'text-white' : ''}`}
                    style={activeTool === tool.id ? { backgroundColor: '#496fc1' } : {}}
                    title={`${tool.name} - ${tool.description}${tool.key ? ` (${tool.key})` : ''}`}
                  >
                    <span className="text-lg">
                      {tool.icon === 'NOTE_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em'}}>
                          <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          <path d="M6 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M6 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : tool.icon === 'DOOR_OPEN_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em'}}>
                          <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          <path d="M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : tool.icon === 'DOOR_CLOSED_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em'}}>
                          <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
                          <path d="M8 2v12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : tool.icon}
                    </span>
                    <span className="text-xs truncate w-full text-center px-1 md:block hidden">{tool.name}</span>
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

// Export function to get tool name by ID
export const getToolName = (toolId) => {
  let foundTool = null
  TOOL_GROUPS.forEach(group => {
    group.tools.forEach(tool => {
      if (tool.id === toolId && !tool.isDisabled) {
        foundTool = tool
      }
    })
  })
  return foundTool ? foundTool.name : 'Unknown Tool'
}

export default ToolPanel