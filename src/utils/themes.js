// DMapperのテーマ定義
// 各テーマはアプリケーション全体で使用される全ての色の値を含む

export const themes = {
  default: {
    name: 'Default',
    
    // グリッド色（Grid.jsx使用）
    grid: {
      background: '#d7e2f6',        // メイングリッド背景（Grid.jsx - グリッド描画エリア）
      canvasBackground: '#f8f8f8',  // キャンバス背景（Grid.jsx - グリッド外部エリア）
      lines: '#bfbfbf',             // グリッド線の色（Grid.jsx - 縦横の線）
      cellBorder: '#dbdbdb',        // 各セルの境界線（Grid.jsx - 色塗りセルの枠線）
    },
    
    // ヘッダー色（Grid.jsx使用）
    header: {
      background: '#f5f5f5',        // ヘッダー行/列の背景（Grid.jsx - 行番号・列番号エリア）
      text: '#374151',              // ヘッダーテキスト色（Grid.jsx - 行番号・列番号の文字）
      border: '#d1d5db',            // ヘッダー境界線（Grid.jsx - ヘッダーエリアの境界）
      corner: '#e5e7eb',            // 角装飾の背景（未使用）
    },
    
    // アイテム色（Items.jsx使用）
    items: {
      teleport: '#2fb8d4',          // ワープポイントの塗りつぶし（Items.jsx - テレポートアイテム）
      teleportBorder: '#0c4b5b',    // ワープポイントの境界線（Items.jsx - テレポートアイテム枠）
      event: '#ca0101',             // イベントマーカー（Items.jsx - イベントアイテム）
      elevator: '#b8860b',          // エレベーター（Items.jsx - エレベーターアイテム）
      stairs: '#0000ff',            // 階段（Items.jsx - 階段アイテム）
      chest: '#d4a017',             // 宝箱（Items.jsx - 宝箱アイテム）
      currentPosition: '#dc143c',   // 現在位置マーカー（Items.jsx - 現在位置アイテム）
      arrow: '#345dd1',             // 矢印の色（Items.jsx - 矢印アイテム）
      note: '#ffffff',              // ノート背景（Items.jsx - ノートアイテム背景）
      noteBorder: '#333333',        // ノート境界線（Items.jsx - ノートアイテム枠）
      noteTriangle: '#dc2626',      // ノート三角（Items.jsx - ノート角の赤三角）
      shute: '#800080',             // シュート/ピット色（Items.jsx - シュートアイテム）
      darkZone: 'rgba(0,0,0,0.6)',  // ダークゾーンオーバーレイ（Items.jsx - ダークゾーン塗りつぶし）
    },
    
    // 壁の色（Walls.jsx使用）
    walls: {
      stroke: '#000000',            // 壁線の色（Walls.jsx - 壁描画の線色）
      strokeWidth: 2,               // 壁線の幅（Walls.jsx - 壁描画の線幅）
    },
    
    // ドアの色（Doors.jsx使用）
    doors: {
      open: {
        background: '#ffffff',      // 開いたドア背景（Doors.jsx - 開放ドア塗りつぶし）
        border: '#000000',          // 開いたドア境界線（Doors.jsx - 開放ドア枠線）
      },
      closed: {
        background: '#000000',      // 閉じたドア背景（Doors.jsx - 閉鎖ドア塗りつぶし）
        border: '#000000',          // 閉じたドア境界線（Doors.jsx - 閉鎖ドア枠線）
      },
    },
    
    // UI色（Header.jsx、ToolPanel.jsx、HelpDialog.jsx使用）
    ui: {
      panel: '#1f2937',             // ツールパネル背景（Header.jsx、ToolPanel.jsx - パネル背景色）
      panelText: '#ffffff',         // ツールパネルテキスト（Header.jsx、ToolPanel.jsx - パネル内文字色）
      button: '#1f2937',            // ボタン背景（Header.jsx、ToolPanel.jsx - 通常ボタン背景）
      buttonHover: '#4b5563',       // ボタンホバー（Header.jsx、ToolPanel.jsx - ボタンホバー時背景）
      buttonActive: '#496fc1',      // アクティブボタン（Header.jsx、ToolPanel.jsx - 選択中ボタン背景）
      buttonActiveHover: '#3b5998', // アクティブボタンホバー（Header.jsx、ToolPanel.jsx - 選択中ボタンホバー）
      groupHeader: '#374151',       // ツールグループヘッダー背景（ToolPanel.jsx - グループ見出し背景）
      background: '#ffffff',        // 入力フィールド用明るい背景（Header.jsx - 入力欄背景）
      text: '#374151',              // 入力フィールド用暗いテキスト（Header.jsx - 入力欄文字色）
      input: '#374151',             // 入力背景（Header.jsx - セレクトボックス背景）
      inputText: '#ffffff',         // 入力テキスト（Header.jsx - セレクトボックス文字色）
      border: '#374151',            // 一般的な境界線（Header.jsx - 各種境界線）
      helpHeading: '#60a5fa',       // ヘルプダイアログ見出し色（HelpDialog.jsx - セクション見出し）
      helpToolColor: '#93c5fd',     // ヘルプダイアログツール色（HelpDialog.jsx - ツール名強調）
      resetButton: '#dc2626',       // リセットボタン色（Header.jsx - リセット系ボタン背景）
      resetButtonHover: '#b91c1c',  // リセットボタンホバー色（Header.jsx - リセット系ボタンホバー）
      resetButtonText: '#ffffff',   // リセットボタンテキスト色（Header.jsx - リセット系ボタン文字）
      helpButton: '#b45309',        // ヘルプボタン色（Header.jsx - ヘルプボタン背景）
      helpButtonHover: '#92400e',   // ヘルプボタンホバー色（Header.jsx - ヘルプボタンホバー）
      helpButtonText: '#ffffff',    // ヘルプボタンテキスト色（Header.jsx - ヘルプボタン文字）
      menuSectionHeading: '#60a5fa', // メニューセクション見出し色（Header.jsx - メニュー内セクション見出し）
    }
  },
  
  dungeon: {
    name: 'Dungeon',
    
    grid: {
      background: '#e1d7be',        // 古い羊皮紙のような背景
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
      helpHeading: '#daa520',       // ヘルプダイアログ見出し色（HelpDialog.jsx - セクション見出し）
      helpToolColor: '#b8860b',     // ヘルプダイアログツール色（HelpDialog.jsx - ツール名強調）
      resetButton: '#a0522d',       // リセットボタン色（Header.jsx - リセット系ボタン背景）
      resetButtonHover: '#8b4513',  // リセットボタンホバー色（Header.jsx - リセット系ボタンホバー）
      resetButtonText: '#f0ebe0',   // リセットボタンテキスト色（Header.jsx - リセット系ボタン文字）
      helpButton: '#cd853f',        // ヘルプボタン色（Header.jsx - ヘルプボタン背景）
      helpButtonHover: '#b8860b',   // ヘルプボタンホバー色（Header.jsx - ヘルプボタンホバー）
      helpButtonText: '#f0ebe0',    // ヘルプボタンテキスト色（Header.jsx - ヘルプボタン文字）
      menuSectionHeading: '#daa520', // メニューセクション見出し色（Header.jsx - メニュー内セクション見出し）
    }
  },

  Yggdrasill: {
    name: 'Yggdrasill',
    
    grid: {
      background: '#c6dbe7',        // より薄い青色の背景（グリッド描写範囲内）
      canvasBackground: '#ecf9f7',  // 少し濃い青色のキャンバス背景（グリッド全体背景）
      lines: '#a5bbc5',             // 青灰色のグリッド線
      cellBorder: '#a5bbc5',        // セル境界線
    },
    
    header: {
      background: '#a5c2d3',        // 暗い緑色ヘッダー背景
      text: '#143f59',              // 白色テキスト（視認性向上）
      border: '#a5bbc5',            // 濃い緑色境界線
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
      helpHeading: '#f0fdfc',       // ヘルプダイアログ見出し色（HelpDialog.jsx - セクション見出し）
      helpToolColor: '#b8fffa',     // ヘルプダイアログツール色（HelpDialog.jsx - ツール名強調）
      resetButton: '#a93a3a',       // リセットボタン色（Header.jsx - リセット系ボタン背景）
      resetButtonHover: '#bb4c4c',  // リセットボタンホバー色（Header.jsx - リセット系ボタンホバー）
      resetButtonText: '#ffffff',   // リセットボタンテキスト色（Header.jsx - リセット系ボタン文字）
      helpButton: '#4ecdc4',        // ヘルプボタン色（Header.jsx - ヘルプボタン背景）
      helpButtonHover: '#3a7d6e',   // ヘルプボタンホバー色（Header.jsx - ヘルプボタンホバー）
      helpButtonText: '#0b412a',    // ヘルプボタンテキスト色（Header.jsx - ヘルプボタン文字）
      menuSectionHeading: '#4ecdc4', // メニューセクション見出し色（Header.jsx - メニュー内セクション見出し）
    }
  },

  hell: {
    name: 'Hell',
    
    grid: {
      background: '#3e1414',        // 暗い茶色の背景（地下室風）
      canvasBackground: '#000',  // さらに暗い背景（キャンバス外）
      lines: '#4a2817',             // 暗い赤茶色のグリッド線
      cellBorder: '#ddd2cc',        // 暗いオレンジ茶色の境界線
    },
    
    header: {
      background: '#3a201a',        // 暗い赤茶色ヘッダー
      text: '#e1bc45',              // ゴールド色のテキスト
      border: '#4a2817',            // 暗い赤茶色の境界線
      corner: '#2a1810',            // 角の装飾
    },
    
    items: {
      teleport: '#b22222',          // ダークレッド（ワープポイント）
      teleportBorder: '#8b0000',    // より暗い赤
      event: '#ff4500',             // オレンジレッド（イベント）
      elevator: '#cd853f',          // ペルー色（エレベーター）
      stairs: '#a0522d',            // サドルブラウン（階段）
      chest: '#b99624',             // ゴールド（宝箱）
      chestBackground: '#fff3d0',   // ゴールド（宝箱背景）
      currentPosition: '#dc143c',   // クリムゾン（現在位置）
      arrow: '#b22222',             // ダークレッド（矢印）
      note: '#fff8dc',              // コーンシルク（ノート背景）
      noteBorder: '#8b4513',        // サドルブラウン（ノート枠）
      noteTriangle: '#dc143c',      // クリムゾン（ノート三角）
      shute: '#8b0000',             // ダークレッド（シュート）
      darkZone: 'rgba(139, 0, 0, 0.7)',  // 暗い赤のオーバーレイ
    },
    
    walls: {
      stroke: '#d50a0a',            // ダークレッドの壁
      strokeWidth: 2,
    },
    
    doors: {
      open: {
        background: '#fff8dc',      // コーンシルク（開いたドア）
        border: '#b90000',          // サドルブラウン
      },
      closed: {
        background: '#8b0000',      // ダークレッド（閉じたドア）
        border: '#b90000',          // サドルブラウン枠
      },
    },
    
    ui: {
      panel: '#1a0a0a',             // 非常に暗い赤パネル
      panelText: '#e1bc45',         // ゴールド色テキスト
      button: '#1a0a0a',            // 暗い赤ボタン背景
      buttonHover: '#4a1a1a',       // ボタンホバー（少し明るい赤）
      buttonActive: '#8b0000',      // アクティブボタン（ダークレッド）
      buttonActiveHover: '#a52a2a', // アクティブボタンホバー（ブラウン）
      groupHeader: '#2a0f0f',       // グループヘッダー（暗い赤）
      background: '#f5deb3',        // 麦色背景（入力フィールド用）
      text: '#68250b',              // サドルブラウンテキスト（入力フィールド用）
      input: '#68250b',             // サドルブラウン
      inputText: '#f5deb3',         // 麦色テキスト
      border: '#000',            // ダークレッド境界線
      helpHeading: '#ffd700',       // ゴールド色（ヘルプ見出し）
      helpToolColor: '#ff6347',     // トマト色（ヘルプツール色）
      resetButton: '#5a0000',       // ダークレッド（リセットボタン）
      resetButtonHover: '#7a0000',  // ブラウン（リセットボタンホバー）
      resetButtonText: '#e1bc45',   // ゴールド色（リセットボタンテキスト）
      helpButton: '#b8860b',        // ダークゴールドロッド（ヘルプボタン）
      helpButtonHover: '#daa520',   // ゴールドロッド（ヘルプボタンホバー）
      helpButtonText: '#1a0a0a',    // 暗い赤（ヘルプボタンテキスト）
      menuSectionHeading: '#ff6347', // トマト色（メニューセクション見出し）
    }
  },

  monochrome: {
    name: 'Monochrome',
    
    grid: {
      background: '#e3e3e3',        // 明るいグレー（紙地図風）
      canvasBackground: '#ffffff',  // 純白（清潔感）
      lines: '#c0c0c0',             // 中間グレー（グリッド線）
      cellBorder: '#a0a0a0',        // やや濃いグレー（セル境界）
    },
    
    header: {
      background: '#d8d8d8',        // より濃いグレー（コントラスト向上）
      text: '#000000',              // 黒（最高コントラスト）
      border: '#808080',            // より濃いグレー（境界を明確に）
      corner: '#d0d0d0',            // 角の装飾
    },
    
    items: {
      teleport: '#515b81',          // 中間グレー（ワープポイント）
      teleportBorder: '#404040',    // 濃いグレー
      event: '#8d0808',             // やや濃いグレー（イベント）
      elevator: '#816851',          // 中グレー（エレベーター）
      stairs: '#555555',            // 濃いグレー（階段）
      chest: '#404040',             // 非常に濃いグレー（宝箱・重要）
      chestBackground: '#d0d0d0',   // 薄いグレー背景（宝箱背景）
      currentPosition: '#8d0808',   // 黒（最重要・現在位置）
      arrow: '#333',             // 中濃いグレー（矢印）
      note: '#ffffff',              // 白背景（ノート）
      noteBorder: '#333333',        // 濃いグレー枠（ノート枠）
      noteTriangle: '#8d0808',      // 黒（目立たせる・ノート三角）
      shute: '#404040',             // 中間グレー（シュート）
      darkZone: 'rgba(0,0,0,0.4)',  // 半透明黒（ダークゾーン）
    },
    
    walls: {
      stroke: '#000000',            // 黒（壁・指定通り）
      strokeWidth: 2,
    },
    
    doors: {
      open: {
        background: '#ffffff',      // 白（開いたドア）
        border: '#000000',          // 黒
      },
      closed: {
        background: '#000000',      // 中間グレー（閉じたドア）
        border: '#000000',          // 黒枠
      },
    },
    
    ui: {
      panel: '#000',             // 濃いグレーパネル
      panelText: '#ffffff',         // 明るいグレーテキスト
      button: '#000',            // 濃いグレーボタン背景
      buttonHover: '#505050',       // やや明るいグレー（ボタンホバー）
      buttonActive: '#3a425e',      // 中間グレー（アクティブボタン）
      buttonActiveHover: '#4b5578', // やや濃いグレー（アクティブボタンホバー）
      groupHeader: '#2a2a2a',       // 非常に濃いグレー（グループヘッダー）
      background: '#ffffff',        // 白（入力フィールド背景）
      text: '#333333',              // 濃いグレー（入力テキスト）
      input: '#404040',             // 濃いグレー
      inputText: '#f0f0f0',         // 明るいグレー
      border: '#000000',            // 黒（境界線）
      helpHeading: '#e0e0e0',       // 明るいグレー（ヘルプ見出し）
      helpToolColor: '#c0c0c0',     // 中間グレー（ヘルプツール色）
      resetButton: '#6a1212',       // 濃いグレー（リセットボタン）
      resetButtonHover: '#871717',  // やや明るいグレー（リセットボタンホバー）
      resetButtonText: '#f0f0f0',   // 明るいグレー（リセットボタンテキスト）
      helpButton: '#606060',        // 中間グレー（ヘルプボタン）
      helpButtonHover: '#707070',   // やや明るいグレー（ヘルプボタンホバー）
      helpButtonText: '#ffffff',    // 白（ヘルプボタンテキスト）
      menuSectionHeading: '#c0c0c0', // 中間グレー（メニューセクション見出し）
    }
  }
}

// 名前でテーマを取得するヘルパー関数
export const getTheme = (themeName) => {
  return themes[themeName] || themes.default
}

// 利用可能なテーマ名のリストを取得
export const getThemeNames = () => {
  return Object.keys(themes)
}

// テーマオブジェクトと表示名のリストを取得
export const getThemeOptions = () => {
  return Object.entries(themes).map(([key, theme]) => ({
    value: key,
    label: theme.name
  }))
}