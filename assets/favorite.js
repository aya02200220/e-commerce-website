let favs = JSON.parse(localStorage.getItem("favs")) || [];
let list = document.getElementById("fav-lists");
let listNo = document.getElementsByClassName("fav-msg")[0];
// let count = document.getElementById("fav-count");
// count.innerHTML = favs.length;

if (favs.length === 0) {
  listNo.innerHTML = "<p class='fav-text' >No favorite!</p>";
} else {
  listNo.innerHTML = "<h3><i class='fa-solid fa-crown'></i> Favorite</h3>";

  favs.forEach((image) => {
    list.innerHTML += `
    <li class="fav-list">
      <div class="unique-id" style="display: none">${image.id}</div>
      <div class="fav-item-container">
        <div class="fav-img-container">
          <img
            class="item-img"
            src="${image.image}" alt="${image.title}"
          />
          <div class="about-item">
            <p class="title">${image.title}</p>
            <div class="price">$${image.price.toFixed(2)}</div>
            <button class="fav-remove-btn">remove</button>
          </div>
        </div>
      </div>
    </li>
    `;
  });

  let removeFavBtns = document.querySelectorAll(".fav-remove-btn");
  console.log(removeFavBtns);

  removeFavBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      getFaveData(event);
    });
  });
  // Favorite events

  const getFaveData = (elem) => {
    let button = elem.target;
    let shopItem =
      button.parentElement.parentElement.parentElement.parentElement;

    let id = shopItem.getElementsByClassName("unique-id")[0].innerText;
    let title = shopItem.getElementsByClassName("title")[0].innerText;
    let price = parseFloat(
      shopItem.getElementsByClassName("price")[0].innerText.replace("$", "")
    );
    let image = shopItem.getElementsByClassName("item-img")[0].src;
    const faveObj = { id, title, price, image };
    favCheck(faveObj);
  };

  const favCheck = (obj) => {
    const { id, title, price, image } = obj;
    const faveObj = { id, title, price, image };

    let existingFavs = favArr.find((fav) => fav.id == obj.id);
    console.log("existingFavs", existingFavs);
    console.log("一覧表示", favArr);
    if (existingFavs) {
      console.log("すでに格納済み");
      favArr = favArr.filter((fav) => fav.id !== obj.id);
      localStorage.setItem("favs", JSON.stringify(favArr));
      console.log("格納済みなので削除 ", favArr);
      favCount.innerHTML--;
    } else {
      console.log("新しく追加");
      favArr.push(faveObj);
      localStorage.setItem("favs", JSON.stringify(favArr));
      favCount.innerHTML++;
    }
    location.reload();
  };
}
