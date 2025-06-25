document.addEventListener("DOMContentLoaded", function () {
  const SCALE = 100; // 1メートル = 100ピクセル
  const roomContainer = document.getElementById("room-container");

  let activeItem = null;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  fetch("/api/layouts/1")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) return;
      renderLayout(data);
    })
    .catch((error) => {
      console.error("データの取得に失敗しました:", error);
      document.getElementById("layout-name").textContent =
        "データの読み込みに失敗しました。";
    });

  function renderLayout(layoutData) {
    const layoutNameH2 = document.getElementById("layout-name");
    const firstItem = layoutData[0];
    layoutNameH2.textContent = `配置名: ${firstItem.placement_name} (${firstItem.room_name})`;
    roomContainer.style.width = `${firstItem.room_width * SCALE}px`;
    roomContainer.style.height = `${firstItem.room_depth * SCALE}px`;
    roomContainer.innerHTML = "";

    layoutData.forEach((item) => {
      const furnitureDiv = document.createElement("div");
      furnitureDiv.className = "furniture-item";
      furnitureDiv.textContent = item.furniture_name;
      furnitureDiv.dataset.furnitureId = item.furniture_id;
      furnitureDiv.style.width = `${item.furniture_width * SCALE}px`;
      furnitureDiv.style.height = `${item.furniture_depth * SCALE}px`;
      furnitureDiv.style.left = `${item.pos_x * SCALE}px`;
      furnitureDiv.style.top = `${item.pos_y * SCALE}px`;
      furnitureDiv.style.transform = `rotate(${item.rotation}deg)`;
      furnitureDiv.addEventListener("mousedown", dragStart);
      roomContainer.appendChild(furnitureDiv);
    });
  }

  function dragStart(e) {
    // ★改良: テキストをクリックしても親要素を掴むようにする
    if (e.target.classList.contains("furniture-item")) {
      activeItem = e.target;
    } else {
      // テキストなど子要素がクリックされた場合は、親の.furniture-itemを探す
      activeItem = e.target.closest(".furniture-item");
    }

    if (!activeItem) return;

    isDragging = true;
    activeItem.style.cursor = "grabbing";
    activeItem.style.zIndex = 1000; // ドラッグ中の要素を最前面に
    offsetX = e.clientX - activeItem.getBoundingClientRect().left;
    offsetY = e.clientY - activeItem.getBoundingClientRect().top;
  }

  function drag(e) {
    if (!isDragging || !activeItem) return;

    // マウスの動きに合わせて家具の座標を更新
    let newX = e.clientX - roomContainer.getBoundingClientRect().left - offsetX;
    let newY = e.clientY - roomContainer.getBoundingClientRect().top - offsetY;

    // --- ★ここからが範囲制限のロジック ---
    const roomRect = roomContainer.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    // X座標の最小値・最大値を計算
    const minX = 0;
    const maxX = roomRect.width - itemRect.width;
    // Y座標の最小値・最大値を計算
    const minY = 0;
    const maxY = roomRect.height - itemRect.height;

    // 計算した座標が範囲内に収まるように調整
    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));

    activeItem.style.left = `${newX}px`;
    activeItem.style.top = `${newY}px`;
  }

  function dragEnd() {
    if (activeItem) {
      activeItem.style.cursor = "grab";
      activeItem.style.zIndex = ""; // z-indexを元に戻す
    }

    isDragging = false;
    activeItem = null;
  }

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", dragEnd);
});
