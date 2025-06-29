// Multi-language message system
export const MESSAGES = {
  ja: {
    // General
    yes: 'はい',
    no: 'いいえ',
    ok: 'OK',
    cancel: 'キャンセル',
    
    // Floor operations
    resetFloor: '{floor}Fのすべてのデータを削除しますか？この操作は元に戻せません。',
    resetAllDungeons: 'すべてのダンジョンデータを初期化しますか？この操作は元に戻せません。',
    changeGridSize: 'グリッドサイズを{oldRows}x{oldCols}から{newRows}x{newCols}に変更しますか？\n\n範囲外の壁・ドア・アイテムが削除される可能性があります。この操作は元に戻せません。',
    
    // Dungeon operations
    loadDungeon: '"{name}" をスロット {slot} に読み込みますか？',
    loadDungeonOverwrite: '"{name}" をスロット {slot} に読み込みますか？（現在の "{currentName}" が上書きされます）',
    loadDungeonAutoSlot: '"{name}" を次の空きスロットに読み込みますか？',
    dungeonLoadSuccess: 'ダンジョンをスロット {slot} に正常に読み込みました',
    dungeonExportFailed: 'ダンジョンのエクスポートに失敗しました',
    dungeonImportFailed: 'ダンジョンのインポートに失敗しました',
    dungeonNotExists: '選択されたダンジョンが存在しません',
    invalidDungeonFile: '無効なダンジョンファイル形式です。DMapperからエクスポートされたダンジョンファイルを選択してください。',
    noAvailableSlots: '利用可能なダンジョンスロットがありません。先にダンジョンをクリアしてください。',
    
    // All data operations
    importAllData: '全データをインポートしますか？現在のすべてのダンジョンと設定が置き換えられます。',
    restoreImportedGridSize: 'インポートされたグリッドサイズ（{newRows}x{newCols}）に復元しますか？\n\n「はい」：グリッドサイズを復元（座標変換なし）\n「いいえ」：現在のサイズ（{oldRows}x{oldCols}）を維持（座標変換あり）',
    importCompleted: 'インポートが正常に完了しました',
    exportFailed: 'エクスポートに失敗しました',
    importFailed: 'インポートに失敗しました',
    svgExportFailed: 'SVGエクスポートに失敗しました',
    unsupportedFileFormat: 'サポートされていないファイル形式です。DMapperからエクスポートされたJSONファイルを選択してください。',
    invalidJsonFile: 'ファイルの読み取りに失敗しました。有効なJSONファイルを選択してください。'
  },
  
  en: {
    // General
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    cancel: 'Cancel',
    
    // Floor operations
    resetFloor: 'Delete all data on {floor}F? This action cannot be undone.',
    resetAllDungeons: 'Reset all dungeon data? This action cannot be undone.',
    changeGridSize: 'Change grid size from {oldRows}x{oldCols} to {newRows}x{newCols}?\n\nWalls, doors, and items outside the new bounds may be deleted. This action cannot be undone.',
    
    // Dungeon operations
    loadDungeon: 'Load "{name}" to slot {slot}?',
    loadDungeonOverwrite: 'Load "{name}" to slot {slot}? (Current "{currentName}" will be overwritten)',
    loadDungeonAutoSlot: 'Load "{name}" to next available slot?',
    dungeonLoadSuccess: 'Dungeon imported successfully to slot {slot}',
    dungeonExportFailed: 'Dungeon export failed',
    dungeonImportFailed: 'Dungeon import failed',
    dungeonNotExists: 'Selected dungeon does not exist',
    invalidDungeonFile: 'Invalid dungeon file format. Please select a dungeon file exported from DMapper.',
    noAvailableSlots: 'No available dungeon slots. Please clear a dungeon first.',
    
    // All data operations
    importAllData: 'Import all data? This will replace all current dungeons and settings.',
    restoreImportedGridSize: 'Restore imported grid size ({newRows}x{newCols})?\n\n"Yes": Restore grid size (no coordinate transformation)\n"No": Keep current size ({oldRows}x{oldCols}) (with coordinate transformation)',
    importCompleted: 'Import completed successfully',
    exportFailed: 'Export failed',
    importFailed: 'Import failed',
    svgExportFailed: 'SVG export failed',
    unsupportedFileFormat: 'Unsupported file format. Please select a JSON file exported from DMapper.',
    invalidJsonFile: 'Failed to read file. Please select a valid JSON file.'
  }
}

// Message formatting utility
export const formatMessage = (template, params = {}) => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? params[key] : match
  })
}

// Get message by key and language
export const getMessage = (language, key, params = {}) => {
  const messages = MESSAGES[language] || MESSAGES['ja']
  const template = messages[key] || key
  return formatMessage(template, params)
}