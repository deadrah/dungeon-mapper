import React, { useState } from 'react'

const HelpDialog = ({ isOpen, onClose }) => {
  const [language, setLanguage] = useState('ja') // 'ja' or 'en'

  if (!isOpen) return null

  const content = {
    ja: {
      title: 'DMapper - 機能説明',
      version: 'バージョン 1.3.0',
      close: '閉じる',
      sections: {
        about: {
          title: 'DMapperについて',
          content: 'DMapperは3Dダンジョンゲーム用のWebベースグリッドマッピングツールです。サーバー不要のクライアントサイドのみで動作し、ブラウザのローカルストレージにデータを保存します。'
        },
        controls: {
          title: '基本操作',
          items: [
            { label: 'マウスホイール:', desc: 'ズームイン/アウト' },
            { label: 'Shift + ドラッグ:', desc: 'パン（画面移動）' },
            { label: '左クリック:', desc: 'アイテム配置・色塗り・壁描画' },
            { label: '右クリック:', desc: 'アイテム削除・色消去・壁削除' },
            { label: 'スマホ:', desc: '消去したい場合は消去ツール（⌫）を選択してタップ' }
          ]
        },
        keyboard: {
          title: 'キーボードショートカット',
          items: [
            { label: '1-5, Q, E:', desc: 'ツール選択' },
            { label: 'Ctrl + S:', desc: 'マップエクスポート' },
            { label: 'Ctrl + L:', desc: 'マップインポート' },
            { label: 'Ctrl + Z:', desc: '元に戻す' },
            { label: 'Ctrl + Y:', desc: 'やり直し' }
          ]
        },
        tools: {
          title: 'ツール説明',
          items: [
            { name: '壁描画（Line）:', desc: 'グリッドの境界線に壁を描画します。クリック&ドラッグで連続描画が可能です。', color: 'text-purple-600' },
            { name: 'ブロック色塗り:', desc: 'グリッドのセルに色を塗ります。右下のカラーピッカーで色を選択できます。', color: 'text-green-600' },
            { name: 'ダークゾーン:', desc: '暗いエリアをグレーで表示します。', color: 'text-gray-600' },
            { name: '階段:', desc: '上り階段（▲）と下り階段（▼）を配置します。', color: 'text-blue-600' },
            { name: '宝箱・ワープ・イベント:', desc: '宝箱、ワープポイント、イベントマーカーを配置します。', color: 'text-yellow-600' },
            { name: '現在位置:', desc: 'プレイヤーの現在位置を示します（1フロアにつき1つのみ）。', color: 'text-red-600' },
            { name: 'ドア:', desc: '既存の壁に開いたドア（□）または閉じたドア（■）を配置します。', color: 'text-orange-600' },
            { name: '矢印:', desc: 'グリッドセルまたは壁に方向矢印を配置します。', color: 'text-indigo-600' },
            { name: 'ノート:', desc: 'セルにメモを追加します。クリックでテキストダイアログが開きます。', color: 'text-pink-600' },
            { name: '消去ツール（Eraser）:', desc: '左クリック・ドラッグですべてのオブジェクトを削除できます。(スマホで右クリック消去できないので仮対応)', color: 'text-red-500' }
          ]
        },
        mapManagement: {
          title: 'マップ管理',
          items: [
            { label: 'Map選択:', desc: '複数のマップを管理できます（最大10個）' },
            { label: 'Rename:', desc: 'マップに名前を付けることができます' },
            { label: 'Floor選択:', desc: '各マップにつき30階層まで対応' },
            { label: 'Reset:', desc: '現在のフロアのデータを全削除' },
            { label: 'Grid Size:', desc: 'グリッドサイズを5x5から50x50まで調整可能' },
            { label: 'Note:', desc: 'メモのツールチップ表示をオン/オフ切り替え（常時表示）' }
          ]
        },
        dataSaving: {
          title: 'データ保存',
          items: [
            { label: '自動保存:', desc: '操作は自動的にブラウザのローカルストレージに保存されます' },
            { label: 'Export:', desc: 'JSONファイルとしてマップデータをダウンロード' },
            { label: 'Import:', desc: 'JSONファイルからマップデータを読み込み' },
            { label: 'SVG:', desc: '現在のフロアをSVG画像ファイルとしてダウンロード' }
          ]
        },
        notes: {
          title: '注意事項',
          items: [
            'データはブラウザのローカルストレージに保存されるため、ブラウザデータを削除すると消失します',
            '重要なマップは定期的にExport機能でバックアップを取ることを推奨します',
            'ドアや壁の矢印は、既存の壁にのみ配置できます',
            'セルの矢印は壁とは独立してセルの中央に配置されます'
          ]
        },
        changelog: {
          title: '更新履歴',
          items: [
            { version: 'v1.3.0', date: '2025-06-22', changes: ['スマホ表示対応'] },
            { version: 'v1.2.0', date: '2025-06-22', changes: ['メモのツールチップ常時表示機能を追加', 'Noteボタンでツールチップのオン/オフ切り替え', 'DoorOpenの色を白に変更'] },
            { version: 'v1.1.1', date: '2025-06-22', changes: ['SVGエクスポートの表示品質を改善', '宝箱デザインをメインキャンバスと統一', 'Grid Arrowをシンプルな文字矢印に統一', 'Line Arrowの位置とデザインを修正'] },
            { version: 'v1.1.0', date: '2025-06-22', changes: ['SVGエクスポート機能を追加', '消去ツール（Eraser）を追加 - スマホ仮対応', 'ファイル名にタイムスタンプを追加'] },
            { version: 'v1.0.0', date: '2025-06-21', changes: ['初回リリース', '基本的なマッピング機能', 'マルチフロア・マルチマップ対応', 'JSONエクスポート/インポート機能'] }
          ]
        }
      }
    },
    en: {
      title: 'DMapper - User Guide',
      version: 'Version 1.3.0',
      close: 'Close',
      sections: {
        about: {
          title: 'About DMapper',
          content: 'DMapper is a web-based grid mapping tool for 3D dungeon games. It operates entirely client-side without requiring a server and stores data in the browser\'s local storage.'
        },
        controls: {
          title: 'Basic Controls',
          items: [
            { label: 'Mouse Wheel:', desc: 'Zoom in/out' },
            { label: 'Shift + Drag:', desc: 'Pan (move view)' },
            { label: 'Left Click:', desc: 'Place items, fill colors, draw walls' },
            { label: 'Right Click:', desc: 'Remove items, clear colors, erase walls' },
            { label: 'Mobile:', desc: 'To erase, select the Eraser tool (⌫) and tap' }
          ]
        },
        keyboard: {
          title: 'Keyboard Shortcuts',
          items: [
            { label: '1-5, Q, E:', desc: 'Tool selection' },
            { label: 'Ctrl + S:', desc: 'Export map' },
            { label: 'Ctrl + L:', desc: 'Import map' },
            { label: 'Ctrl + Z:', desc: 'Undo' },
            { label: 'Ctrl + Y:', desc: 'Redo' }
          ]
        },
        tools: {
          title: 'Tool Description',
          items: [
            { name: 'Wall Drawing (Line):', desc: 'Draw walls on grid boundaries. Click & drag for continuous drawing.', color: 'text-purple-600' },
            { name: 'Block Color Fill:', desc: 'Fill grid cells with colors. Use the color picker in the bottom right.', color: 'text-green-600' },
            { name: 'Dark Zone:', desc: 'Mark dark areas with gray shading.', color: 'text-gray-600' },
            { name: 'Stairs:', desc: 'Place up stairs (▲) and down stairs (▼).', color: 'text-blue-600' },
            { name: 'Chest, Warp, Event:', desc: 'Place treasure chests, warp points, and event markers.', color: 'text-yellow-600' },
            { name: 'Current Position:', desc: 'Mark player\'s current location (only one per floor).', color: 'text-red-600' },
            { name: 'Doors:', desc: 'Place open doors (□) or closed doors (■) on existing walls.', color: 'text-orange-600' },
            { name: 'Arrows:', desc: 'Place directional arrows on grid cells or walls.', color: 'text-indigo-600' },
            { name: 'Notes:', desc: 'Add text memos to cells. Click to open text dialog.', color: 'text-pink-600' },
            { name: 'Eraser Tool:', desc: 'Delete all objects with left click/drag. Mobile-friendly tool that doesn\'t require right-click.', color: 'text-red-500' }
          ]
        },
        mapManagement: {
          title: 'Map Management',
          items: [
            { label: 'Map Selection:', desc: 'Manage multiple maps (up to 10)' },
            { label: 'Rename:', desc: 'Give custom names to your maps' },
            { label: 'Floor Selection:', desc: 'Support up to 30 floors per map' },
            { label: 'Reset:', desc: 'Clear all data on current floor' },
            { label: 'Grid Size:', desc: 'Adjust grid size from 5x5 to 50x50' },
            { label: 'Note:', desc: 'Toggle note tooltip display on/off (always visible when on)' }
          ]
        },
        dataSaving: {
          title: 'Data Storage',
          items: [
            { label: 'Auto-save:', desc: 'All changes are automatically saved to browser local storage' },
            { label: 'Export:', desc: 'Download map data as JSON file' },
            { label: 'Import:', desc: 'Load map data from JSON file' },
            { label: 'SVG:', desc: 'Download current floor as SVG image file' }
          ]
        },
        notes: {
          title: 'Important Notes',
          items: [
            'Data is stored in browser local storage and will be lost if browser data is cleared',
            'Regular backups using the Export function are recommended for important maps',
            'Doors and wall arrows can only be placed on existing walls',
            'Cell arrows are placed independently in the center of grid cells'
          ]
        },
        changelog: {
          title: 'Update History',
          items: [
            { version: 'v1.3.0', date: '2025-06-22', changes: ['Mobile support'] },
            { version: 'v1.2.0', date: '2025-06-22', changes: ['Added always-visible note tooltips', 'Note button to toggle tooltip display on/off', 'Changed DoorOpen color to white'] },
            { version: 'v1.1.1', date: '2025-06-22', changes: ['Improved SVG export visual quality', 'Unified chest design with main canvas', 'Unified Grid Arrows to simple text arrows', 'Fixed Line Arrow positioning and design'] },
            { version: 'v1.1.0', date: '2025-06-22', changes: ['Added SVG export functionality', 'Added Eraser tool - mobile-friendly', 'Added timestamps to file names', 'Improved SVG output color accuracy'] },
            { version: 'v1.0.0', date: '2025-06-21', changes: ['Initial release', 'Basic mapping functionality', 'Multi-floor and multi-map support', 'JSON export/import functionality'] }
          ]
        }
      }
    }
  }

  const currentContent = content[language]

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-black">{currentContent.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{currentContent.version}</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setLanguage('ja')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  language === 'ja'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                日本語
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  language === 'en'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                English
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              title={currentContent.close}
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="text-black space-y-6">
          {/* About */}
          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">{currentContent.sections.about.title}</h3>
            <p className="text-gray-700">{currentContent.sections.about.content}</p>
          </section>

          {/* Basic Controls */}
          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">{currentContent.sections.controls.title}</h3>
            <div className="space-y-2">
              {currentContent.sections.controls.items.map((item, index) => (
                <div key={index}><strong>{item.label}</strong> {item.desc}</div>
              ))}
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">{currentContent.sections.keyboard.title}</h3>
            <div className="space-y-2">
              {currentContent.sections.keyboard.items.map((item, index) => (
                <div key={index}><strong>{item.label}</strong> {item.desc}</div>
              ))}
            </div>
          </section>

          {/* Tools */}
          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">{currentContent.sections.tools.title}</h3>
            <div className="space-y-3">
              {currentContent.sections.tools.items.map((tool, index) => (
                <div key={index}>
                  <strong className={tool.color}>{tool.name}</strong>
                  <p className="text-gray-700 ml-4">{tool.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Map Management */}
          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">{currentContent.sections.mapManagement.title}</h3>
            <div className="space-y-2">
              {currentContent.sections.mapManagement.items.map((item, index) => (
                <div key={index}><strong>{item.label}</strong> {item.desc}</div>
              ))}
            </div>
          </section>

          {/* Data Saving */}
          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">{currentContent.sections.dataSaving.title}</h3>
            <div className="space-y-2">
              {currentContent.sections.dataSaving.items.map((item, index) => (
                <div key={index}><strong>{item.label}</strong> {item.desc}</div>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">{currentContent.sections.notes.title}</h3>
            <div className="space-y-2 text-gray-700">
              {currentContent.sections.notes.items.map((note, index) => (
                <div key={index}>• {note}</div>
              ))}
            </div>
          </section>

          {/* Changelog */}
          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">{currentContent.sections.changelog.title}</h3>
            <div className="space-y-4">
              {currentContent.sections.changelog.items.map((version, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <strong className="text-blue-700">{version.version}</strong>
                    <span className="text-sm text-gray-500">({version.date})</span>
                  </div>
                  <div className="space-y-1 text-gray-700">
                    {version.changes.map((change, changeIndex) => (
                      <div key={changeIndex}>• {change}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            {currentContent.close}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HelpDialog