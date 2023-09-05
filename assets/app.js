let cart = document.querySelector(".shopping-cart");
let switchBtn1 = document.getElementById("cart");
let switchBtn2 = document.getElementById("cart2");

let favArr = JSON.parse(localStorage.getItem("favs")) || [];

let favCount = document.querySelector(".favCount");
favCount.innerHTML = favArr.length || 0;
let imageList = "";
let toggle = "";

// localStorage.removeItem('randoms');
// localStorage.clear();

const apiUrl = `http://jsonblob.com/api/1147831522991923200`;
// const apiUrl = `http://jsonblob.com/api/1073530511632384000`;

window.addEventListener("load", () => {
  fetchRandomImages();

  function fetchRandomImages(params) {
    axios
      .get(apiUrl)
      .then((response) => {
        if (Array.isArray(response.data)) {
          displayImages(response.data);
        } else {
          console.log("response.data is not an array:", response.data);
        }
      })
      .catch((err) => {
        console.log(err);
        // APIからデータを取得できなかった場合、ローカルのmanga.jsonファイルからデータを取得します。
        localStorage.removeItem("randoms");
        displayImages(mangaData);
      });
  }

  //////////////////////////////////////////////////////

  function displayImages(arr) {
    /** 重複チック用配列 */
    let randoms = [];
    let randomArr = JSON.parse(localStorage.getItem("randoms")) || [];
    console.log(randomArr);
    /** 最小値と最大値 */
    let min = 1;
    let max = arr.length;

    /** 重複チェックしながら乱数作成 */
    if (randomArr.length === 0) {
      for (i = min; i <= 10; i++) {
        while (true) {
          let tmp = intRandom(min, max);
          if (!randoms.includes(tmp)) {
            randoms.push(tmp);
            randomArr.push(arr[tmp - 1]);
            break;
          }
        }
      }
      localStorage.setItem("randoms", JSON.stringify(randomArr));
    }

    /** min以上max以下の整数値の乱数を返す */
    function intRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomArr.forEach((image, index) => {
      imageList = document.querySelector(".ranking");
      imageList.innerHTML += `
      <li class="item${toggle}">
        <div class="item-container --ranking">
          <div class="ranking-num">${index + 1}</div>
          <div class="img-container">
          <div class="unique-id" style="display: none">${image.id}</div>
          <div class="fav-icon ${
            favArr.find((fav) => fav.id == image.id) ? "like-yes" : "like-no"
          }"></div>
            <img
              class="item-img"
              src="${image.image}" alt="${image.title}"/>
            <div class="card-overlay">
              <button class="addBtn" type="button">Add to cart</button>
            </div>
          </div>
          <div class="about-item">
            <p class="title">${image.title}</p>

  
            <div class="price">$${
              image.price ? image.price.toFixed(2) : "N/A"
            }</div>
                      </div>
        </div>
      </li>
        `;
    });
    arr.forEach((image, index) => {
      imageList = document.querySelector(".normal");
      imageList.innerHTML += `
      <li class="item${toggle}">
        <div class="item-container">
          <div class="img-container">
          <div class="unique-id" style="display: none">${image.id}</div>
          <div class="fav-icon ${
            favArr.find((fav) => fav.id == image.id) ? "like-yes" : "like-no"
          }"></div>
            <img
              class="item-img"
              src="${image.image}" alt="${image.title}"/>
            <div class="card-overlay">
              <button class="addBtn" type="button">Add to cart</button>
            </div>
          </div>
          <div class="about-item">
            <p class="title">${image.title}</p>
            <div class="price">$${image.price.toFixed(2)}</div>
          </div>
        </div>
      </li>
        `;
      // }
    });

    // Favorite events
    const listenForLikes = () => {
      const likes = document.querySelectorAll(".fav-icon");
      likes.forEach((like) => {
        like.addEventListener("click", (event) => {
          event.target.classList.toggle("like-no");
          event.target.classList.toggle("like-yes");
          // event.target.classList.toggle("fa-beat");
          if (event.target.classList.contains("like-yes")) {
            // console.log("✅💾 Saving Favorite...");
            getFaveData(event);
          } else {
            // console.log("❌ Removing Favorite...");
            getFaveData(event);
          }
        });
      });
    };

    listenForLikes();

    const getFaveData = (elem) => {
      let button = elem.target;
      let shopItem = button.parentElement.parentElement;

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
      // console.log("existingFavs", existingFavs);
      // console.log("一覧表示", favArr);
      if (existingFavs) {
        // console.log("すでに格納済み");
        favArr = favArr.filter((fav) => fav.id !== obj.id);
        localStorage.setItem("favs", JSON.stringify(favArr));
        // console.log("格納済みなので削除 ", favArr);
        favCount.innerHTML--;
        dislikeDuplicateData(obj.id);
      } else {
        // console.log("新しく追加");
        favArr.push(faveObj);
        localStorage.setItem("favs", JSON.stringify(favArr));
        favCount.innerHTML++;
        likeDuplicateData(obj.id);
      }
    };

    const likeDuplicateData = (id) => {
      let items = document.querySelectorAll(".item");
      items.forEach((item) => {
        let tmp = item.querySelector(".unique-id").innerHTML;
        if (tmp === id) {
          let addLike = item.querySelector(".fav-icon");
          if (!randoms.includes("like-yes")) {
            addLike.classList.add("like-yes");
            addLike.classList.remove("like-no");
          }
        }
      });
    };
    const dislikeDuplicateData = (id) => {
      let items = document.querySelectorAll(".item");
      items.forEach((item) => {
        let tmp = item.querySelector(".unique-id").innerHTML;
        if (tmp === id) {
          let addLike = item.querySelector(".fav-icon");
          if (!randoms.includes("like-no")) {
            addLike.classList.add("like-no");
            addLike.classList.remove("like-yes");
          }
        }
      });
    };

    // add to cart event -----------------------------------------
    let addToCartButtons = document.querySelectorAll(".addBtn");
    addToCartButtons.forEach((btn) =>
      btn.addEventListener("click", addToCartClicked)
    );
  }

  //remove items -----------------------------------------
  let removeCartItemButtons = document.getElementsByClassName("remove");
  for (let i = 0; i < removeCartItemButtons.length; i++) {
    console.log("remove");
    let button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  // counter event -----------------------------------------
  let quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
  ///// cart events ////////////////////////////////////////////
  updateCartTotal();

  function addToCartClicked(event) {
    let button = event.target;
    let shopItem = button.parentElement.parentElement.parentElement;
    let title = shopItem.getElementsByClassName("title")[0].innerText;

    let price = parseFloat(
      shopItem.getElementsByClassName("price")[0].innerText.replace("$", "")
    );
    let imageSrc = shopItem.getElementsByClassName("item-img")[0].src;
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
  }

  function addItemToCart(title, price, imageSrc) {
    let cartRow = document.createElement("li");
    cartRow.classList.add("cart-list");
    let cartItems = document.getElementsByClassName("cart-lists")[0];
    let cartItemNames = cartItems.getElementsByClassName("cart title");
    console.log(cartItemNames);
    for (let i = 0; i < cartItemNames.length; i++) {
      if (cartItemNames[i].innerHTML == title) {
        alert("This item is already added to the cart");
        return;
      }
    }
    let cartRowContents = `
      <li class="cart-list">
        <div class="cart-row">
          <div class="image-box">
            <img
              class="item-img"
              src="${imageSrc}"
              alt=""
            />
          </div>
          <div class="about">
            <p class="cart title">${title}</p>
          </div>
          <div class="prices">
            <div class="amount">$${price.toFixed(2)}</div>
          </div>
          <div class="cart-quantity cart-column counter">
            <input
              class="cart-quantity-input count"
              type="number"
              value="1"
            />
            <i class="fa-solid fa-trash-can remove"></i>
          </div>
        </div>
      </li>
    `;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow
      .getElementsByClassName("remove")[0]
      .addEventListener("click", removeCartItem);
    cartRow
      .getElementsByClassName("cart-quantity-input")[0]
      .addEventListener("change", quantityChanged);
    updateCartTotal();

    // const message = document.querySelector(".message");
    let messageContainer =
      document.getElementsByClassName("messageContainer")[0];
    let messageBlock = document.createElement("div");
    messageBlock.remove();
    messageBlock.classList.add("message");
    messageBlock.classList.add("hidden");
    messageBlock.innerHTML = `${title}<br /><br /> is added to the cart!`;
    messageContainer.append(messageBlock);
    messageBlock.classList.remove("hidden");
    messageBlock.classList.add("popup-message");
  }

  document
    .getElementsByClassName("button --checkout")[0]
    .addEventListener("click", purchaseClicked);

  document
    .getElementsByClassName("button --delete")[0]
    .addEventListener("click", allDeleteClicked);

  function purchaseClicked() {
    let cartItems = document.getElementsByClassName("cart-lists")[0];
    console.log(cartItems);
    if (!cartItems.hasChildNodes()) {
      return alert("Your cart is empty");
    }
    alert("Thank you for your purchase");
    while (cartItems.hasChildNodes()) {
      cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
  }
  function allDeleteClicked() {
    alert("Cart items all deleted");
    let cartItems = document.getElementsByClassName("cart-lists")[0];
    while (cartItems.hasChildNodes()) {
      cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
  }

  function removeCartItem(event) {
    let buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
  }

  function quantityChanged(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
    updateCartTotal();
  }

  function updateCartTotal() {
    let totalQuantityElement = document.getElementsByClassName("badge");
    let cartItemContainer = document.getElementsByClassName("cart-lists")[0];
    let cartRows = cartItemContainer.getElementsByClassName("cart-row");
    let total = 0;
    let totalQuantity = 0;

    for (let i = 0; i < cartRows.length; i++) {
      let cartRow = cartRows[i];

      let priceElement = cartRow.getElementsByClassName("amount")[0];
      let quantityElement = cartRow.getElementsByClassName("count")[0];

      let price = parseFloat(priceElement.innerText.replace("$", ""));
      let quantity = parseFloat(quantityElement.value);

      total = total + price * quantity;
      totalQuantity = totalQuantity + quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("main-color-text")[0].innerText =
      "$" + total.toFixed(2);
    totalQuantityElement[0].innerText = totalQuantity;
    totalQuantityElement[1].innerText = totalQuantity;
  }

  // switch displaying cart
  let changeElement = (el) => {
    el.classList.toggle("active");
  };

  switchBtn1.addEventListener(
    "click",
    () => {
      changeElement(cart);
    },
    false
  );
  switchBtn2.addEventListener(
    "click",
    () => {
      changeElement(cart);
    },
    false
  );
});

const mangaData = [
  {
    id: 35,
    title: "Chainsaw Man",
    image:
      "https://m.media-amazon.com/images/I/81tadC4LSVL._AC_UF1000,1000_QL80_.jpg",
    price: 9.99,
  },
  {
    id: 36,
    title: "SPY×FAMILY",
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1571349928l/52950513.jpg",
    price: 9.99,
  },
  {
    id: 37,
    title: "SPY×FAMILY",
    image:
      "https://upload.wikimedia.org/wikipedia/it/3/37/Oshi_no_Ko_copertina.jpg",
    price: 9.99,
  },
  {
    id: 1,
    title: "Tokyo Ghoul #7",
    image:
      "https://prodimage.images-bn.com/pimages/9781421580425_p0_v1_s192x300.jpg",
    price: 9.99,
  },
  {
    id: 2,
    title: "One Piece",
    image: "https://m.media-amazon.com/images/I/71kvo+fijnL.jpg",
    price: 9.99,
  },
  {
    id: 3,
    title: "Naruto",
    image:
      "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
    price: 8.99,
  },
  {
    id: 4,
    title: "Attack on Titan",
    image: "https://m.media-amazon.com/images/I/91M9VaZWxOL.jpg",
    price: 12.99,
  },
  {
    id: 5,
    title: "Bleach",
    image:
      "https://www.rightstufanime.com/images/productImages/9781421516035_manga-Bleach-Graphic-Novel-24-primary.jpg?resizeid=3&resizeh=600&resizew=600",
    price: 10.99,
  },
  {
    id: 6,
    title: "Death Note",
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Death_Note_Vol_1.jpg/220px-Death_Note_Vol_1.jpg",
    price: 9.49,
  },
  {
    id: 7,
    title: "FullMetal Alchemist",
    image:
      "https://comicvine.gamespot.com/a/uploads/scale_medium/6/67663/4079417-01.jpg",
    price: 11.99,
  },
  {
    id: 8,
    title: "Sword Art Online",
    image:
      "https://comicvine.gamespot.com/a/uploads/scale_medium/6/67663/4421543-01.jpg",
    price: 13.99,
  },
  {
    id: 9,
    title: "Black Clover",
    image:
      "https://upload.wikimedia.org/wikipedia/en/6/69/Black_Clover%2C_volume_1.jpg",
    price: 9.79,
  },
  {
    id: 10,
    title: "My Hero Academia",
    image: "https://m.media-amazon.com/images/I/51FAgOL-1bL.jpg",
    price: 11.99,
  },
  {
    id: 11,
    title: "Dragon Ball",
    image: "https://m.media-amazon.com/images/I/71u0UjsSrnL.jpg",
    price: 8.99,
  },
  {
    id: 12,
    title: "One Punch Man",
    image:
      "https://upload.wikimedia.org/wikipedia/en/c/c3/OnePunchMan_manga_cover.png",
    price: 10.99,
  },
  {
    id: 13,
    title: "Hunter x Hunter",
    image: "https://m.media-amazon.com/images/I/815uHbvvu1L.jpg",
    price: 11.99,
  },
  {
    id: 14,
    title: "Fairy Tail",
    image: "https://cv.bkmkn.kodansha.co.jp/9784063844160/9784063844160_w.jpg",
    price: 9.99,
  },
  {
    id: 15,
    title: "JoJo's Bizarre Adventure",
    image: "https://dw9to29mmj727.cloudfront.net/products/1974708101.jpg",
    price: 12.99,
  },
  {
    id: 16,
    title: "Boruto",
    image: "https://m.media-amazon.com/images/I/71vP+oDyYYL.jpg",
    price: 9.99,
  },
  {
    id: 17,
    title: "The Promised Neverland",
    image: "https://neverland-animeusa.com/assets_2m/img/comic/img_cm07.jpg",
    price: 12.99,
  },
  {
    id: 18,
    title: "Seven Deadly Sins",
    image:
      "https://upload.wikimedia.org/wikipedia/en/c/c1/Nanatsu_no_Taizai_Volume_1.png",
    price: 11.99,
  },
  {
    id: 19,
    title: "Demon Slayer",
    image: "https://m.media-amazon.com/images/I/81ZNkhqRvVL.jpg",
    price: 11.99,
  },
  {
    id: 20,
    title: "SLAM DUNK",
    image: "http://st.cdjapan.co.jp/pictures/l/15/13/NEOBK-2262585.jpg",
    price: 19.99,
  },
  {
    id: 21,
    title: "Jujutsu Kaisen",
    image: "https://upload.wikimedia.org/wikipedia/en/4/46/Jujutsu_kaisen.jpg",
    price: 9.99,
  },
  {
    id: 22,
    title: "Tokyo Revengers",
    image:
      "https://upload.wikimedia.org/wikipedia/en/b/b1/Tokyo_Revengers_volume_1_cover.jpg",
    price: 10.98,
  },
  {
    id: 23,
    title: "Gantz",
    image: "https://upload.wikimedia.org/wikipedia/en/1/10/Gantz_vol._1.png",
    price: 9.99,
  },
  {
    id: 24,
    title: "Fruits Basket",
    image:
      "https://tap-multimedia-1172.nyc3.digitaloceanspaces.com/productimage/2351/9788415108443.jpg",
    price: 9.99,
  },
  {
    id: 25,
    title: "Rurouni Kenshin",
    image:
      "https://upload.wikimedia.org/wikipedia/en/c/cc/Rurouni_Kenshin_28.png",
    price: 9.99,
  },
  {
    id: 26,
    title: "Chobits",
    image:
      "https://m.media-amazon.com/images/I/91A2vKj1mrL._AC_UF700,800_QL80_.jpg",
    price: 9.99,
  },
  {
    id: 27,
    title: "Monster",
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/00/Monster_manga_volume_1_cover.jpg/220px-Monster_manga_volume_1_cover.jpg",
    price: 9.99,
  },
  {
    id: 28,
    title: "NANA",
    image:
      "https://dosbg3xlm0x1t.cloudfront.net/images/items/9784088564135/1200/9784088564135.jpg",
    price: 9.99,
  },
  {
    id: 29,
    title: "Yuyu Hakusho",
    image: "https://dw9to29mmj727.cloudfront.net/products/1591163250.jpg",
    price: 9.99,
  },
  {
    id: 30,
    title: "BAKUMAN",
    image:
      "https://cdn.shopify.com/s/files/1/0282/0970/9115/products/91_XBco_adL_1200x1200.jpg?v=1619184826",
    price: 9.99,
  },
  {
    id: 31,
    title: "Boys Over Flowers",
    image: "https://m.media-amazon.com/images/I/51MQYrNqdxL.jpg",
    price: 9.99,
  },
  {
    id: 32,
    title: "Banana Fish",
    image: "https://m.media-amazon.com/images/I/51a4zQABJEL.jpg",
    price: 9.99,
  },
  {
    id: 33,
    title: "One Piece #100",
    image:
      "https://dwgkfo5b3odmw.cloudfront.net/manga/thumbs/thumb-93680-OnePiece_GN100_C1_Web-3-WlH6FYTOWwrUpPtZsb4mvQ.jpg",
    price: 100.0,
  },
  {
    id: 34,
    title: "Shaman King",
    image:
      "https://comicvine.gamespot.com/a/uploads/scale_small/11/113021/2652261-shaman_king_vol._32__shaman_king__graphic_novels____hiroyuki_takei__9781421521855__amazon.com__books___main.jpg",
    price: 9.99,
  },
];
