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

// const apiUrl = `https://jsonblob.com/api/1073530511632384000`;
const apiUrl = `https://jsonblob.com/api/1147831522991923200`;
// const apiUrl = `http://jsonblob.com/api/1073530511632384000`;

window.addEventListener("load", () => {
  fetchRandomImages();
  function fetchRandomImages(params) {
    axios
      .get(apiUrl)
      .then((response) => {
        displayImages(response.data);
        // displayRndImages(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function displayImages(arr) {
    /** 重複チック用配列 */
    let randoms = [];
    let randomArr = JSON.parse(localStorage.getItem("randoms")) || [];
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
            <div class="price">$${image.price.toFixed(2)}</div>
          </div>
        </div>
      </li>
        `;
    });
    arr.forEach((image, index) => {
      // if (index <= 9) {
      //   imageList = document.querySelector(".ranking");
      //   imageList.innerHTML += `
      // <li class="item${toggle}">
      //   <div class="item-container --ranking">
      //     <div class="ranking-num">${index + 1}</div>
      //     <div class="img-container">
      //       <img
      //         class="item-img"
      //         src="${image.image}" alt="${image.title}"/>
      //       <div class="card-overlay">
      //         <button class="addBtn" type="button">Add to cart</button>
      //       </div>
      //     </div>
      //     <div class="about-item">
      //       <p class="title">${image.title}</p>
      //       <div class="price">$${image.price.toFixed(2)}</div>
      //     </div>
      //   </div>
      // </li>
      //   `;
      // } else {
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

    // message.addEventListener("animationend", () => {
    //   message.classList.remove("popup-message");
    //   message.classList.add("hidden");
    //   messageContainer.removeChild(messageBlock);
    //   // messageBlock.remove();
    // });
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
