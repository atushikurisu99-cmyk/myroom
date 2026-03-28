使い方
1. index.html を開く
2. app フォルダは同じ階層のまま置く

今回の分割
- app/TaxiMiniApp.js                親だけ
- app/hooks/useTaxiAppState.js      state と処理
- app/screens/TopScreen.js          TOP画面
- app/screens/StandbyScreen.js      乗車待機画面
- app/screens/RideScreen.js         実車中画面
- app/screens/FareScreen.js         金額入力画面
- app/screens/HistoryModal.js       履歴一覧と履歴編集
- app/constants.js                  色・サイズ
- app/utils.js                      日付/金額/共通関数
- app/geo.js                        位置取得
- app/components.js                 小さなUI部品

調整の目安
- ボタン色・高さ・余白         -> app/constants.js
- 乗車待機の見た目             -> app/screens/StandbyScreen.js
- 乗車中の見た目               -> app/screens/RideScreen.js
- 金額入力の見た目             -> app/screens/FareScreen.js
- 履歴一覧/履歴編集            -> app/screens/HistoryModal.js
- 保存や画面遷移の流れ         -> app/hooks/useTaxiAppState.js
