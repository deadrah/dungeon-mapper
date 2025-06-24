// Theme definitions for DMapper
// Each theme contains all color values used throughout the application

export const themes = {
  default: {
    name: 'Default',
    
    // Grid colors
    grid: {
      background: '#d7e2f6',        // Main grid background
      canvasBackground: '#f8f8f8',  // Canvas background (outside grid)
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
      teleport: '#2fb8d4',          // Teleport point fill
      teleportBorder: '#0c4b5b',    // Teleport point border
      event: '#ca0101',             // Event marker
      elevator: '#b8860b',          // Elevator
      stairs: '#0000ff',            // Stairs
      chest: '#d4a017',             // Chest
      currentPosition: '#dc143c',   // Current position marker
      arrow: '#345dd1',             // Arrow color
      note: '#ffffff',              // Note background
      noteBorder: '#000000',        // Note border
      noteTriangle: '#dc2626',      // Note triangle (red)
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
      button: '#1f2937',            // Button background
      buttonHover: '#4b5563',       // Button hover
      buttonActive: '#496fc1',      // Active button
      buttonActiveHover: '#3b5998', // Active button hover (darker blue)
      groupHeader: '#374151',       // Tool group header background
      background: '#ffffff',        // Light background for inputs
      text: '#374151',              // Dark text for inputs
      input: '#374151',             // Input background
      inputText: '#ffffff',         // Input text
      border: '#374151',            // General borders
    }
  },
  
  dungeon: {
    name: 'Dungeon',
    
    grid: {
      background: '#f7f3e9',        // 古い羊皮紙のような背景
      canvasBackground: '#ede7d9',  // キャンバス背景（グリッド外）
      lines: '#a0956b',             // セピア調のグリッド線
      cellBorder: '#c4b896',        // 薄いセピアの境界線
    },
    
    header: {
      background: '#f0ebe0',        // 少し濃い羊皮紙色
      text: '#5d4e37',              // ダークブラウンのテキスト
      border: '#a0956b',            // セピア調の境界線
      corner: '#ede7d9',            // 角の装飾
    },
    
    items: {
      teleport: '#8b7355',          // 古いブロンズ色
      teleportBorder: '#5d4e37',    // ダークブラウン
      event: '#a0522d',             // 古いレンガ色
      elevator: '#cd853f',          // アンティークゴールド
      stairs: '#6b5b73',            // 古い石の色
      chest: '#b8860b',             // 古い金色
      currentPosition: '#b22222',   // ファイアブリック（赤み強化）
      arrow: '#6b5b73',             // 古い石の色
      note: '#faf6f0',              // 非常に薄いセピア
      noteBorder: '#5d4e37',        // ダークブラウン
      noteTriangle: '#a0522d',      // Note triangle (古いレンガ色、彩度を下げた赤)
      shute: '#704214',             // ダークブラウン
      darkZone: 'rgba(61, 43, 31, 0.7)',  // セピア調の暗い部分
    },
    
    walls: {
      stroke: '#5d4e37',            // ダークブラウンの壁
      strokeWidth: 2,
    },
    
    doors: {
      open: {
        background: '#f7f3e9',      // 羊皮紙色
        border: '#5d4e37',          // ダークブラウン
      },
      closed: {
        background: '#8b7355',      // ブロンズ色
        border: '#5d4e37',          // ダークブラウン
      },
    },
    
    ui: {
      panel: '#3d2b1f',             // ダークセピア
      panelText: '#f0ebe0',         // 薄いセピア
      button: '#3d2b1f',            // ダークブラウン
      buttonHover: '#8b7355',       // ブロンズ色
      buttonActive: '#a0956b',      // アクティブセピア
      buttonActiveHover: '#8b7355', // アクティブボタンホバー（ブロンズ色）
      groupHeader: '#704214',       // グループヘッダー背景（濃いブラウン）
      background: '#faf6f0',        // 薄いセピア背景（入力フィールド用）
      text: '#3d2415',              // ダークブラウンテキスト（入力フィールド用）
      input: '#5d4e37',             // ダークブラウン
      inputText: '#f0ebe0',         // 薄いセピア
      border: '#3d2b1f',            // ブロンズ色
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