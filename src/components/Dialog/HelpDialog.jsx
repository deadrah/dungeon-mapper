import React from 'react'

const HelpDialog = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black">DMapper - 機能説明</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            title="閉じる"
          >
            ×
          </button>
        </div>
        
        <div className="text-black space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">DMapperについて</h3>
            <p className="text-gray-700">
              DMapperは3Dダンジョンゲーム用のWebベースグリッドマッピングツールです。
              サーバー不要のクライアントサイドのみで動作し、ブラウザのローカルストレージにデータを保存します。
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">基本操作</h3>
            <div className="space-y-2">
              <div><strong>マウスホイール:</strong> ズームイン/アウト</div>
              <div><strong>Shift + ドラッグ:</strong> パン（画面移動）</div>
              <div><strong>左クリック:</strong> アイテム配置・色塗り・壁描画</div>
              <div><strong>右クリック:</strong> アイテム削除・色消去・壁削除</div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">ツール説明</h3>
            <div className="space-y-3">
              <div>
                <strong className="text-purple-600">壁描画（Line）:</strong>
                <p className="text-gray-700 ml-4">グリッドの境界線に壁を描画します。クリック&ドラッグで連続描画が可能です。</p>
              </div>
              <div>
                <strong className="text-green-600">ブロック色塗り:</strong>
                <p className="text-gray-700 ml-4">グリッドのセルに色を塗ります。右下のカラーピッカーで色を選択できます。</p>
              </div>
              <div>
                <strong className="text-gray-600">ダークゾーン:</strong>
                <p className="text-gray-700 ml-4">暗いエリアをグレーで表示します。</p>
              </div>
              <div>
                <strong className="text-blue-600">階段:</strong>
                <p className="text-gray-700 ml-4">上り階段（▲）と下り階段（▼）を配置します。</p>
              </div>
              <div>
                <strong className="text-yellow-600">宝箱・ワープ・イベント:</strong>
                <p className="text-gray-700 ml-4">宝箱、ワープポイント、イベントマーカーを配置します。</p>
              </div>
              <div>
                <strong className="text-red-600">現在位置:</strong>
                <p className="text-gray-700 ml-4">プレイヤーの現在位置を示します（1フロアにつき1つのみ）。</p>
              </div>
              <div>
                <strong className="text-orange-600">ドア:</strong>
                <p className="text-gray-700 ml-4">既存の壁に開いたドア（□）または閉じたドア（■）を配置します。</p>
              </div>
              <div>
                <strong className="text-indigo-600">矢印:</strong>
                <p className="text-gray-700 ml-4">グリッドセルまたは壁に方向矢印を配置します。</p>
              </div>
              <div>
                <strong className="text-pink-600">ノート:</strong>
                <p className="text-gray-700 ml-4">セルにメモを追加します。クリックでテキストダイアログが開きます。</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">マップ管理</h3>
            <div className="space-y-2">
              <div><strong>Map選択:</strong> 複数のマップを管理できます（最大10個）</div>
              <div><strong>Rename:</strong> マップに名前を付けることができます</div>
              <div><strong>Floor選択:</strong> 各マップにつき30階層まで対応</div>
              <div><strong>Reset:</strong> 現在のフロアのデータを全削除</div>
              <div><strong>Grid Size:</strong> グリッドサイズを5x5から50x50まで調整可能</div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">データ保存</h3>
            <div className="space-y-2">
              <div><strong>自動保存:</strong> 操作は自動的にブラウザのローカルストレージに保存されます</div>
              <div><strong>Export:</strong> JSONファイルとしてマップデータをダウンロード</div>
              <div><strong>Import:</strong> JSONファイルからマップデータを読み込み</div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">注意事項</h3>
            <div className="space-y-2 text-gray-700">
              <div>• データはブラウザのローカルストレージに保存されるため、ブラウザデータを削除すると消失します</div>
              <div>• 重要なマップは定期的にExport機能でバックアップを取ることを推奨します</div>
              <div>• ドアや壁の矢印は、既存の壁にのみ配置できます</div>
              <div>• セルの矢印は壁とは独立してセルの中央に配置されます</div>
            </div>
          </section>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}

export default HelpDialog