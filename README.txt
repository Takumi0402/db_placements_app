【備忘録】
環境をcondaで作成した。
conda create --name furniture_env python=3.12.7　# ← どのフォルダで作っても anaconda3/envs/ に保存される

アクティベートする際は↓
conda activate furniture_env
（多分一度だけでよい）

VScodeから仮想環境に入るときは
1. ctrl + shift + P
2. 検索：Python: Select Interpreter
3. 選択（出てくるまでちょっと時間かかる）

【使用言語・API】
python：APIの役割。サーバ上で実行される。
javascript：ユーザのwebブラウザで実行される。HTML操作とユーザとの対話が役割。



【開発の流れ】
バックエンドAPIの構築
対象ファイル：app.py
内容：/api/layouts/1 にアクセスしたらplacement_idが1のレイアウト情報をJSON形式で返す、というAPI（Flaskのルート）を作る。
助言：sqlite3モジュールを駆使してSELECT文でデータを取得する

バックエンドとフロントエンドをつなげる
対象ファイル：app.py + フロントエンドファイル
内容：app.pyから受け取ったデータをフロントエンドで処理して整形して表示する

