import { TOOLS, GRID_SIZE } from './constants'

export const exportFloorAsSVG = (floorData, gridSize, mapName = 'DMapper', floorNumber = 1) => {
  const cellSize = GRID_SIZE
  const headerSize = 40
  const padding = 20
  const svgWidth = gridSize.cols * cellSize + padding * 2 + headerSize
  const svgHeight = gridSize.rows * cellSize + padding * 2 + headerSize

  // SVG header
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .grid-line { stroke: #d1d5db; stroke-width: 1; opacity: 0.7; }
      .wall-line { stroke: #1f2937; stroke-width: 3; stroke-linecap: round; }
      .door-open { fill: #ffffff; stroke: #1f2937; stroke-width: 2; }
      .door-closed { fill: #1f2937; stroke: #1f2937; stroke-width: 2; }
      .chest { fill: #8B4513; stroke: #8B4513; stroke-width: 1; }
      .chest-lock { fill: #FFD700; stroke: #FFD700; stroke-width: 1; }
      .stairs-up { fill: #0000ff; stroke: #0000ff; stroke-width: 1; }
      .stairs-down { fill: #0000ff; stroke: #0000ff; stroke-width: 1; }
      .current-position { fill: #dc143c; stroke: #dc143c; stroke-width: 2; }
      .event-marker { fill: #ca0101; stroke: #ca0101; stroke-width: 1; }
      .warp-point { fill: #06b6d4; stroke: #0891b2; stroke-width: 1; }
      .dark-zone { fill: #000000; stroke: #333333; stroke-width: 0.5; }
      .arrow { fill: #374151; stroke: #111827; stroke-width: 1; }
      .line-arrow { fill: #345dd1; stroke: #345dd1; stroke-width: 1; }
      .note-text { font-family: Arial, sans-serif; font-size: 8px; fill: #1f2937; }
      .title-text { font-family: Arial, sans-serif; font-size: 14px; fill: #1f2937; font-weight: bold; }
      .header-text { font-family: Arial, sans-serif; font-size: 10px; fill: #374151; text-anchor: middle; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="#ffffff"/>
  
  <!-- Title -->
  <text x="${padding}" y="${padding}" class="title-text">${mapName} - Floor ${floorNumber}</text>
  
  <!-- Grid container -->
  <g transform="translate(${padding + headerSize}, ${padding + headerSize})">
`

  // Add grid lines
  svg += '    <!-- Grid Lines -->\n    <g class="grid-lines">\n'
  
  // Vertical lines
  for (let col = 0; col <= gridSize.cols; col++) {
    svg += `      <line x1="${col * cellSize}" y1="0" x2="${col * cellSize}" y2="${gridSize.rows * cellSize}" class="grid-line"/>\n`
  }
  
  // Horizontal lines
  for (let row = 0; row <= gridSize.rows; row++) {
    svg += `      <line x1="0" y1="${row * cellSize}" x2="${gridSize.cols * cellSize}" y2="${row * cellSize}" class="grid-line"/>\n`
  }
  
  svg += '    </g>\n\n'

  // Add row and column headers
  svg += '    <!-- Headers -->\n    <g class="headers">\n'
  
  // Column headers (top)
  for (let col = 0; col < gridSize.cols; col++) {
    const x = col * cellSize + cellSize / 2
    const y = -10
    svg += `      <text x="${x}" y="${y}" class="header-text">${col < 10 ? `0${col}` : col}</text>\n`
  }
  
  // Row headers (left)
  for (let row = 0; row < gridSize.rows; row++) {
    const displayRow = gridSize.rows - 1 - row
    const x = -20
    const y = row * cellSize + cellSize / 2 + 3
    svg += `      <text x="${x}" y="${y}" class="header-text" text-anchor="end">${displayRow < 10 ? `0${displayRow}` : displayRow}</text>\n`
  }
  
  // Column headers (bottom)
  for (let col = 0; col < gridSize.cols; col++) {
    const x = col * cellSize + cellSize / 2
    const y = gridSize.rows * cellSize + 20
    svg += `      <text x="${x}" y="${y}" class="header-text">${col < 10 ? `0${col}` : col}</text>\n`
  }
  
  // Row headers (right)
  for (let row = 0; row < gridSize.rows; row++) {
    const displayRow = gridSize.rows - 1 - row
    const x = gridSize.cols * cellSize + 15
    const y = row * cellSize + cellSize / 2 + 3
    svg += `      <text x="${x}" y="${y}" class="header-text">${displayRow < 10 ? `0${displayRow}` : displayRow}</text>\n`
  }
  
  svg += '    </g>\n\n'

  // Add colored grid cells
  if (floorData.grid) {
    svg += '    <!-- Colored Cells -->\n    <g class="colored-cells">\n'
    
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const color = floorData.grid[row]?.[col]
        const displayRow = gridSize.rows - 1 - row
        
        if (color) {
          svg += `      <rect x="${col * cellSize + 1}" y="${displayRow * cellSize + 1}" width="${cellSize - 2}" height="${cellSize - 2}" fill="${color}" opacity="0.7"/>\n`
        } else {
          // Default light blue background for empty cells
          svg += `      <rect x="${col * cellSize + 1}" y="${displayRow * cellSize + 1}" width="${cellSize - 2}" height="${cellSize - 2}" fill="#d7e2f6" opacity="0.5"/>\n`
        }
      }
    }
    
    svg += '    </g>\n\n'
  }

  // Add walls
  if (floorData.walls && floorData.walls.length > 0) {
    svg += '    <!-- Walls -->\n    <g class="walls">\n'
    
    floorData.walls.forEach(wall => {
      const isVertical = wall.startCol === wall.endCol
      
      if (isVertical) {
        // Vertical wall
        const displayRow = gridSize.rows - 1 - wall.startRow
        const x = wall.startCol * cellSize
        const y1 = displayRow * cellSize
        const y2 = (displayRow + 1) * cellSize
        svg += `      <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" class="wall-line"/>\n`
      } else {
        // Horizontal wall
        const displayRow = wall.startRow
        const x1 = wall.startCol * cellSize
        const x2 = wall.endCol * cellSize
        const y = displayRow * cellSize
        svg += `      <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" class="wall-line"/>\n`
      }
    })
    
    svg += '    </g>\n\n'
  }

  // Add doors
  if (floorData.doors && floorData.doors.length > 0) {
    svg += '    <!-- Doors -->\n    <g class="doors">\n'
    
    floorData.doors.forEach(door => {
      const isVertical = door.startCol === door.endCol
      const isOpen = door.type === 'door_open'
      const isArrow = door.type?.startsWith('line_arrow_')
      
      if (isVertical) {
        const displayRow = gridSize.rows - 1 - door.startRow
        const centerX = door.startCol * cellSize
        const centerY = displayRow * cellSize + cellSize * 0.5
        
        if (isArrow) {
          // Arrow on vertical line - same design as main canvas
          const arrowSize = cellSize * 0.5
          const scale = arrowSize / 20 // Scale factor to match original viewBox 0 0 20 20
          svg += `      <g transform="translate(${centerX - arrowSize/2}, ${centerY - arrowSize/2}) scale(${scale})">\n`
          
          if (door.type === 'line_arrow_north') {
            svg += `        <path d="M10 1 L6 6 L8.5 6 L8.5 19 L11.5 19 L11.5 6 L14 6 Z" class="line-arrow"/>\n`
          } else if (door.type === 'line_arrow_south') {
            svg += `        <path d="M10 19 L14 14 L11.5 14 L11.5 1 L8.5 1 L8.5 14 L6 14 Z" class="line-arrow"/>\n`
          } else if (door.type === 'line_arrow_east') {
            svg += `        <path d="M19 10 L14 6 L14 8.5 L1 8.5 L1 11.5 L14 11.5 L14 14 Z" class="line-arrow"/>\n`
          } else if (door.type === 'line_arrow_west') {
            svg += `        <path d="M1 10 L6 14 L6 11.5 L19 11.5 L19 8.5 L6 8.5 L6 6 Z" class="line-arrow"/>\n`
          }
          
          svg += '      </g>\n'
        } else {
          // Regular door on vertical line
          const doorWidth = cellSize * 0.2
          const doorHeight = cellSize * 0.4
          svg += `      <rect x="${centerX - doorWidth/2}" y="${centerY - doorHeight/2}" width="${doorWidth}" height="${doorHeight}" class="${isOpen ? 'door-open' : 'door-closed'}"/>\n`
        }
      } else {
        // Horizontal door
        const displayRow = door.startRow
        const centerX = door.startCol * cellSize + cellSize * 0.5
        const centerY = displayRow * cellSize
        
        if (isArrow) {
          // Arrow on horizontal line - same design as main canvas
          const arrowSize = cellSize * 0.5
          const scale = arrowSize / 20 // Scale factor to match original viewBox 0 0 20 20
          svg += `      <g transform="translate(${centerX - arrowSize/2}, ${centerY - arrowSize/2}) scale(${scale})">\n`
          
          if (door.type === 'line_arrow_north') {
            svg += `        <path d="M10 1 L6 6 L8.5 6 L8.5 19 L11.5 19 L11.5 6 L14 6 Z" class="line-arrow"/>\n`
          } else if (door.type === 'line_arrow_south') {
            svg += `        <path d="M10 19 L14 14 L11.5 14 L11.5 1 L8.5 1 L8.5 14 L6 14 Z" class="line-arrow"/>\n`
          } else if (door.type === 'line_arrow_east') {
            svg += `        <path d="M19 10 L14 6 L14 8.5 L1 8.5 L1 11.5 L14 11.5 L14 14 Z" class="line-arrow"/>\n`
          } else if (door.type === 'line_arrow_west') {
            svg += `        <path d="M1 10 L6 14 L6 11.5 L19 11.5 L19 8.5 L6 8.5 L6 6 Z" class="line-arrow"/>\n`
          }
          
          svg += '      </g>\n'
        } else {
          // Regular door on horizontal line
          const doorWidth = cellSize * 0.4
          const doorHeight = cellSize * 0.2
          svg += `      <rect x="${centerX - doorWidth/2}" y="${centerY - doorHeight/2}" width="${doorWidth}" height="${doorHeight}" class="${isOpen ? 'door-open' : 'door-closed'}"/>\n`
        }
      }
    })
    
    svg += '    </g>\n\n'
  }

  // Add items
  if (floorData.items && floorData.items.length > 0) {
    svg += '    <!-- Items -->\n    <g class="items">\n'
    
    floorData.items.forEach(item => {
      const displayRow = gridSize.rows - 1 - item.row
      const centerX = item.col * cellSize + cellSize / 2
      const centerY = displayRow * cellSize + cellSize / 2
      const itemSize = cellSize * 0.6
      
      switch (item.type) {
        case TOOLS.CHEST:
          // Chest base (smaller size)
          const chestSize = itemSize * 0.8
          svg += `      <rect x="${centerX - chestSize/2}" y="${centerY}" width="${chestSize}" height="${chestSize/2}" stroke="#8B4513" stroke-width="1.5" fill="none" rx="1"/>\n`
          // Chest lid (curved top)
          svg += `      <path d="M ${centerX - chestSize/2} ${centerY} Q ${centerX - chestSize/2} ${centerY - chestSize/3} ${centerX} ${centerY - chestSize/3} Q ${centerX + chestSize/2} ${centerY - chestSize/3} ${centerX + chestSize/2} ${centerY}" stroke="#8B4513" stroke-width="1.5" fill="none"/>\n`
          // Chest lock
          svg += `      <circle cx="${centerX}" cy="${centerY}" r="${chestSize/12}" stroke="#FFD700" stroke-width="1" fill="#FFD700"/>\n`
          // Chest hinges
          svg += `      <rect x="${centerX - chestSize/3}" y="${centerY - chestSize/24}" width="${chestSize/24}" height="${chestSize/12}" fill="#654321"/>\n`
          svg += `      <rect x="${centerX + chestSize/3}" y="${centerY - chestSize/24}" width="${chestSize/24}" height="${chestSize/12}" fill="#654321"/>\n`
          break
        
        case TOOLS.STAIRS_UP_SVG:
          svg += `      <polygon points="${centerX - itemSize/2},${centerY + itemSize/3} ${centerX},${centerY - itemSize/3} ${centerX + itemSize/2},${centerY + itemSize/3}" class="stairs-up"/>\n`
          break
        
        case TOOLS.STAIRS_DOWN_SVG:
          svg += `      <polygon points="${centerX - itemSize/2},${centerY - itemSize/3} ${centerX},${centerY + itemSize/3} ${centerX + itemSize/2},${centerY - itemSize/3}" class="stairs-down"/>\n`
          break
        
        case TOOLS.CURRENT_POSITION:
          svg += `      <circle cx="${centerX}" cy="${centerY}" r="${itemSize/4}" class="current-position"/>\n`
          break
        
        case TOOLS.EVENT_MARKER:
          svg += `      <text x="${centerX}" y="${centerY + 4}" text-anchor="middle" font-size="${itemSize * 0.8}" fill="#ca0101" font-weight="bold">!</text>\n`
          break
        
        case TOOLS.WARP_POINT:
          // Diamond background
          svg += `      <polygon points="${centerX},${centerY - itemSize/2} ${centerX + itemSize/3},${centerY} ${centerX},${centerY + itemSize/2} ${centerX - itemSize/3},${centerY}" class="warp-point"/>\n`
          // Text overlay if warpText exists
          if (item.warpText) {
            svg += `      <text x="${centerX}" y="${centerY + 3}" text-anchor="middle" font-size="${Math.max(6, itemSize * 0.4)}" fill="#0c4b5b" font-weight="bold">${item.warpText}</text>\n`
          }
          break
        
        case TOOLS.ARROW_NORTH:
          svg += `      <text x="${centerX}" y="${centerY + 4}" text-anchor="middle" font-size="${itemSize * 0.8}" fill="#000000" font-weight="bold">↑</text>\n`
          break
        
        case TOOLS.ARROW_SOUTH:
          svg += `      <text x="${centerX}" y="${centerY + 4}" text-anchor="middle" font-size="${itemSize * 0.8}" fill="#000000" font-weight="bold">↓</text>\n`
          break
        
        case TOOLS.ARROW_EAST:
          svg += `      <text x="${centerX}" y="${centerY + 4}" text-anchor="middle" font-size="${itemSize * 0.8}" fill="#000000" font-weight="bold">→</text>\n`
          break
        
        case TOOLS.ARROW_WEST:
          svg += `      <text x="${centerX}" y="${centerY + 4}" text-anchor="middle" font-size="${itemSize * 0.8}" fill="#000000" font-weight="bold">←</text>\n`
          break
        
        case TOOLS.ARROW_ROTATE:
          svg += `      <text x="${centerX}" y="${centerY + 4}" text-anchor="middle" font-size="${itemSize * 0.8}" fill="#000000">⟲</text>\n`
          break
        
        case TOOLS.NOTE:
          svg += `      <rect x="${centerX - itemSize/2}" y="${centerY - itemSize/2}" width="${itemSize}" height="${itemSize}" fill="#fef3c7" rx="2"/>\n`
          if (item.text) {
            const lines = item.text.split('\n').slice(0, 3) // Max 3 lines
            lines.forEach((line, index) => {
              svg += `      <text x="${centerX}" y="${centerY - 6 + index * 8}" text-anchor="middle" class="note-text">${line.slice(0, 8)}</text>\n`
            })
          }
          break
        
        case TOOLS.DARK_ZONE:
          svg += `      <circle cx="${centerX}" cy="${centerY}" r="${itemSize/3}" class="dark-zone"/>\n`
          break
        
        case TOOLS.SHUTE:
          if (item.shuteStyle === 'outline') {
            svg += `      <circle cx="${centerX}" cy="${centerY}" r="${itemSize/3}" fill="none" stroke="#333333" stroke-width="2"/>\n`
          } else {
            svg += `      <circle cx="${centerX}" cy="${centerY}" r="${itemSize/3}" fill="#333333"/>\n`
          }
          break
        
        case TOOLS.ELEVATOR:
          svg += `      <text x="${centerX}" y="${centerY + 4}" text-anchor="middle" font-size="${itemSize * 0.8}" fill="#b8860b" font-weight="900">E</text>\n`
          break
        
        case TOOLS.STAIRS_UP_SVG:
          svg += `      <text x="${centerX}" y="${centerY + 4}" text-anchor="middle" font-size="${itemSize * 0.8}" fill="#0000ff" font-weight="bold">▲</text>\n`
          if (item.stairsText) {
            // Add white text with black outline for better visibility
            svg += `      <text x="${centerX}" y="${centerY + 2}" text-anchor="middle" font-size="${Math.max(8, itemSize * 0.4)}" fill="#ffffff" stroke="#000000" stroke-width="0.5" font-weight="bold">${item.stairsText}</text>\n`
          }
          break
        
        case TOOLS.STAIRS_DOWN_SVG:
          svg += `      <text x="${centerX}" y="${centerY + 4}" text-anchor="middle" font-size="${itemSize * 0.8}" fill="#0000ff" font-weight="bold">▼</text>\n`
          if (item.stairsText) {
            // Add white text with black outline for better visibility
            svg += `      <text x="${centerX}" y="${centerY + 2}" text-anchor="middle" font-size="${Math.max(8, itemSize * 0.4)}" fill="#ffffff" stroke="#000000" stroke-width="0.5" font-weight="bold">${item.stairsText}</text>\n`
          }
          break
        
        case TOOLS.CURRENT_POSITION:
          svg += `      <circle cx="${centerX}" cy="${centerY}" r="${itemSize/4}" fill="#dc143c"/>\n`
          break
      }
    })
    
    svg += '    </g>\n\n'
  }

  // Close SVG
  svg += '  </g>\n</svg>'

  return svg
}

export const downloadSVG = (svgContent, filename = 'dmapper-floor.svg') => {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}