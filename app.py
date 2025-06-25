# 必要なライブラリをインポートします
# Flask: Webフレームワーク本体
# jsonify: Pythonの辞書をJSON形式のデータに変換する
# sqlite3: SQLiteデータベースを操作する
import sqlite3
from flask import Flask, jsonify

# Flaskアプリケーションのインスタンスを作成します
app = Flask(__name__)

# --- ここからAPIの定義 ---

# 1. ルートURL ("/")
# サーバーが正しく起動しているかを確認するための、簡単なテスト用ページです。
@app.route('/')
def index():
    return "<h1>家具配置シミュレーションAPI</h1><p>サーバーは正常に動作しています。</p>"

# 2. レイアウト詳細を取得するAPI
# "/api/layouts/1" のようなURLにアクセスされたときに、この関数が実行されます。
@app.route('/api/layouts/<int:layout_id>')
def get_layout_details(layout_id):
    """
    指定されたIDのレイアウト情報をデータベースから取得し、JSON形式で返す。
    """
    conn = None  # 接続オブジェクトを初期化
    try:
        # データベースに接続します
        conn = sqlite3.connect('placement.db')
        # 結果を辞書形式で扱えるように設定します
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # 以前作成したビュー(Placement_Master_View)を使ってデータを取得します。
        # ビューのおかげで、ここでのSQL文が非常にシンプルになります。
        query = "SELECT * FROM Placement_Master_View WHERE placement_id = ?"
        
        # SQL文を実行します。?の部分には安全にlayout_idが入ります。
        cursor.execute(query, (layout_id,))
        
        # 実行結果をすべて取得します
        layout_items = cursor.fetchall()
        
        # 取得した結果(Rowオブジェクト)を、JSONに変換しやすい辞書のリストに変換します
        results = [dict(row) for row in layout_items]
        
        # 辞書のリストをJSON形式でクライアント(ブラウザ)に返します
        return jsonify(results)

    except Exception as e:
        # エラーが発生した場合は、エラーメッセージをJSONで返します
        print(f"エラーが発生しました: {e}")
        return jsonify({"error": str(e)}), 500
    
    finally:
        # 成功してもエラーが出ても、必ずデータベース接続を閉じます
        if conn:
            conn.close()

# --- サーバーを起動するための記述 ---

# このファイルが直接実行された場合にのみ、サーバーを起動します
if __name__ == '__main__':
    # debug=True にすると、コードを保存したときに自動でサーバーが再起動されるので便利です
    app.run(debug=True)
