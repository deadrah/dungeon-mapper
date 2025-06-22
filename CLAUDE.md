# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: DMapper - 3D Dungeon Mapping Tool

A web-based grid mapping tool for 3D dungeon game players. The application is client-side only with no server dependencies.

## Technical Stack
- **Frontend**: React
- **Styling**: Tailwind CSS
- **Language**: JavaScript
- **Storage**: Browser localStorage
- **Architecture**: Serverless, client-side only

## Project Structure (When Implemented)
```
src/
├── components/
│   ├── Header/          # Floor controls, save/load
│   ├── ToolPanel/       # Tool selection sidebar
│   ├── Canvas/          # Main drawing area
│   │   ├── Grid/
│   │   ├── Walls/
│   │   ├── Items/
│   │   └── ActiveTool/
│   ├── PropertiesPanel/ # Item properties
│   └── StatusBar/       # Coordinates, zoom
├── hooks/               # Custom React hooks
├── utils/               # Helper functions
└── data/                # Data models and persistence
```

## Core Application State
```javascript
{
  currentFloor: 1,
  maxFloors: 10,
  gridSize: { rows: 50, cols: 50 },
  zoom: 1.0,
  activeTool: 'line',
  floors: {
    1: {
      grid: [...],      // Color-filled blocks
      walls: [...],     # Wall/door lines
      items: [...]      # Placeable items
    }
  }
}
```

## Key Features to Implement
1. **Grid System**: Configurable dimensions with zoom/pan, mouse wheel controls
2. **Drawing Tools**: 
   - Line tool for walls (snap to grid edges)
   - Block color tool for filling grid squares
3. **Placeable Items**: Stairs, chests, traps, notes, doors, directional arrows
4. **Data Persistence**: localStorage with JSON export/import
5. **Multi-floor Support**: Floor selector with independent map data per floor

## Mouse Controls
- Left click/drag: Primary action (draw/place)
- Right click/drag: Secondary action (erase/remove)
- Mouse wheel: Zoom in/out
- Middle click: Pan mode

## Keyboard Shortcuts
- `1-9`: Quick tool selection
- `Ctrl+S`: Save current floor
- `Ctrl+L`: Load floor
- `Ctrl+Z/Y`: Undo/Redo
- `Space`: Pan mode
- `Delete`: Clear selection

## Performance Requirements
- Canvas rendering optimization for large grids
- Viewport culling for performance
- Debounced auto-save functionality
- Efficient redraw on zoom/pan operations

## Commands

### Development
```bash
cd dmapper
npm install    # Install dependencies
npm run dev    # Start development server (http://localhost:5173)
npm run build  # Build for production
npm run preview # Preview production build
```

### Implementation Status
✅ Core grid system with zoom/pan functionality
✅ Block color fill tool 
✅ Item placement system (stairs, chests, traps, etc.)
✅ Save/load with localStorage
✅ Multi-floor support
✅ Keyboard shortcuts (1-9 for tools, Ctrl+S/L/Z/Y)
✅ Mouse controls (wheel zoom, shift+drag pan)
⚠️ Line tool for walls (not yet implemented)

## Usage
- Use mouse wheel to zoom in/out
- Shift+click and drag to pan around the grid
- Select tools from the left sidebar (1-9 keys)
- Left click to place items/colors, right click to remove
- Use Ctrl+S to save, Ctrl+L to load maps