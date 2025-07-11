// HelpDialog.jsxのコンテンツデータを共通化
export const helpContent = {
  ja: {
    title: 'DMapper ヘルプ',
    version: 'バージョン 1.7.6',
    close: '閉じる',
    tabs: {
      guide: '機能説明',
      changelog: '更新履歴'
    },
    sections: {
      about: {
        title: 'DMapperについて',
        content: 'DMapperは3Dダンジョンゲーム用のWebベースグリッドマッピングツールです。\nサーバー不要のクライアントサイドのみで動作し、ブラウザのローカルストレージにデータを保存します。\n1つのダンジョンは複数のフロア（B1F〜B100F可変）で構成されており、各フロアで独立したマップを作成できます。\nダンジョンごとに個別のグリッドサイズ設定が可能で、複数のダンジョンを並行して管理できます。\nウィザードリィライクゲームのマッピング等に最適です。'
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
          { name: 'イベントマーカー:', desc: 'イベント発生地点をマークします。右下のオプションでイベントタイプを選択できます：デフォルト、戦闘、回復の泉、ゴミ箱。' },
          { name: '現在位置:', desc: 'プレイヤーの現在位置をマークします（フロアごとに1つまで）。' },
          { name: '矢印:', desc: '一方通行や強制移動の矢印を配置します。右下のオプションで方向を選択できます。' },
          { name: 'ドアアイテム:', desc: 'ドアアイテムを配置します。右下のオプションで開いた状態または閉じた状態を選択できます。デフォルトは閉じたドアです。' },
          { name: 'メモ:', desc: 'メモを追加します。既存のアイテムがあるセルにも配置可能で、左上角の赤い三角で表示されます。メモはどのツールでもクリックで編集、ドラッグで移動できます。Noteツール選択時の右クリックまたはダイアログ内の削除ボタンで削除できます。' },
          { name: '消去ツール:', desc: '左クリックでオブジェクトを削除します。' }
        ]
      },
      clickCycling: {
        title: '複数のオプションアイテムを持つツール',
        content: 'シュート、イベントマーカー、矢印、ドアアイテムは、同箇所をクリック/タップする事で順次切り替わり配置されます。'
      },
      dungeonOptions: {
        title: 'ダンジョンオプション',
        items: [
          { label: 'ダンジョン選択:', desc: '編集対象のダンジョンを選択' },
          { label: 'ダンジョン名変更:', desc: 'ダンジョンにカスタム名を設定' },
          { label: 'グリッドサイズ調整:', desc: '幅と高さを個別に設定（1x1〜50x50）' },
          { label: 'フロア数設定:', desc: '各ダンジョンのフロア数を1-100の範囲で設定（デフォルト20）' },
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
          { version: 'v1.7.6', date: '2025-07-10', changes: ['イベントマーカーにオプション機能を追加：右下のオプションパネルでイベントタイプを選択可能（デフォルト！、戦闘、回復の泉）','複数のオプションアイテムを持つツールでクリックにより順次選択を可能に'] },
          { version: 'v1.7.5', date: '2025-07-09', changes: ['フロア数可変機能を追加：各ダンジョンのフロア数を1-100の範囲で設定可能（デフォルト20）'] },
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
    version: 'Version 1.7.6',
    close: 'Close',
    tabs: {
      guide: 'User Guide',
      changelog: 'Update History'
    },
    sections: {
      about: {
        title: 'About DMapper',
        content: 'DMapper is a web-based grid mapping tool for 3D dungeon games.\nIt operates entirely client-side without requiring a server and stores data in the browser\'s local storage.\nEach dungeon consists of multiple floors (B1F to B100F), allowing you to create independent maps for each floor.\nEach dungeon can have individual grid size settings, and you can manage multiple dungeons simultaneously.\nPerfect for mapping Wizardry-like games and similar dungeon crawlers.'
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
          { name: 'Event Marker:', desc: 'Mark event locations. Use the options in the bottom right to select event type: Default, Combat, Healing Fountain, Trash.' },
          { name: 'Current Position:', desc: 'Mark player\'s current location (only one per floor).' },
          { name: 'Arrows:', desc: 'Place one-way or forced movement arrows. Use the options in the bottom right to select direction.' },
          { name: 'Door Item:', desc: 'Place door items. Use the options in the bottom right to select open or closed door state. Default is closed door.' },
          { name: 'Notes:', desc: 'Add memos. Can be placed on any cell with all existing items, displayed as red triangles in the top-left corner. Notes can be edited by clicking or moved by dragging with any tool selected. Delete via right-click with Note tool selected, or delete button in the dialog.' },
          { name: 'Eraser Tool:', desc: 'Delete objects with left click.' }
        ]
      },
      clickCycling: {
        title: 'Tools with Multiple Options',
        content: 'Shute, Event Marker, Arrows, and Door Item tools can be sequentially switched by clicking/tapping the same location.'
      },
      dungeonOptions: {
        title: 'Dungeon Option Features',
        items: [
          { label: 'Dungeon Selection:', desc: 'Select target dungeon for editing' },
          { label: 'Dungeon Rename:', desc: 'Set custom names for dungeons' },
          { label: 'Grid Size Adjustment:', desc: 'Set width and height individually (1x1 to 50x50)' },
          { label: 'Floor Count Setting:', desc: 'Set the number of floors for each dungeon (1-100 range, default 20)' },
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
      { version: 'v1.7.6', date: '2025-07-10', changes: ['Added Event Marker options: Select event type in bottom-right options panel (Default !, Combat, Healing Fountain)', 'Enabled sequential selection through clicking for tools with multiple option items'] },
      { version: 'v1.7.5', date: '2025-07-09', changes: ['Added variable floor count feature: Set the number of floors for each dungeon (1-100 range, default 20)'] },
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