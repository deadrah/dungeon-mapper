import { TOOLS, GRID_SIZE } from './constants'

export const exportFloorAsSVG = (floorData, gridSize, mapName = 'DMapper', floorNumber = 1, theme = null) => {
  const cellSize = GRID_SIZE
  const headerSize = 40
  const padding = 20
  const svgWidth = gridSize.cols * cellSize + padding * 2 + headerSize + 30
  const svgHeight = gridSize.rows * cellSize + padding * 2 + headerSize + 30

  // Use theme colors or fallback to defaults
  const colors = theme ? {
    gridLine: theme.grid.lines,
    wallLine: theme.walls.stroke,
    doorOpen: theme.doors.open.background,
    doorOpenBorder: theme.doors.open.border,
    doorClosed: theme.doors.closed.background,
    doorClosedBorder: theme.doors.closed.border,
    chest: theme.items.chest,
    stairs: theme.items.stairs,
    currentPosition: theme.items.currentPosition,
    event: theme.items.event,
    elevator: theme.items.elevator,
    teleport: theme.items.teleport,
    teleportBorder: theme.items.teleportBorder,
    darkZone: theme.items.darkZone,
    arrow: theme.items.arrow,
    lineArrow: theme.items.arrow,
    noteText: theme.items.noteBorder,
    noteTriangle: theme.items.noteTriangle,
    noteTooltipBg: theme.items.note,
    titleText: theme.header.text,
    headerText: theme.header.text,
    background: theme.grid.background
  } : {
    gridLine: '#d1d5db',
    wallLine: '#1f2937',
    doorOpen: '#ffffff',
    doorOpenBorder: '#1f2937',
    doorClosed: '#1f2937',
    doorClosedBorder: '#1f2937',
    chest: '#8B4513',
    stairs: '#0000ff',
    currentPosition: '#dc143c',
    event: '#ca0101',
    elevator: '#b8860b',
    teleport: '#06b6d4',
    teleportBorder: '#0891b2',
    darkZone: '#000000',
    arrow: '#374151',
    lineArrow: '#345dd1',
    noteText: '#1f2937',
    noteTriangle: '#dc2626',
    noteTooltipBg: '#ffffff',
    titleText: '#1f2937',
    headerText: '#374151',
    background: '#ffffff'
  }

  // SVG header
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .grid-line { stroke: ${colors.gridLine}; stroke-width: 1; opacity: 0.7; }
      .wall-line { stroke: ${colors.wallLine}; stroke-width: ${theme?.walls?.strokeWidth || 3}; stroke-linecap: round; }
      .door-open { fill: ${colors.doorOpen}; stroke: ${colors.doorOpenBorder}; stroke-width: 2; }
      .door-closed { fill: ${colors.doorClosed}; stroke: ${colors.doorClosedBorder}; stroke-width: 2; }
      .chest { fill: ${colors.chest}; stroke: ${colors.chest}; stroke-width: 1; }
      .chest-lock { fill: ${colors.chest}; stroke: ${colors.chest}; stroke-width: 1; }
      .stairs-up { fill: ${colors.stairs}; stroke: ${colors.stairs}; stroke-width: 1; }
      .stairs-down { fill: ${colors.stairs}; stroke: ${colors.stairs}; stroke-width: 1; }
      .current-position { fill: ${colors.currentPosition}; stroke: ${colors.currentPosition}; stroke-width: 2; }
      .event-marker { fill: ${colors.event}; stroke: ${colors.event}; stroke-width: 1; }
      .warp-point { fill: ${colors.teleport}; stroke: ${colors.teleportBorder}; stroke-width: 1; }
      .dark-zone { fill: ${colors.darkZone}; stroke: ${colors.darkZone}; stroke-width: 0.5; }
      .arrow { fill: ${colors.arrow}; stroke: ${colors.arrow}; stroke-width: 1; }
      .line-arrow { fill: ${colors.lineArrow}; stroke: ${colors.lineArrow}; stroke-width: 1; }
      .note-text { font-family: Arial, sans-serif; font-size: 8px; fill: ${colors.noteText}; }
      .title-text { font-family: Arial, sans-serif; font-size: 14px; fill: ${colors.titleText}; font-weight: bold; }
      .header-text { font-family: Arial, sans-serif; font-size: 10px; fill: ${colors.headerText}; text-anchor: middle; }
      .copyright-text { font-family: Arial, sans-serif; font-size: 10px; fill: ${colors.headerText}; opacity: 0.8; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="${colors.background}"/>
  
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
          svg += `      <rect x="${col * cellSize + 1}" y="${displayRow * cellSize + 1}" width="${cellSize - 2}" height="${cellSize - 2}" fill="${color}"/>\n`
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

  // Add note triangles (new memo system)
  if (floorData.notes && floorData.notes.length > 0) {
    svg += '    <!-- Note Triangles -->\n    <g class="note-triangles">\n'
    
    floorData.notes.forEach(note => {
      const displayRow = gridSize.rows - 1 - note.row
      const triangleX = note.col * cellSize
      const triangleY = displayRow * cellSize
      const triangleSize = cellSize * 0.25
      
      // Red triangle in top-left corner
      svg += `      <polygon points="${triangleX},${triangleY} ${triangleX + triangleSize},${triangleY} ${triangleX},${triangleY + triangleSize}" fill="${colors.noteTriangle}"/>\n`
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
        case TOOLS.CHEST: {
          // Chest SVG rendering to match canvas (cellSize * 0.8)
          const chestSize = cellSize * 0.8
          svg += `      <svg x="${centerX - chestSize/2}" y="${centerY - chestSize/2}" width="${chestSize}" height="${chestSize}" viewBox="0 0 24 24">\n`
          // Chest base
          svg += `        <rect x="4" y="12" width="16" height="8" stroke="${colors.chest}" stroke-width="1.5" fill="none" rx="1"/>\n`
          // Chest lid
          svg += `        <path d="M4 12 Q4 8 12 8 Q20 8 20 12" stroke="${colors.chest}" stroke-width="1.5" fill="none"/>\n`
          // Chest lock
          svg += `        <circle cx="12" cy="12" r="1.5" stroke="${colors.chest}" stroke-width="1" fill="${colors.chest}"/>\n`
          // Chest hinges
          svg += `        <rect x="6" y="11" width="1" height="2" fill="${colors.chest}"/>\n`
          svg += `        <rect x="17" y="11" width="1" height="2" fill="${colors.chest}"/>\n`
          svg += `      </svg>\n`
          break
        }
        
        case TOOLS.STAIRS_UP_SVG: {
          // Up stairs SVG to match canvas (cellSize * 0.7, viewBox="0 0 100 100")
          const upSize = cellSize * 0.7
          svg += `      <svg x="${centerX - upSize/2}" y="${centerY - upSize/2}" width="${upSize}" height="${upSize}" viewBox="0 0 100 100">\n`
          svg += `        <rect width="100" height="100" fill="transparent" />\n`
          svg += `        <rect x="10" y="70" width="19" height="20" fill="gray" />\n`
          svg += `        <rect x="30" y="50" width="19" height="40" fill="gray" />\n`
          svg += `        <rect x="50" y="30" width="19" height="60" fill="gray" />\n`
          svg += `        <rect x="70" y="10" width="19" height="80" fill="gray" />\n`
          svg += `      </svg>\n`
          if (item.stairsText && item.stairsText.trim() !== '') {
            // テキスト位置をメイン画面と一致（top: '60%', left: '62%'）
            const textX = centerX + (upSize * 0.12) // 62% - 50% = 12% offset from center
            const textY = centerY + (upSize * 0.1) + (Math.max(8, cellSize * 0.4) * 0.35)  // 60% + text height adjustment
            svg += `      <text x="${textX}" y="${textY}" text-anchor="middle" font-size="${Math.max(8, cellSize * 0.4)}" fill="white" font-weight="bold" style="text-shadow: 0 0 4px rgba(0,0,0,1)">${item.stairsText}</text>\n`
          }
          break
        }
        
        case TOOLS.STAIRS_DOWN_SVG: {
          // Down stairs SVG to match canvas (cellSize * 0.7, viewBox="0 0 100 100")
          const downSize = cellSize * 0.7
          svg += `      <svg x="${centerX - downSize/2}" y="${centerY - downSize/2}" width="${downSize}" height="${downSize}" viewBox="0 0 100 100">\n`
          svg += `        <rect width="100" height="100" fill="#333" />\n`
          svg += `        <rect x="10" y="10" width="18" height="80" fill="#eee" />\n`
          svg += `        <rect x="30" y="25" width="18" height="65" fill="#ccc" />\n`
          svg += `        <rect x="50" y="40" width="18" height="50" fill="#aaa" />\n`
          svg += `        <rect x="70" y="55" width="18" height="35" fill="#888" />\n`
          svg += `      </svg>\n`
          if (item.stairsText && item.stairsText.trim() !== '') {
            // テキスト位置をメイン画面と一致（top: '60%', left: '62%'）
            const textX = centerX + (downSize * 0.12) // 62% - 50% = 12% offset from center
            const textY = centerY + (downSize * 0.1) + (Math.max(8, cellSize * 0.4) * 0.35)  // 60% + text height adjustment
            svg += `      <text x="${textX}" y="${textY}" text-anchor="middle" font-size="${Math.max(8, cellSize * 0.4)}" fill="white" font-weight="bold" style="text-shadow: 0 0 4px rgba(0,0,0,1)">${item.stairsText}</text>\n`
          }
          break
        }
        
        case TOOLS.CURRENT_POSITION:
          // Match canvas fontSize: Math.max(8, cellSize * 0.4)
          const currentPosFontSize = Math.max(8, cellSize * 0.4)
          const currentPosY = centerY + (currentPosFontSize * 0.35)
          svg += `      <text x="${centerX}" y="${currentPosY}" text-anchor="middle" font-size="${currentPosFontSize}" fill="${colors.currentPosition}" font-weight="bold">●</text>\n`
          break
        
        case TOOLS.EVENT_MARKER:
          // Match canvas fontSize: Math.max(12, cellSize * 0.6)
          const eventFontSize = Math.max(12, cellSize * 0.6)
          const eventY = centerY + (eventFontSize * 0.35) // Proper baseline adjustment
          svg += `      <text x="${centerX}" y="${eventY}" text-anchor="middle" font-size="${eventFontSize}" fill="${colors.event}" font-weight="bold">!</text>\n`
          break
        
        case TOOLS.WARP_POINT:
          // Diamond background using ◆ symbol to match canvas  
          const diamondFontSize = Math.max(12, cellSize * 0.7)
          const diamondY = centerY + (diamondFontSize * 0.35) // Adjust for text baseline
          svg += `      <text x="${centerX}" y="${diamondY}" text-anchor="middle" font-size="${diamondFontSize}" fill="${colors.teleport}" font-weight="bold">◆</text>\n`
          // Text overlay if warpText exists - rendered on top of diamond
          if (item.warpText) {
            const textFontSize = Math.max(10, cellSize * 0.40)
            const textY = centerY + (textFontSize * 0.35) // Center text properly
            svg += `      <text x="${centerX}" y="${textY}" text-anchor="middle" font-size="${textFontSize}" fill="white" font-weight="bold" style="text-shadow: 0 0 3px rgba(0,0,0,1)">${item.warpText}</text>\n`
          }
          break
        
        case TOOLS.ARROW_NORTH:
          // Match canvas fontSize: Math.max(12, cellSize * 0.6)
          const arrowNorthFontSize = Math.max(12, cellSize * 0.6)
          const arrowNorthY = centerY + (arrowNorthFontSize * 0.35)
          svg += `      <text x="${centerX}" y="${arrowNorthY}" text-anchor="middle" font-size="${arrowNorthFontSize}" fill="${colors.arrow}" font-weight="bold">↑</text>\n`
          break
        
        case TOOLS.ARROW_SOUTH:
          // Match canvas fontSize: Math.max(12, cellSize * 0.6)
          const arrowSouthFontSize = Math.max(12, cellSize * 0.6)
          const arrowSouthY = centerY + (arrowSouthFontSize * 0.35)
          svg += `      <text x="${centerX}" y="${arrowSouthY}" text-anchor="middle" font-size="${arrowSouthFontSize}" fill="${colors.arrow}" font-weight="bold">↓</text>\n`
          break
        
        case TOOLS.ARROW_EAST:
          // Match canvas fontSize: Math.max(12, cellSize * 0.6)
          const arrowEastFontSize = Math.max(12, cellSize * 0.6)
          const arrowEastY = centerY + (arrowEastFontSize * 0.35)
          svg += `      <text x="${centerX}" y="${arrowEastY}" text-anchor="middle" font-size="${arrowEastFontSize}" fill="${colors.arrow}" font-weight="bold">→</text>\n`
          break
        
        case TOOLS.ARROW_WEST:
          // Match canvas fontSize: Math.max(12, cellSize * 0.6)
          const arrowWestFontSize = Math.max(12, cellSize * 0.6)
          const arrowWestY = centerY + (arrowWestFontSize * 0.35)
          svg += `      <text x="${centerX}" y="${arrowWestY}" text-anchor="middle" font-size="${arrowWestFontSize}" fill="${colors.arrow}" font-weight="bold">←</text>\n`
          break
        
        case TOOLS.ARROW_ROTATE:
          // Match canvas fontSize: Math.max(12, cellSize * 0.6) but normal weight
          const arrowRotateFontSize = Math.max(12, cellSize * 0.6)
          const arrowRotateY = centerY + (arrowRotateFontSize * 0.35)
          svg += `      <text x="${centerX}" y="${arrowRotateY}" text-anchor="middle" font-size="${arrowRotateFontSize}" fill="${colors.arrow}">⟲</text>\n`
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
          // Match canvas fontSize: Math.max(12, cellSize * 0.6)
          const elevatorFontSize = Math.max(12, cellSize * 0.6)
          const elevatorY = centerY + (elevatorFontSize * 0.35)
          svg += `      <text x="${centerX}" y="${elevatorY}" text-anchor="middle" font-size="${elevatorFontSize}" fill="${colors.elevator}" font-weight="900">E</text>\n`
          break
        
        case TOOLS.DOOR_ITEM: {
          // Door item SVG rendering to match canvas (cellSize * 0.8)
          const doorSize = cellSize * 0.8
          const isOpen = item.doorState === 'open'
          svg += `      <svg x="${centerX - doorSize/2}" y="${centerY - doorSize/2}" width="${doorSize}" height="${doorSize}" viewBox="0 0 24 24">\n`
          if (isOpen) {
            // Open door SVG
            svg += `        <rect x="1" y="2" width="2" height="20" fill="#666"/>\n`
            svg += `        <rect x="19" y="2" width="2" height="20" fill="#666"/>\n`
            svg += `        <rect x="3" y="2" width="16" height="20" fill="#333"/>\n`
            svg += `        <line x1="3" y1="2" x2="3" y2="22" stroke="#aaa" stroke-width="2"/>\n`
            svg += `        <line x1="19" y1="2" x2="19" y2="22" stroke="#aaa" stroke-width="2"/>\n`
          } else {
            // Closed door SVG
            svg += `        <rect x="1" y="2" width="2" height="20" fill="#666"/>\n`
            svg += `        <rect x="19" y="2" width="2" height="20" fill="#666"/>\n`
            svg += `        <rect x="3" y="2" width="8" height="20" fill="#ccc"/>\n`
            svg += `        <rect x="11" y="2" width="8" height="20" fill="#ccc"/>\n`
            svg += `        <line x1="11" y1="2" x2="11" y2="22" stroke="#999" stroke-width="1"/>\n`
            svg += `        <circle cx="9" cy="12" r="0.5" fill="#666"/>\n`
            svg += `        <circle cx="13" cy="12" r="0.5" fill="#666"/>\n`
          }
          svg += `      </svg>\n`
          break
        }
      }
    })
    
    svg += '    </g>\n\n'
  }

  // Add note tooltips last to ensure they appear on top
  if (floorData.notes && floorData.notes.length > 0) {
    svg += '    <!-- Note Tooltips (rendered last for z-index) -->\n    <g class="note-tooltips">\n'
    
    floorData.notes.forEach(note => {
      // Only render tooltip if note has text
      if (note.text) {
        const displayRow = gridSize.rows - 1 - note.row
        const centerX = note.col * cellSize + cellSize / 2
        const centerY = displayRow * cellSize + cellSize / 2
        const tooltipText = note.text.length > 7 ? `${note.text.slice(0, 7)}...` : note.text
        
        // Calculate tooltip background size based on text length to match canvas (9px font)
        const fontSize = 9 // Match canvas fontSize
        const charWidth = fontSize * 0.8 // Conservative character width estimation for safety
        const paddingHorizontal = 10 // Extra horizontal padding (5px on each side for safety)
        const paddingVertical = 6 // Extra vertical padding (3px on each side for safety)
        const tooltipWidth = Math.max(40, tooltipText.length * charWidth + paddingHorizontal)
        const tooltipHeight = fontSize + paddingVertical
        
        // Tooltip background with dynamic width
        const bgX = centerX - tooltipWidth / 2
        const bgY = centerY - tooltipHeight / 2
        svg += `      <rect x="${bgX}" y="${bgY}" width="${tooltipWidth}" height="${tooltipHeight}" fill="${colors.noteTooltipBg}" stroke="${colors.noteText}" stroke-width="1" rx="2"/>\n`
        
        // Tooltip text with proper vertical centering
        const textY = centerY + (fontSize * 0.35) // Proper baseline adjustment for centering
        svg += `      <text x="${centerX}" y="${textY}" text-anchor="middle" font-size="${fontSize}" fill="${colors.noteText}">${tooltipText}</text>\n`
      }
    })
    
    svg += '    </g>\n\n'
  }

  // Close SVG
  svg += '  </g>\n\n'
  
  // Add copyright in bottom right corner
  const currentYear = new Date().getFullYear()
  const copyrightText = `© ${currentYear} DMapper`
  const copyrightX = svgWidth - 10 // 5px from right edge
  const copyrightY = svgHeight - 10 // 5px from bottom
  svg += `  <!-- Copyright -->\n`
  svg += `  <text x="${copyrightX}" y="${copyrightY}" text-anchor="end" class="copyright-text">${copyrightText}</text>\n`
  svg += '</svg>'

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