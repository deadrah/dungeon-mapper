#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// HelpDialog.jsxのコンテンツデータ（手動で同期）
const content = {
  ja: {
    title: 'DMapper ヘルプ',
    version: 'バージョン 1.7.4',
    sections: {
      about: {
        title: 'DMapperについて',
        content: 'DMapperは3Dダンジョンゲーム用のWebベースグリッドマッピングツールです。サーバー不要のクライアントサイドのみで動作し、ブラウザのローカルストレージにデータを保存します。1つのダンジョンは複数のフロア（B1F〜B30F）で構成されており、各フロアで独立したマップを作成できます。ダンジョンごとに個別のグリッドサイズ設定が可能で、複数のダンジョンを並行して管理できます。'
      },
      controls: {
        title: '基本操作',
        items: [
          { label: 'マップ拡大縮小:', desc: 'マウスホイール / ピンチインアウト' },
          { label: 'マップ画面移動:', desc: 'Shift + ドラッグ / フリック' },
          { label: 'アイテム配置・色塗り・壁描画:', desc: '左クリック / タップ' },
          { label: 'アイテム削除・色消去・壁削除:', desc: '右クリック / 消去ツール' },
          { label: 'メモ編集:', desc: '既存メモをクリック（任意のツール状態で可能）' },
          { label: 'メモ移動:', desc: '既存メモをドラッグして別のセルに移動（PCマウスのみ/任意のツール状態で可能）' }
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
      lineTools: {
        title: 'Line系ツール（セル境界）',
        items: [
          { name: '壁（Line）:', desc: 'セルの境界線に壁を描画します。クリック&ドラッグで連続描画が可能です。' },
          { name: 'ドア:', desc: '壁に開いたドア（□）または閉じたドア（■）を配置します。' },
          { name: '矢印:', desc: '壁に一方通行矢印を配置します。' }
        ]
      },
      gridTools: {
        title: 'Grid系ツール（セル内）',
        items: [
          { name: '色塗り（Fill）:', desc: 'セルを色で塗りつぶします。右下のオプションで色を選択できます。探索済みエリア、暗闇地帯、魔法禁止エリアなどの表現に使用します。' },
          { name: 'ダークゾーン:', desc: 'セルをグレー色で塗りつぶします。' },
          { name: '階段:', desc: '上り階段（▲）と下り階段（▼）を配置します。右下のオプションで2文字までの識別子を設定できます。' },
          { name: '宝箱:', desc: '宝箱の位置をマークします。' },
          { name: 'テレポートポイント:', desc: '右下のオプションで2文字までの識別子を設定できます。複数のテレポート先を管理できます。' },
          { name: 'シュート＆ピット:', desc: '落下ポイントをマークします。右下のオプションでシュート（●）またはピット（○）を選択できます。' },
          { name: 'イベントマーカー:', desc: '特別なイベント発生地点をマークします。' },
          { name: '現在位置:', desc: 'プレイヤーの現在位置をマークします（フロアごとに1つまで）。' },
          { name: '矢印:', desc: '一方通行や強制移動の矢印を配置します。右下のオプションで方向を選択できます。' },
          { name: 'ドアアイテム:', desc: 'ドアアイテムを配置します。右下のオプションで開いた状態または閉じた状態を選択できます。デフォルトは閉じたドアです。' },
          { name: 'メモ:', desc: 'メモを追加します。既存のアイテムがあるセルにも配置可能で、左上角の赤い三角で表示されます。メモはどのツールでもクリックで編集、ドラッグで移動できます。Noteツール選択時の右クリックまたはダイアログ内の削除ボタンで削除できます。' },
          { name: '消去ツール:', desc: '左クリックでオブジェクトを削除します。' }
        ]
      },
      dungeonOptions: {
        title: 'ダンジョンオプション',
        items: [
          { label: 'ダンジョン選択:', desc: '編集対象のダンジョンを選択' },
          { label: 'ダンジョン名変更:', desc: 'ダンジョンにカスタム名を設定' },
          { label: 'グリッドサイズ調整:', desc: '幅と高さを個別に設定（1x1〜50x50）' },
          { label: 'ダンジョンリセット:', desc: '現在のダンジョンを完全に初期化' },
          { label: 'ダンジョン保存:', desc: '選択したダンジョンをJSONファイルでダウンロード' },
          { label: 'ダンジョン読み込み:', desc: 'JSONファイルからダンジョンデータをインポート' }
        ]
      },
      floorOptions: {
        title: 'フロアオプション',
        items: [
          { label: 'フロア選択:', desc: '編集対象のフロアを選択（データがあるフロアは*印で表示）' },
          { label: 'フロア名変更:', desc: 'フロアにカスタム名を設定' },
          { label: 'フロアコピー:', desc: '現在のフロアを他のダンジョン・フロアにコピー（GridSize差異は自動座標変換）' },
          { label: 'SVG画像ダウンロード:', desc: '現在のフロアをSVG形式でエクスポート' },
          { label: 'フロアリセット:', desc: '現在のフロアのデータをすべて削除' }
        ]
      },
      globalOptions: {
        title: '全般オプション機能',
        items: [
          { label: 'テーマ変更:', desc: 'Default、Dungeon、Hell、Yggdrasill、Monochromeテーマの切り替え' },
          { label: '全データエクスポート:', desc: 'すべてのダンジョンデータをJSONファイルでダウンロード' },
          { label: '全データインポート:', desc: 'JSONファイルからすべてのデータを復元' },
          { label: '全ダンジョンリセット:', desc: 'すべてのダンジョンデータを初期化' }
        ]
      },
      otherFeatures: {
        title: 'その他の機能',
        items: [
          { label: 'メモ表示切り替え:', desc: 'Noteボタンでメモのツールチップ表示をオン/オフ切り替え' },
          { label: '自動保存:', desc: 'ブラウザのローカルストレージに自動保存' }
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
          '重要なダンジョンマップは定期的にExport機能でバックアップを取ることを推奨します'
        ]
      },
      changelog: {
        title: '更新履歴',
        items: [
          { version: 'v1.7.4', date: '2025-07-08', changes: ['レイアウト・テーマ微調整'] },
          { version: 'v1.7.3', date: '2025-07-03', changes: ['Monochromeテーマを追加：グレースケールの高コントラスト新テーマ（印刷・アクセシビリティ重視）'] },
          { version: 'v1.7.2', date: '2025-07-02', changes: ['Hellテーマを追加：ダークで赤い色調の新テーマ'] },
          { version: 'v1.7.1', date: '2025-07-01', changes: ['旧バージョンのデータインポート時、Line系データ座標がずれる問題を修正'] },
          { version: 'v1.7.0', date: '2025-06-30', changes: ['UI再編成', 'ダンジョンオプションポップアップ：ダンジョン選択・名前変更・グリッドサイズ・保存・読み込み・リセットを統合', 'フロアオプションポップアップ：フロア選択・名前変更・SVGエクスポート・リセットを統合', 'フロア名変更機能を追加：カスタム名またはデフォルトB1F表示', 'フロアコピー機能を追加：Floor Optionから他のダンジョン・フロアにマップデータをコピー可能'] },
          { version: 'v1.6.4', date: '2025-06-26', changes: ['グリッドサイズ設定を改善：幅・高さを個別に設定可能（長方形グリッド対応）'] },
          { version: 'v1.6.3', date: '2025-06-26', changes: ['モバイルタッチ操作を改善：同じツールで同じ要素をタッチすると削除（PCでは従来通り）', '削除ツールの優先度システム実装：メモ＞アイテム＞色の順で削除', 'スワイプ操作時のエラーを修正'] },
          { version: 'v1.6.2', date: '2025-06-26', changes: ['ドアアイテムツールを追加：セルに配置可能なドア（開閉選択可能）'] },
          { version: 'v1.6.1', date: '2025-06-25', changes: ['Yggdrasillテーマを追加：樹と水をイメージした新テーマ'] },
          { version: 'v1.6.0', date: '2025-06-24', changes: ['メモドラッグ移動機能を追加：すべてのツールでメモをドラッグして別セルに移動可能(PCマウスのみ)'] },
          { version: 'v1.5.2', date: '2025-06-24', changes: ['メモツール刷新：どのアイテムと重複しても配置可能に', 'メモ表示を左上角の赤い三角に変更'] },
          { version: 'v1.5.1', date: '2025-06-24', changes: ['Grid Sizeコントロールをヘッダーからメニューに移動', 'モバイル・デスクトップメニューを統合', '全ダンジョンリセット機能を追加', 'Grid拡張・縮小時のLine系要素位置ずれを修正', 'Grid Size変更に実行ボタンと確認ダイアログを追加'] },
          { version: 'v1.5.0', date: '2025-06-24', changes: ['テーマシステム実装：デフォルト・ダンジョンテーマの2種類を追加'] },
          { version: 'v1.4.2', date: '2025-06-23', changes: ['Line系ツールの相互上書き', 'Lineが無い場所に直接Line系ツールを配置可能に', '階段ツールにも番号付け機能を追加'] },
          { version: 'v1.4.1', date: '2025-06-23', changes: ['GridArrowツールを統合、右下での選択に。GridArrow内に回転床も追加'] },
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
    title: 'DMapper Help',
    version: 'Version 1.7.4',
    sections: {
      about: {
        title: 'About DMapper',
        content: 'DMapper is a web-based grid mapping tool for 3D dungeon games. It operates entirely client-side without requiring a server and stores data in the browser\'s local storage. Each dungeon consists of multiple floors (B1F to B30F), allowing you to create independent maps for each floor. Each dungeon can have individual grid size settings, and you can manage multiple dungeons simultaneously.'
      },
      controls: {
        title: 'Basic Controls',
        items: [
          { label: 'Zoom in/out:', desc: 'Mouse wheel / Pinch gestures' },
          { label: 'Pan (move view):', desc: 'Shift + drag / Swipe' },
          { label: 'Place items, fill colors, draw walls:', desc: 'Left click / Tap' },
          { label: 'Remove items, clear colors, erase walls:', desc: 'Right click / Eraser tool' },
          { label: 'Edit notes:', desc: 'Click existing note (works with any tool)' },
          { label: 'Move notes:', desc: 'Drag existing note to another cell (PC mouse only / works with any tool)' }
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
      lineTools: {
        title: 'Line Tools (Cell Boundaries)',
        items: [
          { name: 'Wall (Line):', desc: 'Draw walls on cell boundaries. Click & drag for continuous drawing.' },
          { name: 'Doors:', desc: 'Place open doors (□) or closed doors (■) on existing walls.' },
          { name: 'Arrows:', desc: 'Place one-way arrows on walls.' }
        ]
      },
      gridTools: {
        title: 'Grid Tools (Cell Contents)',
        items: [
          { name: 'Color Fill (Fill):', desc: 'Fill cells with colors. Use the options in the bottom right. Can be used to mark explored areas, dark zones, magic-restricted areas, etc.' },
          { name: 'Dark Zone:', desc: 'Fill cells with gray color.' },
          { name: 'Stairs:', desc: 'Place up stairs (▲) and down stairs (▼). Use the options in the bottom right to set up to 2 character identifiers.' },
          { name: 'Chest:', desc: 'Mark treasure locations.' },
          { name: 'Teleport Point:', desc: 'Use the options in the bottom right to set up to 2 character identifiers. Manage multiple teleport destinations.' },
          { name: 'Shute & Pit:', desc: 'Mark fall points. Use the options in the bottom right to select Shute (●) or Pit (○).' },
          { name: 'Event Marker:', desc: 'Mark special event locations.' },
          { name: 'Current Position:', desc: 'Mark player\'s current location (only one per floor).' },
          { name: 'Arrows:', desc: 'Place one-way or forced movement arrows. Use the options in the bottom right to select direction.' },
          { name: 'Door Item:', desc: 'Place door items. Use the options in the bottom right to select open or closed door state. Default is closed door.' },
          { name: 'Notes:', desc: 'Add memos. Can be placed on any cell with all existing items, displayed as red triangles in the top-left corner. Notes can be edited by clicking or moved by dragging with any tool selected. Delete via right-click with Note tool selected, or delete button in the dialog.' },
          { name: 'Eraser Tool:', desc: 'Delete objects with left click.' }
        ]
      },
      dungeonOptions: {
        title: 'Dungeon Option Features',
        items: [
          { label: 'Dungeon Selection:', desc: 'Select target dungeon for editing' },
          { label: 'Dungeon Rename:', desc: 'Set custom names for dungeons' },
          { label: 'Grid Size Adjustment:', desc: 'Set width and height individually (1x1 to 50x50)' },
          { label: 'Dungeon Reset:', desc: 'Completely initialize current dungeon' },
          { label: 'Save Dungeon:', desc: 'Download selected dungeon as JSON file' },
          { label: 'Load Dungeon:', desc: 'Import dungeon data from JSON file' }
        ]
      },
      floorOptions: {
        title: 'Floor Option Features',
        items: [
          { label: 'Floor Selection:', desc: 'Select target floor for editing (floors with data are marked with * prefix)' },
          { label: 'Floor Rename:', desc: 'Set custom names for floors' },
          { label: 'Floor Copy:', desc: 'Copy current floor to other dungeons/floors (automatic coordinate transformation for GridSize differences)' },
          { label: 'SVG Image Download:', desc: 'Export current floor as SVG format' },
          { label: 'Floor Reset:', desc: 'Delete all data on current floor' }
        ]
      },
      globalOptions: {
        title: 'Global Option Features',
        items: [
          { label: 'Theme Change:', desc: 'Switch between Default, Dungeon, Hell, Yggdrasill, and Monochrome themes' },
          { label: 'Export All Data:', desc: 'Download all dungeon data as JSON file' },
          { label: 'Import All Data:', desc: 'Restore all data from JSON file' },
          { label: 'Reset All Dungeons:', desc: 'Initialize all dungeon data' }
        ]
      },
      otherFeatures: {
        title: 'Other Features',
        items: [
          { label: 'Note Display Toggle:', desc: 'Toggle note tooltip display on/off with Note button' },
          { label: 'Auto-save:', desc: 'All changes are automatically saved to browser local storage' }
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
          'Regular backups using the Export function are recommended for important dungeon maps'
        ]
      },
      changelog: {
        title: 'Update History',
        items: [
          { version: 'v1.7.4', date: '2025-07-08', changes: ['Layout and theme adjustments'] },
          { version: 'v1.7.3', date: '2025-07-03', changes: ['Added Monochrome theme: New grayscale high-contrast theme for print and accessibility'] },
          { version: 'v1.7.2', date: '2025-07-02', changes: ['Added Hell theme: New dark red theme'] },
          { version: 'v1.7.1', date: '2025-07-01', changes: ['Fixed Line data coordinate offset issue when importing old version data'] },
          { version: 'v1.7.0', date: '2025-06-30', changes: ['UI reorganization', 'Dungeon Option popup: Consolidates dungeon selection, rename, grid size, save/load, and reset', 'Floor Option popup: Consolidates floor selection, rename, SVG export, and reset', 'Added floor naming functionality: Custom names or default B1F display', 'Added Floor Copy functionality: Copy map data from Floor Option to other dungeons/floors'] },
          { version: 'v1.6.4', date: '2025-06-26', changes: ['Improved grid size settings: Support for rectangular grids with independent width and height configuration'] },
          { version: 'v1.6.3', date: '2025-06-26', changes: ['Improved mobile touch controls: Touch same element with same tool to delete (PC maintains original behavior)', 'Implemented priority-based deletion system: Notes > Items > Grid colors', 'Fixed swipe gesture errors'] },
          { version: 'v1.6.2', date: '2025-06-26', changes: ['Added Door Item tool: Placeable door items on cells with open/closed state selection'] },
          { version: 'v1.6.1', date: '2025-06-25', changes: ['Added Yggdrasill theme: New theme inspired by trees and water'] },
          { version: 'v1.6.0', date: '2025-06-24', changes: ['Added note drag-and-drop functionality: Notes can be dragged to move between cells with any tool selected (PC mouse only)'] },
          { version: 'v1.5.2', date: '2025-06-24', changes: ['Note tool overhaul: Can now be placed on any cell even with existing items', 'Changed note display to red triangles in top-left corners'] },
          { version: 'v1.5.1', date: '2025-06-24', changes: ['Moved Grid Size controls from header to menu', 'Unified mobile and desktop menus', 'Added Reset All Dungeons feature', 'Fixed Line elements positioning issues during grid resize', 'Added apply button and confirmation dialog for Grid Size changes'] },
          { version: 'v1.5.0', date: '2025-06-24', changes: ['Theme system implementation: Added Default and Dungeon themes'] },
          { version: 'v1.4.2', date: '2025-06-23', changes: ['Line tools mutual overwriting', 'Direct Line tool placement without existing walls', 'Added numbering feature to Stairs tools'] },
          { version: 'v1.4.1', date: '2025-06-23', changes: ['Unified Grid Arrow tools with right-panel selection. Added rotating floor marker'] },
          { version: 'v1.4.0', date: '2025-06-23', changes: ['Mobile support: Swipe panning functionality'] },
          { version: 'v1.3.8', date: '2025-06-23', changes: ['Fixed note editing while line tools are selected', 'Fixed keyboard shortcut interference during text input'] },
          { version: 'v1.3.7', date: '2025-06-23', changes: ['Added 2-character identifier feature for teleport points', 'Added click-to-reset zoom to 100%', 'Shute tool can now place Pit markers (selectable via dropdown)'] },
          { version: 'v1.3.6', date: '2025-06-23', changes: ['Adjusted line width and grid colors', 'Fixed critical array access bugs'] },
          { version: 'v1.3.5', date: '2025-06-23', changes: ['Added per-dungeon save/load functionality', 'Multi-language support implementation'] },
          { version: 'v1.3.4', date: '2025-06-23', changes: ['Reorganized header UI for cleaner layout', 'Optimized export data file size', 'Renamed [Map]-[Floor] structure to [Dungeon]-[Floor]', 'Support up to 30 floors per dungeon (max 10 dungeons)'] },
          { version: 'v1.3.3', date: '2025-06-22', changes: ['Add hamburger menu for mobile with hidden desktop features'] },
          { version: 'v1.3.2', date: '2025-06-22', changes: ['Enable note editing with any tool'] },
          { version: 'v1.3.1', date: '2025-06-22', changes: ['Improved mobile touch controls', 'Single finger for tool operations, two fingers for map movement/zoom', 'Unified help documentation to function: operation format'] },
          { version: 'v1.3.0', date: '2025-06-22', changes: ['Mobile support'] },
          { version: 'v1.2.0', date: '2025-06-22', changes: ['Added always-visible note tooltips', 'Note button to toggle tooltip display on/off', 'Changed DoorOpen color to white'] },
          { version: 'v1.1.1', date: '2025-06-22', changes: ['Improved SVG export visual quality', 'Unified chest design with main canvas', 'Unified Grid Arrows to simple text arrows', 'Fixed Line Arrow positioning and design'] },
          { version: 'v1.1.0', date: '2025-06-22', changes: ['Added SVG export functionality', 'Added Eraser tool - mobile-friendly', 'Added timestamps to file names'] },
          { version: 'v1.0.0', date: '2025-06-21', changes: ['Initial release', 'Basic mapping functionality', 'Multi-floor and multi-map support', 'JSON export/import functionality'] }
        ]
      }
    }
  }
}

// HTMLテンプレートを生成
function generateHtmlTemplate(lang, contentData, pageType = 'help') {
  const isHelp = pageType === 'help'
  const title = isHelp 
    ? `${contentData.title} | DMapper`
    : (lang === 'en' ? 'Update History | DMapper' : '更新履歴 | DMapper')
  
  const description = isHelp
    ? (lang === 'en' 
      ? 'Comprehensive guide for DMapper 3D dungeon mapping tool. Basic controls, keyboard shortcuts, tool explanations and more.'
      : '3Dダンジョンマッピングツール DMapper の詳細な使い方と操作方法。基本操作、キーボードショートカット、ツールの説明など。')
    : (lang === 'en' 
      ? 'Complete update history of DMapper. Detailed records of new features, improvements, and bug fixes for all versions.'
      : 'DMapper の全バージョンの更新履歴。新機能、改善点、バグ修正の詳細な記録。')
  
  const keywords = isHelp
    ? (lang === 'en' 
      ? 'DMapper,help,tutorial,guide,dungeon mapping,3D dungeon,wizardry-like,grid mapping,RPG,game mapping'
      : 'DMapper,使い方,操作方法,ヘルプ,チュートリアル,3Dダンジョン,マッピングツール,ウィザードリィライク,dungeon mapping,tutorial,help')
    : (lang === 'en' 
      ? 'DMapper,changelog,update history,version history,release notes,3D dungeon,wizardry-like'
      : 'DMapper,更新履歴,changelog,バージョン履歴,リリースノート,3Dダンジョン,マッピングツール,ウィザードリィライク')
  
  const canonicalUrl = isHelp 
    ? (lang === 'en' ? '/help/en/' : '/help/') 
    : (lang === 'en' ? '/help/en/changelog/' : '/help/changelog/')
  
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://deadrah.github.io/dungeon-mapper${canonicalUrl}">
    <meta property="og:site_name" content="DMapper">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    
    <link rel="canonical" href="https://deadrah.github.io/dungeon-mapper${canonicalUrl}">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fafafa;
            font-size: 14px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 0;
            box-shadow: none;
            border: 1px solid #e0e0e0;
        }
        h1 { 
            color: #2c2c2c; 
            border-bottom: 2px solid #666; 
            padding-bottom: 10px; 
            font-weight: 600;
            margin-bottom: 25px;
            font-size: 24px;
        }
        h2 { 
            color: #404040; 
            margin-top: 30px; 
            margin-bottom: 12px;
            font-weight: 500;
            font-size: 18px;
        }
        h3 { color: #555; font-size: 16px; }
        .nav { 
            margin-bottom: 30px; 
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        .nav a { 
            display: inline-block; 
            margin-right: 20px; 
            padding: 8px 16px; 
            background: #666; 
            color: white; 
            text-decoration: none; 
            border-radius: 0;
            font-size: 13px;
            transition: background-color 0.2s;
        }
        .nav a:hover { background: #444; }
        .changelog-item {
            border-left: 3px solid #666;
            padding-left: 20px;
            margin-bottom: 25px;
            padding-top: 5px;
            padding-bottom: 5px;
        }
        .version { 
            font-weight: 600; 
            color: #2c2c2c; 
            font-size: 15px;
        }
        .date { 
            color: #888; 
            font-size: 12px; 
            margin-bottom: 6px;
        }
        ul { 
            padding-left: 20px; 
            margin-top: 8px;
        }
        li { 
            margin-bottom: 4px; 
            color: #444;
            font-size: 14px;
        }
        .controls-grid {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 12px;
            margin: 15px 0;
            border: 1px solid #e0e0e0;
            padding: 20px;
            background: #f9f9f9;
        }
        .control-label { 
            font-weight: 500; 
            color: #2c2c2c;
            font-size: 14px;
        }
        p {
            margin-bottom: 10px;
            color: #444;
            font-size: 14px;
        }
        strong {
            color: #2c2c2c;
        }
        @media (max-width: 600px) {
            .controls-grid { 
                grid-template-columns: 1fr; 
                gap: 8px; 
                padding: 15px;
            }
            .control-label { margin-top: 15px; }
            .container { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <nav class="nav">
            <a href="../">${lang === 'en' ? 'Back to DMapper App' : 'DMapper アプリに戻る'}</a>
            ${isHelp 
              ? (lang === 'en' 
                ? '<a href="./changelog/">Changelog</a>' 
                : '<a href="./changelog/">更新履歴</a>')
              : (lang === 'en' 
                ? '<a href="../">Help</a>' 
                : '<a href="../">ヘルプ</a>')
            }
            ${lang === 'en'
              ? (isHelp 
                ? '<a href="../">日本語</a>'
                : '<a href="../../changelog/">日本語</a>')
              : (isHelp 
                ? '<a href="./en/">English</a>'
                : '<a href="./en/changelog/">English</a>')
            }
        </nav>
        
        <main>
            ${generateContent(contentData, pageType, lang)}
        </main>
        
        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p><a href="../">DMapper</a> - 3D Dungeon Mapping Tool</p>
        </footer>
    </div>
</body>
</html>`
}

// コンテンツ部分を生成
function generateContent(contentData, pageType, lang) {
  if (pageType === 'changelog') {
    return generateChangelogContent(contentData)
  }
  return generateHelpContent(contentData)
}

// ヘルプコンテンツを生成
function generateHelpContent(contentData) {
  let html = `<h1>${contentData.title}</h1>`
  html += `<p><strong>${contentData.version}</strong></p>`
  
  if (contentData.sections) {
    Object.entries(contentData.sections).forEach(([key, section]) => {
      if (key === 'changelog') return // changelogは別ページ
      
      html += `<section>`
      html += `<h2>${section.title}</h2>`
      
      if (section.content) {
        const paragraphs = section.content.split('。')
        paragraphs.forEach(paragraph => {
          if (paragraph.trim()) {
            html += `<p>${paragraph.trim()}。</p>`
          }
        })
      }
      
      if (section.items) {
        if (key === 'controls' || key === 'keyboard') {
          html += '<div class="controls-grid">'
          section.items.forEach(item => {
            if (typeof item === 'object' && item.label && item.desc) {
              html += `<div class="control-label">${item.label}</div>`
              html += `<div>${item.desc}</div>`
            }
          })
          html += '</div>'
        } else {
          html += '<ul>'
          section.items.forEach(item => {
            if (typeof item === 'string') {
              html += `<li>${item}</li>`
            } else if (typeof item === 'object') {
              if (item.name && item.desc) {
                html += `<li><strong>${item.name}</strong> ${item.desc}</li>`
              } else if (item.label && item.desc) {
                html += `<li><strong>${item.label}</strong> ${item.desc}</li>`
              }
            }
          })
          html += '</ul>'
        }
      }
      
      html += `</section>`
    })
  }
  
  return html
}

// 更新履歴コンテンツを生成
function generateChangelogContent(contentData) {
  let html = `<h1>${contentData.sections.changelog.title}</h1>`
  
  if (contentData.sections && contentData.sections.changelog && contentData.sections.changelog.items) {
    contentData.sections.changelog.items.forEach(item => {
      if (item.version && item.date && item.changes) {
        html += '<div class="changelog-item">'
        html += `<div class="version">${item.version}</div>`
        html += `<div class="date">${item.date}</div>`
        html += '<ul>'
        item.changes.forEach(change => {
          html += `<li>${change}</li>`
        })
        html += '</ul>'
        html += '</div>'
      }
    })
  }
  
  return html
}

// メイン実行関数
function main() {
  try {
    console.log('Generating help HTML pages...')
    
    // publicディレクトリ構造を作成
    const publicDir = path.join(__dirname, '../public')
    const helpDir = path.join(publicDir, 'help')
    const changelogDir = path.join(helpDir, 'changelog')
    const enDir = path.join(helpDir, 'en')
    const enChangelogDir = path.join(enDir, 'changelog')
    
    if (!fs.existsSync(helpDir)) {
      fs.mkdirSync(helpDir, { recursive: true })
    }
    if (!fs.existsSync(changelogDir)) {
      fs.mkdirSync(changelogDir, { recursive: true })
    }
    if (!fs.existsSync(enDir)) {
      fs.mkdirSync(enDir, { recursive: true })
    }
    if (!fs.existsSync(enChangelogDir)) {
      fs.mkdirSync(enChangelogDir, { recursive: true })
    }
    
    // 日本語版ヘルプページ生成
    console.log('Generating Japanese help page...')
    const jaHelpHtml = generateHtmlTemplate('ja', content.ja, 'help')
    fs.writeFileSync(path.join(helpDir, 'index.html'), jaHelpHtml)
    
    // 日本語版更新履歴ページ生成
    console.log('Generating Japanese changelog page...')
    const jaChangelogHtml = generateHtmlTemplate('ja', content.ja, 'changelog')
    fs.writeFileSync(path.join(changelogDir, 'index.html'), jaChangelogHtml)
    
    // 英語版ヘルプページ生成
    console.log('Generating English help page...')
    const enHelpHtml = generateHtmlTemplate('en', content.en, 'help')
    fs.writeFileSync(path.join(enDir, 'index.html'), enHelpHtml)
    
    // 英語版更新履歴ページ生成
    console.log('Generating English changelog page...')
    const enChangelogHtml = generateHtmlTemplate('en', content.en, 'changelog')
    fs.writeFileSync(path.join(enChangelogDir, 'index.html'), enChangelogHtml)
    
    console.log('✅ Help HTML pages generated successfully!')
    console.log(`- ${helpDir}/index.html (Japanese)`)
    console.log(`- ${changelogDir}/index.html (Japanese)`)
    console.log(`- ${enDir}/index.html (English)`)
    console.log(`- ${enChangelogDir}/index.html (English)`)
    
  } catch (error) {
    console.error('❌ Error generating help HTML pages:', error.message)
    process.exit(1)
  }
}

// スクリプトが直接実行された場合のみmainを呼び出し
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main }