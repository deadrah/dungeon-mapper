# DMapper - 3D Dungeon Mapping Tool

A web-based grid mapping tool for 3D dungeon games.
This application operates entirely client-side without requiring a server and stores data in the browser's local storage.

## 🌐 Live Demo

**Try it now: [https://deadrah.github.io/dungeon-mapper/](https://deadrah.github.io/dungeon-mapper/)**

## ✨ Features

### Core Mapping Tools
- **Wall Drawing**: Draw walls on grid boundaries with click & drag for continuous drawing
- **Block Color Fill**: Fill grid cells with colors using the color picker
- **Dark Zone**: Mark dark areas with gray shading
- **Stairs**: Place up stairs (▲) and down stairs (▼)
- **Items**: Place treasure chests, warp points, and event markers
- **Current Position**: Mark player's current location (one per floor)
- **Doors**: Place open doors (□) or closed doors (■) on existing walls
- **Arrows**: Place directional arrows on grid cells or walls
- **Notes**: Add text memos to cells with tooltip display
- **Eraser Tool**: Mobile-friendly tool for deleting objects

### Dungeon Management
- **Multiple Dungeons**: Manage up to 10 dungeons with custom names
- **Multi-Floor Support**: Up to 30 floors per dungeon
- **Floor Navigation**: Easy switching between floors with F notation (1F, 2F, etc.)
- **Grid Customization**: Adjustable grid size from 5x5 to 50x50

### Data Management
- **Auto-save**: Automatic saving to browser local storage
- **Export All Data**: Download all dungeons as JSON file
- **Import All Data**: Load all dungeons from JSON file
- **Per-Dungeon Save/Load**: Save and load individual dungeons
- **SVG Export**: Download current floor as SVG image
- **Backward Compatibility**: Supports legacy data formats

### User Experience
- **Multi-language Support**: Japanese and English interface
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Touch Controls**: Single finger for tools, two fingers for map navigation
- **Keyboard Shortcuts**: Quick tool selection (1-5, Q, E) and operations (Ctrl+Z/Y)
- **Zoom & Pan**: Mouse wheel zoom and Shift+drag panning

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
2. Select your preferred language (JP/EN) in the help dialog
3. Choose a drawing tool from the left panel
4. Start mapping your dungeon!
5. Use the File menu for save/load operations

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
- Doors and wall arrows can only be placed on existing walls

## 📄 License

MIT License - Feel free to use and modify for your own projects.
