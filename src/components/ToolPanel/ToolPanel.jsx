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
      { id: TOOLS.ARROW, name: 'Arrow', icon: '✛', description: 'Direction arrow (select direction in options)', key: '' },
      { id: TOOLS.DOOR_ITEM, name: 'Door', icon: 'DOOR_ITEM_SVG', description: 'Door item (select open/closed in options)', key: '' },
      { id: TOOLS.CURRENT_POSITION, name: 'CurrentPos [q]', icon: '🞄️', description: 'Current position marker', key: 'q' },
      { id: TOOLS.ERASER, name: 'Eraser [e]', icon: '⌫', description: 'Erase objects with left click/drag', key: 'e' }
    ]
  }
]

const ToolPanel = ({ activeTool, setActiveTool, theme }) => {
  // Flatten all tools with their defined keyboard shortcuts
  const allTools = []
  TOOL_GROUPS.forEach(group => {
    group.tools.forEach(tool => {
      allTools.push(tool)
    })
  })


  return (
    <div className="md:w-48 w-full flex flex-col md:max-h-none max-h-44" style={{ backgroundColor: theme.ui.panel, color: theme.ui.panelText }}>
     
      <div className="flex-1 overflow-y-auto overflow-x-auto md:overflow-x-hidden">
        {TOOL_GROUPS.map((group) => (
          <div key={group.name} className="md:block">
            {group.name === 'Line Tools' ? (<hr className="md:hidden mt-2 mb-1" style={{ borderColor: theme.ui.border }} />) : ''}
            <div className="px-2 py-2 text-sm font-bold md:block hidden" style={{ backgroundColor: theme.ui.groupHeader, borderColor: theme.ui.border }}>
              {group.name}
            </div>
            <div className={`md:grid md:grid-cols-2 md:p-0 p-2 ${
              group.name === 'Grid Tools' 
                ? 'grid grid-cols-8 gap-0' // モバイルでGrid Toolsは8列グリッド（16個のツールを2行で表示）
                : 'grid grid-cols-8 gap-0' // Line Toolsは従来通り横スクロール
            }`}>
              {group.tools.map((tool) => {
                // Handle spacer items (non-interactive)
                if (tool.isDisabled) {
                  return (
                    <div
                      key={tool.id}
                      className={`md:py-1 py-1 flex flex-col items-center justify-center text-xs md:block hidden ${
                        group.name === 'Grid Tools' ? 'md:min-w-0' : 'md:min-w-0 min-w-12'
                      }`}
                      style={{ 
                        backgroundColor: theme.ui.button, 
                        borderColor: theme.ui.border,
                        color: theme.ui.panelText
                      }}
                    >
                      <span className="text-lg" style={{ pointerEvents: 'none' }}>
                      {tool.icon === 'NOTE_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em', pointerEvents: 'none'}}>
                          <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          <path d="M6 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M6 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : tool.icon === 'DOOR_OPEN_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em', pointerEvents: 'none'}}>
                          <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          <path d="M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : tool.icon === 'DOOR_CLOSED_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em', pointerEvents: 'none'}}>
                          <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
                          <path d="M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : tool.icon === 'DOOR_ITEM_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em', pointerEvents: 'none'}}>
                          <rect x="1" y="2" width="2" height="20" fill="currentColor"/>
                          <rect x="19" y="2" width="2" height="20" fill="currentColor"/>
                          <line x1="11" y1="2" x2="11" y2="22" stroke="currentColor" strokeWidth="1"/>
                          <circle cx="8" cy="12" r="0.5" fill="currentColor"/>
                          <circle cx="14" cy="12" r="0.5" fill="currentColor"/>
                        </svg>
                      ) : tool.icon}
                    </span>
                      <span className="text-xs truncate w-full text-center px-1 md:block hidden" style={{ pointerEvents: 'none' }}>{tool.name}</span>
                    </div>
                  )
                }
                
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`md:py-1 py-1 flex flex-col items-center justify-center text-xs transition-all duration-200 rounded md:rounded-none ${
                      group.name === 'Grid Tools' 
                        ? 'md:min-w-0' // Grid Toolsはグリッド表示
                        : 'md:min-w-0 min-w-12' // Line Toolsは最小幅設定
                    }`}
                    style={{
                      backgroundColor: activeTool === tool.id ? theme.ui.buttonActive : theme.ui.button,
                      borderColor: theme.ui.border,
                      color: theme.ui.panelText,
                      '--hover-bg': theme.ui.buttonHover
                    }}
                    onMouseEnter={(e) => {
                      if (activeTool !== tool.id) {
                        e.currentTarget.style.backgroundColor = theme.ui.buttonHover
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTool !== tool.id) {
                        e.currentTarget.style.backgroundColor = theme.ui.button
                      }
                    }}
                    title={`${tool.name} - ${tool.description}${tool.key ? ` (${tool.key})` : ''}`}
                  >
                    <span className="text-lg" style={{ pointerEvents: 'none' }}>
                      {tool.icon === 'NOTE_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em', pointerEvents: 'none'}}>
                          <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          <path d="M6 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M6 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : tool.icon === 'DOOR_OPEN_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em', pointerEvents: 'none'}}>
                          <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          <path d="M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : tool.icon === 'DOOR_CLOSED_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em', pointerEvents: 'none'}}>
                          <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
                          <path d="M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : tool.icon === 'DOOR_ITEM_SVG' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '1.6em', pointerEvents: 'none'}}>
                          <rect x="1" y="2" width="2" height="20" fill="currentColor"/>
                          <rect x="19" y="2" width="2" height="20" fill="currentColor"/>
                          <line x1="11" y1="2" x2="11" y2="22" stroke="currentColor" strokeWidth="1"/>
                          <circle cx="8" cy="12" r="0.5" fill="currentColor"/>
                          <circle cx="14" cy="12" r="0.5" fill="currentColor"/>
                        </svg>
                      ) : tool.icon}
                    </span>
                    <span className="text-xs truncate w-full text-center px-1 md:block hidden" style={{ pointerEvents: 'none' }}>{tool.name}</span>
                  </button>
                )
              })}
            </div>
            {group.name === 'Line Tools' ? (<hr className="md:hidden mt-1" style={{ borderColor: theme.ui.border }} />) : ''}
          </div>
        ))}
      </div>
      
      {/* 固定リンクエリア（PC表示のみ） */}
      <div className="md:flex hidden px-2 py-2 flex-shrink-0 gap-1" style={{ borderColor: theme.ui.border }}>
        <a 
          href="/help/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 text-xs text-center py-1 rounded transition-colors"
          style={{ 
            color: theme.ui.panelText, 
            opacity: 0.3,
            textDecoration: 'none'
          }}
        >
          help
        </a>
        <a 
          href="/help/changelog/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 text-xs text-center py-1 rounded transition-colors"
          style={{ 
            color: theme.ui.panelText, 
            opacity: 0.3,
            textDecoration: 'none'
          }}
        >
          changelog
        </a>
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