// Theme definitions for DMapper
// Each theme contains all color values used throughout the application

export const themes = {
  default: {
    name: 'Default',
    
    // Grid colors
    grid: {
      background: '#d7e2f6',        // Main grid background
      lines: '#bfbfbf',             // Grid line color
      cellBorder: '#dbdbdb',        // Individual cell borders
    },
    
    // Header colors
    header: {
      background: '#f5f5f5',        // Header row/column background
      text: '#374151',              // Header text color
      border: '#d1d5db',            // Header borders
      corner: '#e5e7eb',            // Corner decoration background
    },
    
    // Item colors
    items: {
      teleport: '#4bdcff',          // Teleport point fill
      teleportBorder: '#0c4b5b',    // Teleport point border
      event: '#ca0101',             // Event marker
      elevator: '#b8860b',          // Elevator
      stairs: '#0000ff',            // Stairs
      chest: '#ff8c00',             // Chest
      currentPosition: '#dc143c',   // Current position marker
      arrow: '#345dd1',             // Arrow color
      note: '#ffffff',              // Note background
      noteBorder: '#000000',        // Note border
      shute: '#800080',             // Shute/pit color
      darkZone: 'rgba(0,0,0,0.6)',  // Dark zone overlay
    },
    
    // Wall colors
    walls: {
      stroke: '#000000',            // Wall line color
      strokeWidth: 2,               // Wall line width
    },
    
    // Door colors
    doors: {
      open: {
        background: '#ffffff',      // Open door background
        border: '#000000',          // Open door border
      },
      closed: {
        background: '#000000',      // Closed door background
        border: '#000000',          // Closed door border
      },
    },
    
    // UI colors
    ui: {
      panel: '#1f2937',             // Tool panel background
      panelText: '#ffffff',         // Tool panel text
      button: '#374151',            // Button background
      buttonHover: '#4b5563',       // Button hover
      buttonActive: '#496fc1',      // Active button
      input: '#374151',             // Input background
      inputText: '#ffffff',         // Input text
      border: '#4b5563',            // General borders
    }
  },
  
  dark: {
    name: 'Dark',
    
    grid: {
      background: '#1e293b',
      lines: '#475569',
      cellBorder: '#334155',
    },
    
    header: {
      background: '#0f172a',
      text: '#e2e8f0',
      border: '#334155',
      corner: '#1e293b',
    },
    
    items: {
      teleport: '#06b6d4',
      teleportBorder: '#0e7490',
      event: '#ef4444',
      elevator: '#f59e0b',
      stairs: '#3b82f6',
      chest: '#f97316',
      currentPosition: '#ef4444',
      arrow: '#6366f1',
      note: '#374151',
      noteBorder: '#e2e8f0',
      shute: '#a855f7',
      darkZone: 'rgba(0,0,0,0.8)',
    },
    
    walls: {
      stroke: '#e2e8f0',
      strokeWidth: 2,
    },
    
    doors: {
      open: {
        background: '#374151',
        border: '#e2e8f0',
      },
      closed: {
        background: '#1f2937',
        border: '#e2e8f0',
      },
    },
    
    ui: {
      panel: '#0f172a',
      panelText: '#e2e8f0',
      button: '#1e293b',
      buttonHover: '#334155',
      buttonActive: '#3b82f6',
      input: '#1e293b',
      inputText: '#e2e8f0',
      border: '#334155',
    }
  },
  
  ocean: {
    name: 'Ocean',
    
    grid: {
      background: '#e0f2fe',
      lines: '#0891b2',
      cellBorder: '#67e8f9',
    },
    
    header: {
      background: '#cffafe',
      text: '#0c4a6e',
      border: '#06b6d4',
      corner: '#a5f3fc',
    },
    
    items: {
      teleport: '#0891b2',
      teleportBorder: '#164e63',
      event: '#dc2626',
      elevator: '#d97706',
      stairs: '#2563eb',
      chest: '#ea580c',
      currentPosition: '#dc2626',
      arrow: '#1e40af',
      note: '#f0f9ff',
      noteBorder: '#0c4a6e',
      shute: '#7c3aed',
      darkZone: 'rgba(8,145,178,0.6)',
    },
    
    walls: {
      stroke: '#0c4a6e',
      strokeWidth: 2,
    },
    
    doors: {
      open: {
        background: '#f0f9ff',
        border: '#0c4a6e',
      },
      closed: {
        background: '#0369a1',
        border: '#0c4a6e',
      },
    },
    
    ui: {
      panel: '#0c4a6e',
      panelText: '#f0f9ff',
      button: '#0891b2',
      buttonHover: '#0e7490',
      buttonActive: '#0284c7',
      input: '#075985',
      inputText: '#f0f9ff',
      border: '#0891b2',
    }
  },
  
  forest: {
    name: 'Forest',
    
    grid: {
      background: '#f0fdf4',
      lines: '#16a34a',
      cellBorder: '#86efac',
    },
    
    header: {
      background: '#dcfce7',
      text: '#14532d',
      border: '#22c55e',
      corner: '#bbf7d0',
    },
    
    items: {
      teleport: '#059669',
      teleportBorder: '#064e3b',
      event: '#dc2626',
      elevator: '#d97706',
      stairs: '#2563eb',
      chest: '#ea580c',
      currentPosition: '#dc2626',
      arrow: '#1e40af',
      note: '#f7fee7',
      noteBorder: '#14532d',
      shute: '#7c3aed',
      darkZone: 'rgba(5,150,105,0.6)',
    },
    
    walls: {
      stroke: '#14532d',
      strokeWidth: 2,
    },
    
    doors: {
      open: {
        background: '#f7fee7',
        border: '#14532d',
      },
      closed: {
        background: '#166534',
        border: '#14532d',
      },
    },
    
    ui: {
      panel: '#14532d',
      panelText: '#f7fee7',
      button: '#16a34a',
      buttonHover: '#15803d',
      buttonActive: '#22c55e',
      input: '#166534',
      inputText: '#f7fee7',
      border: '#16a34a',
    }
  }
}

// Helper function to get a theme by name
export const getTheme = (themeName) => {
  return themes[themeName] || themes.default
}

// Get list of available theme names
export const getThemeNames = () => {
  return Object.keys(themes)
}

// Get list of theme objects with name and display name
export const getThemeOptions = () => {
  return Object.entries(themes).map(([key, theme]) => ({
    value: key,
    label: theme.name
  }))
}