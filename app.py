# render_template を追加でインポートします
from flask import Flask, jsonify, render_template
import sqlite3

# Flaskアプリケーションのインスタンスを作成します
app = Flask(__name__)

# --- ここからAPIの定義 ---

# 1. ルートURL ("/") を更新
# トップページにアクセスされたら、templatesフォルダのindex.htmlを返すように変更します。
@app.route('/')
def index():
    return render_template('index.html')

# 2. レイアウト詳細を取得するAPI (前回作成したもの)
@app.route('/api/layouts/<int:layout_id>')
def get_layout_details(layout_id):
    """
    指定されたIDのレイアウト情報をデータベースから取得し、JSON形式で返す。
    """
    conn = None
    try:
        # 【重要】データベース名を 'placement.db' に変更します
        conn = sqlite3.connect('placement.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        query = "SELECT * FROM Placement_Master_View WHERE placement_id = ?"
        cursor.execute(query, (layout_id,))
        layout_items = cursor.fetchall()
        
        results = [dict(row) for row in layout_items]
        
        return jsonify(results)

    except Exception as e:
        print(f"エラーが発生しました: {e}")
        return jsonify({"error": str(e)}), 500
    
    finally:
        if conn:
            conn.close()

# --- サーバーを起動するための記述 ---

if __name__ == '__main__':
    app.run(debug=True)