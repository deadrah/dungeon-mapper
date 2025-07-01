# DMapper - 3D Dungeon Mapping Tool

A web-based grid mapping tool for 3D dungeon games.
This application operates entirely client-side without requiring a server and stores data in the browser's local storage.

## 🌐 Live Demo

**Try it now: [https://deadrah.github.io/dungeon-mapper/](https://deadrah.github.io/dungeon-mapper/)**

## ✨ Features

### Line Tools (Grid Boundaries)
- **Wall Drawing**: Draw walls on grid boundaries with click & drag for continuous drawing
- **Doors**: Place open doors (□) or closed doors (■) on walls
- **Line Arrows**: Place directional arrows on wall segments

### Grid Tools (Cell Content)
- **Block Color Fill**: Fill grid cells with colors using the color picker
- **Dark Zone**: Mark dark areas with gray shading
- **Stairs**: Place up stairs (▲) and down stairs (▼) with 2-character identifiers
- **Treasure Chests**: Mark treasure locations
- **Teleport Points**: Place teleport markers with 2-character identifiers
- **Shoots & Pits**: Mark falling points with selectable shoot (●) or pit (○) styles
- **Event Markers**: Mark special event locations
- **Current Position**: Mark player's current location (one per floor)
- **Grid Arrows**: Place directional arrows in grid cells
- **Door Items**: Place door items in cells with open/closed state selection
- **Notes**: Add text memos to cells with red triangle indicators and tooltip display
- **Eraser Tool**: Mobile-friendly tool for deleting objects

### Dungeon Management
- **Multiple Dungeons**: Manage up to 10 dungeons with custom names
- **Multi-Floor Support**: Up to 30 floors per dungeon (B1F to B30F format)
- **Floor Navigation**: Easy switching between floors with data indicators (* prefix for floors with content)
- **Grid Customization**: Adjustable grid size from 1x1 to 50x50 per dungeon
- **Floor Copy**: Copy floors between different dungeons with automatic coordinate transformation

### Data Management
- **Auto-save**: Automatic saving to browser local storage
- **Export All Data**: Download all dungeons as JSON file
- **Import All Data**: Load all dungeons from JSON file
- **Per-Dungeon Save/Load**: Save and load individual dungeons
- **SVG Export**: Download current floor as SVG image
- **Backward Compatibility**: Supports legacy data formats

### User Experience
- **Multi-language Support**: Japanese and English interface with automatic browser language detection
- **Theme Support**: Default and Dungeon themes for different visual preferences
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Touch Controls**: Single finger for tools, two fingers for map navigation
- **Keyboard Shortcuts**: Quick tool selection (1-5, Q, E) and operations (Ctrl+Z/Y)
- **Zoom & Pan**: Mouse wheel zoom and Shift+drag panning
- **Note Management**: Always-visible note tooltips with toggle option

## 🎮 Controls

### Desktop
- **Zoom**: Mouse wheel
- **Pan**: Shift + drag
- **Place/Draw**: Left click
- **Remove/Erase**: Right click or Eraser tool
- **Edit Notes**: Click existing note (works with any tool)

### Mobile
- **Zoom/Pan**: Two-finger gestures
- **Tools**: Single finger tap
- **Menu**: Hamburger menu for additional features

### Keyboard Shortcuts
- **1-5, Q, E**: Tool selection
- **Ctrl + Z**: Undo
- **Ctrl + Y**: Redo
- **Ctrl + S**: Export all data

## 🚀 Getting Started

1. Visit [https://deadrah.github.io/dungeon-mapper/](https://deadrah.github.io/dungeon-mapper/)
2. Language is automatically detected from your browser (Japanese for 'ja' locales, English for others)
3. Choose a drawing tool from the left panel (Line tools for boundaries, Grid tools for cell content)
4. Start mapping your dungeon! Use the * indicators to see which floors contain data
5. Access save/load and other options through the option menu (hamburger icon)

## 💾 Data Storage

- **Local Storage**: All data is automatically saved in your browser
- **Export/Import**: Create backups with JSON files
- **Cross-Device**: Transfer data between devices using export/import
- **Privacy**: No server required - all data stays on your device

## 🛠️ Development

This is a React + Vite application with Tailwind CSS styling.

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```


## ⚠️ Important Notes

- Data is stored in browser local storage and will be lost if browser data is cleared
- Regular backups using the Export function are recommended for important dungeon maps
- Line tools (doors, line arrows) can only be placed on existing walls
- Each dungeon can have its own grid size settings
- Floor copy automatically handles coordinate transformation for different grid sizes

## 📄 License

MIT License - Feel free to use and modify for your own projects.
