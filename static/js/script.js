// HTMLドキュメントが完全に読み込まれたら、中のコードを実行します
document.addEventListener("DOMContentLoaded", function () {
  // APIからレイアウトIDが1のデータを取得します
  fetch("/api/layouts/1")
    .then((response) => {
      // サーバーからの返答をJSON形式に変換します
      if (!response.ok) {
        throw new Error("ネットワークの応答が正しくありませんでした");
      }
      return response.json();
    })
    .then((data) => {
      // データを正しく受け取れた場合の処理
      console.log("取得したデータ:", data); // まずはコンソールでデータを確認します

      // HTML内のデータを表示したい場所（要素）を取得します
      const layoutInfoDiv = document.getElementById("layout-info");

      // 「読み込み中...」の表示を消します
      layoutInfoDiv.innerHTML = "";

      if (data.length === 0) {
        layoutInfoDiv.textContent = "データが見つかりませんでした。";
        return;
      }

      // 見出しを追加します
      const title = document.createElement("h2");
      title.textContent = `配置名: ${data[0].placement_name}`;
      layoutInfoDiv.appendChild(title);

      // 取得した家具のリストを作成します
      const ul = document.createElement("ul");
      data.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `家具: ${item.furniture_name} (X: ${item.pos_x}, Y: ${item.pos_y})`;
        ul.appendChild(li);
      });
      layoutInfoDiv.appendChild(ul);
    })
    .catch((error) => {
      // データ取得に失敗した場合の処理
      console.error("データの取得に失敗しました:", error);
      const layoutInfoDiv = document.getElementById("layout-info");
      layoutInfoDiv.textContent = "データの読み込みに失敗しました。";
    });
});
