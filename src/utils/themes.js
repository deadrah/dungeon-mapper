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
      noteTriangle: '#d75516',      // Note triangle (古いレンガ色、彩度を下げた赤)
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
  },

  Yggdrasill: {
    name: 'Yggdrasill',
    
    grid: {
      background: '#e8f2f8',        // より薄い青色の背景（グリッド描写範囲内）
      canvasBackground: '#bbe1f5',  // 少し濃い青色のキャンバス背景（グリッド全体背景）
      lines: '#5a7c8a',             // 青灰色のグリッド線
      cellBorder: '#5a7c8a',        // セル境界線
    },
    
    header: {
      background: '#a5c2d3',        // 暗い緑色ヘッダー背景
      text: '#143f59',              // 白色テキスト（視認性向上）
      border: '#5a7c8a',            // 濃い緑色境界線
      corner: '#bbe1f5',            // 角の装飾（明るめ）
    },
    
    items: {
      teleport: '#1ba1d6',          // 暗いターコイズ（ワープポイント）
      teleportBorder: '#0f2525',    // より暗いシアン
      event: '#d63031',             // 濃い赤（イベント）
      elevator: '#e17055',          // オレンジ（エレベーター）
      stairs: '#6c5ce7',            // 濃い紫（階段）
      chest: '#e17055',             // オレンジ（宝箱）
      currentPosition: '#d63031',   // 濃い赤（現在位置）
      arrow: '#0984e3',             // 濃い青（矢印）
      note: '#ffffff',              // 白（ノート背景）
      noteBorder: '#2d3436',        // 濃いグレー（ノート枠）
      noteTriangle: '#d63031',      // 濃い赤（ノート三角）
      shute: '#7986cb',             // 青紫（シュート）
      darkZone: 'rgba(62, 92, 105, 0.6)',  // 暗い青灰色のオーバーレイ
    },
    
    walls: {
      stroke: '#042749',            // 青灰色の壁
      strokeWidth: 2,
    },
    
    doors: {
      open: {
        background: '#ffffff',      // 白（開いたドア）
        border: '#3e5c69',          // 青灰色
      },
      closed: {
        background: '#3e5c69',      // 青灰色（閉じたドア）
        border: '#3e5c69',          // 青灰色枠
      },
    },
    
    ui: {
      panel: '#0b412a',             // 暗い緑色パネル
      panelText: '#5afae2',         // 薄い緑色テキスト
      button: '#0b412a',            // 濃い緑色ボタン背景
      buttonHover: '#3a5d50',       // ボタンホバー（少し明るい緑）
      buttonActive: '#4a9d8e',      // アクティブボタン（緑寄りのターコイズ）
      buttonActiveHover: '#3a7d6e', // アクティブボタンホバー
      groupHeader: '#1a2f26',       // グループヘッダー
      background: '#ffffff',        // 入力フィールド背景（白）
      text: '#2d4a3e',              // 入力フィールドテキスト（暗い緑）
      input: '#2e5544',             // 従来のインプット背景
      inputText: '#b8d4c2',         // 従来のインプットテキスト
      border: '#0b412a',            // 境界線
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