import React from 'react'

const HelpDialog = ({ isOpen, onClose, language = 'ja', onLanguageChange }) => {

  if (!isOpen) return null

  const content = {
    ja: {
      title: 'DMapper - 機能説明 - 更新履歴',
      version: 'バージョン 1.4.0',
      close: '閉じる',
      sections: {
        about: {
          title: 'DMapperについて',
          content: 'DMapperは3Dダンジョンゲーム用のWebベースグリッドマッピングツールです。サーバー不要のクライアントサイドのみで動作し、ブラウザのローカルストレージにデータを保存します。'
        },
        controls: {
          title: '基本操作',
          items: [
            { label: 'マップ拡大縮小:', desc: 'マウスホイール / ピンチインアウト' },
            { label: 'マップ画面移動:', desc: 'Shift + ドラッグ / フリック' },
            { label: 'アイテム配置・色塗り・壁描画:', desc: '左クリック / タップ' },
            { label: 'アイテム削除・色消去・壁削除:', desc: '右クリック / 消去ツール' },
            { label: 'メモ編集:', desc: '既存メモをクリック（任意のツール状態で可能）' }
          ]
        },
        keyboard: {
          title: 'キーボードショートカット',
          items: [
            { label: 'ツール選択:', desc: '1-5, Q, E' },
            { label: '元に戻す:', desc: 'Ctrl + Z' },
            { label: 'やり直し:', desc: 'Ctrl + Y' }
          ]
        },
        tools: {
          title: 'ツール説明',
          items: [
            { name: '壁描画（Line）:', desc: 'セルの境界線に壁を描画します。クリック&ドラッグで連続描画が可能です。', color: 'text-purple-600' },
            { name: '色塗り（Fill）:', desc: 'セルに色を塗ります。右下のカラーピッカーで色を選択できます。踏破済、ダークゾーン、魔法禁止エリアなどの塗分けに使用できます。', color: 'text-green-600' },
            { name: 'ダークゾーン:', desc: 'セルをグレーで塗ります。', color: 'text-gray-600' },
            { name: '階段:', desc: '上り階段（▲）と下り階段（▼）を配置します。', color: 'text-blue-600' },
            { name: '宝箱:', desc: '宝物の場所を示すマーカーです。', color: 'text-yellow-600' },
            { name: 'テレポートポイント:', desc: '右下の文字入力欄で最大2文字の識別子を設定できます。複数のテレポート先を管理可能です。', color: 'text-purple-600' },
            { name: 'シュート・ピット:', desc: '落下地点を示します。右下のプルダウンでシュート（●）またはピット（○）を選択できます。', color: 'text-gray-600' },
            { name: 'イベントマーカー:', desc: '特殊イベントの発生場所を示します。', color: 'text-yellow-600' },
            { name: '現在位置:', desc: 'プレイヤーの現在位置を示します（1フロアにつき1つのみ）。', color: 'text-red-600' },
            { name: 'ドア:', desc: '既存の壁に開いたドア（□）または閉じたドア（■）を配置します。', color: 'text-orange-600' },
            { name: '矢印:', desc: 'セルまたは壁に一方通行や強制移動矢印を配置します。', color: 'text-indigo-600' },
            { name: 'ノート:', desc: 'セルにメモを追加します。クリックでテキストダイアログが開きます。', color: 'text-pink-600' },
            { name: '消去ツール（Eraser）:', desc: '左クリック・ドラッグですべてのオブジェクトを削除できます。(スマホで右クリック消去できないので仮対応)', color: 'text-red-500' }
          ]
        },
        mapManagement: {
          title: 'ダンジョン管理',
          items: [
            { label: '複数ダンジョン管理（最大10個）:', desc: 'Dungeon選択' },
            { label: 'ダンジョン名前付け:', desc: 'Renameボタン' },
            { label: '階層切り替え（最大30階）:', desc: 'Floor選択' },
            { label: '現在フロア全削除:', desc: 'Resetボタン' },
            { label: 'グリッドサイズ調整（5x5〜50x50）:', desc: 'Grid Sizeスライダー' },
            { label: 'メモ常時表示切り替え:', desc: 'Noteボタン' }
          ]
        },
        dataSaving: {
          title: 'データ保存',
          items: [
            { label: '自動保存:', desc: 'ブラウザのローカルストレージに自動保存' },
            { label: '全データダウンロード:', desc: 'Export All Dataボタン' },
            { label: '全データ復元:', desc: 'Import All Dataボタン' },
            { label: 'ダンジョン単位セーブ:', desc: '選択したダンジョンのみをSave Dungeonボタン' },
            { label: 'ダンジョン単位ロード:', desc: '選択スロットにLoad Dungeonボタン' },
            { label: 'SVG画像ダウンロード:', desc: 'SVGボタン' }
          ]
        },
        settings: {
          title: '設定',
          items: [
            { label: '言語切り替え:', desc: 'ヘルプ画面右上のJP/ENボタンで表示言語を切り替え（メッセージも連動）' }
          ]
        },
        notes: {
          title: '注意事項',
          items: [
            'データはブラウザのローカルストレージに保存されるため、ブラウザデータを削除すると消失します',
            '重要なダンジョンマップは定期的にExport機能でバックアップを取ることを推奨します',
            'ドアや壁の矢印は、既存の壁にのみ配置できます'
          ]
        },
        changelog: {
          title: '更新履歴',
          items: [
            { version: 'v1.4.0', date: '2025-06-23', changes: ['スマホ対応：フリックでのマップ移動に対応'] },
            { version: 'v1.3.8', date: '2025-06-23', changes: ['Line系ツール選択中でもメモ編集が可能に', 'テキスト入力中のキーボードショートカット干渉を修正'] },
            { version: 'v1.3.7', date: '2025-06-23', changes: ['テレポートポイントに2文字識別子機能を追加', 'ズーム表示をクリックで100%リセット', 'Shute●ツールでPitを表す○も配置可能（右下プルダウンで選択）'] },
            { version: 'v1.3.6', date: '2025-06-23', changes: ['ライン幅とグリッド色の調整', '重要な配列アクセスバグを修正'] },
            { version: 'v1.3.5', date: '2025-06-23', changes: ['ダンジョン毎のセーブロードに対応', '多言語対応整備'] },
            { version: 'v1.3.4', date: '2025-06-23', changes: ['ヘッダー表示項目の整備', 'エクスポートデータの軽量化', '[マップ]-[フロア]構造から[ダンジョン]-[フロア]に名称変更', '1ダンジョンにつき30フロアを管理可能(最大10ダンジョン)'] },
            { version: 'v1.3.3', date: '2025-06-22', changes: ['スマホにハンバーガーメニューで機能を追加'] },
            { version: 'v1.3.2', date: '2025-06-22', changes: ['どのツールでもNoteを開けるように変更'] },
            { version: 'v1.3.1', date: '2025-06-22', changes: ['スマホタッチ操作を改善', '1本指はツール操作専用、2本指でマップ移動・ズーム', 'ヘルプの操作説明を「機能：操作方法」形式に統一'] },
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
      title: 'DMapper - User Guide - Update History',
      version: 'Version 1.4.0',
      close: 'Close',
      sections: {
        about: {
          title: 'About DMapper',
          content: 'DMapper is a web-based grid mapping tool for 3D dungeon games. It operates entirely client-side without requiring a server and stores data in the browser\'s local storage.'
        },
        controls: {
          title: 'Basic Controls',
          items: [
            { label: 'Zoom in/out:', desc: 'Mouse wheel / Pinch gestures' },
            { label: 'Pan (move view):', desc: 'Shift + drag / Swipe' },
            { label: 'Place items, fill colors, draw walls:', desc: 'Left click / Tap' },
            { label: 'Remove items, clear colors, erase walls:', desc: 'Right click / Eraser tool' },
            { label: 'Edit notes:', desc: 'Click existing note (works with any tool)' }
          ]
        },
        keyboard: {
          title: 'Keyboard Shortcuts',
          items: [
            { label: '1-5, Q, E:', desc: 'Tool selection' },
            { label: 'Ctrl + Z:', desc: 'Undo' },
            { label: 'Ctrl + Y:', desc: 'Redo' }
          ]
        },
        tools: {
          title: 'Tool Description',
          items: [
            { name: 'Wall Drawing (Line):', desc: 'Draw walls on cell boundaries. Click & drag for continuous drawing.', color: 'text-purple-600' },
            { name: 'Color Fill (Fill):', desc: 'Fill cells with colors. Use the color picker in the bottom right. Can be used to mark explored areas, dark zones, magic-restricted areas, etc.', color: 'text-green-600' },
            { name: 'Dark Zone:', desc: 'Fill cells with gray color.', color: 'text-gray-600' },
            { name: 'Stairs:', desc: 'Place up stairs (▲) and down stairs (▼).', color: 'text-blue-600' },
            { name: 'Chest:', desc: 'Mark treasure locations.', color: 'text-yellow-600' },
            { name: 'Teleport Point:', desc: 'Use the text input in the bottom right to set up to 2 character identifiers. Manage multiple teleport destinations.', color: 'text-purple-600' },
            { name: 'Shute & Pit:', desc: 'Mark fall points. Use the dropdown in the bottom right to select Shute (●) or Pit (○).', color: 'text-gray-600' },
            { name: 'Event Marker:', desc: 'Mark special event locations.', color: 'text-yellow-600' },
            { name: 'Current Position:', desc: 'Mark player\'s current location (only one per floor).', color: 'text-red-600' },
            { name: 'Doors:', desc: 'Place open doors (□) or closed doors (■) on existing walls.', color: 'text-orange-600' },
            { name: 'Arrows:', desc: 'Place one-way or forced movement arrows on cells or walls.', color: 'text-indigo-600' },
            { name: 'Notes:', desc: 'Add text memos to cells. Click to open text dialog.', color: 'text-pink-600' },
            { name: 'Eraser Tool:', desc: 'Delete all objects with left click/drag. Mobile-friendly tool that doesn\'t require right-click.', color: 'text-red-500' }
          ]
        },
        mapManagement: {
          title: 'Dungeon Management',
          items: [
            { label: 'Dungeon Selection:', desc: 'Manage multiple dungeons (up to 10)' },
            { label: 'Rename:', desc: 'Give custom names to your dungeons' },
            { label: 'Floor Selection:', desc: 'Support up to 30 floors per dungeon' },
            { label: 'Reset:', desc: 'Clear all data on current floor' },
            { label: 'Grid Size:', desc: 'Adjust grid size from 5x5 to 50x50' },
            { label: 'Note:', desc: 'Toggle note tooltip display on/off (always visible when on)' }
          ]
        },
        dataSaving: {
          title: 'Data Storage',
          items: [
            { label: 'Auto-save:', desc: 'All changes are automatically saved to browser local storage' },
            { label: 'Export All Data:', desc: 'Download all dungeons as JSON file' },
            { label: 'Import All Data:', desc: 'Load all dungeons from JSON file' },
            { label: 'Save Dungeon:', desc: 'Download selected dungeon only as JSON file' },
            { label: 'Load Dungeon:', desc: 'Load dungeon file to selected slot (with overwrite confirmation)' },
            { label: 'SVG:', desc: 'Download current floor as SVG image file' }
          ]
        },
        settings: {
          title: 'Settings',
          items: [
            { label: 'Language Toggle:', desc: 'Switch display language using JP/EN buttons in top-right of help screen (messages also change)' }
          ]
        },
        notes: {
          title: 'Important Notes',
          items: [
            'Data is stored in browser local storage and will be lost if browser data is cleared',
            'Regular backups using the Export function are recommended for important dungeon maps',
            'Doors and wall arrows can only be placed on existing walls'
          ]
        },
        changelog: {
          title: 'Update History',
          items: [
            { version: 'v1.4.0', date: '2025-06-23', changes: ['Mobile support: Swipe panning functionality'] },
            { version: 'v1.3.8', date: '2025-06-23', changes: ['Fixed note editing while line tools are selected', 'Fixed keyboard shortcut interference during text input'] },
            { version: 'v1.3.7', date: '2025-06-23', changes: ['Added 2-character identifier feature for teleport points', 'Added click-to-reset zoom to 100%', 'Shute● tool can now place Pit○ markers (selectable via dropdown)'] },
            { version: 'v1.3.6', date: '2025-06-23', changes: ['Adjusted line width and grid colors', 'Fixed critical array access bugs'] },
            { version: 'v1.3.5', date: '2025-06-23', changes: ['Added per-dungeon save/load functionality', 'Multi-language support implementation'] },
            { version: 'v1.3.4', date: '2025-06-23', changes: ['Reorganized header UI for cleaner layout', 'Optimized export data file size', 'Renamed [Map]-[Floor] structure to [Dungeon]-[Floor]', 'Support up to 30 floors per dungeon (max 10 dungeons)'] },
            { version: 'v1.3.3', date: '2025-06-22', changes: ['Add hamburger menu for mobile with hidden desktop features'] },
            { version: 'v1.3.2', date: '2025-06-22', changes: ['Enable note editing with any tool'] },
            { version: 'v1.3.1', date: '2025-06-22', changes: ['Improved mobile touch controls', 'Single finger for tool operations, two fingers for map movement/zoom', 'Unified help documentation to "function: operation" format'] },
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
            <h2 className="text-2xl font-bold text-black">
              {language === 'ja' ? (
                <>DMapper - 機能説明 - <a href="#changelog" className="text-blue-600 hover:text-blue-800 underline">更新履歴</a></>
              ) : (
                <>DMapper - User Guide - <a href="#changelog" className="text-blue-600 hover:text-blue-800 underline">Update History</a></>
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{currentContent.version}</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => onLanguageChange('ja')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  language === 'ja'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                JP
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  language === 'en'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                EN
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

          {/* Settings */}
          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">{currentContent.sections.settings.title}</h3>
            <div className="space-y-2">
              {currentContent.sections.settings.items.map((item, index) => (
                <div key={index}><strong>{item.label}</strong> {item.desc}</div>
              ))}
            </div>
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
          <section id="changelog">
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