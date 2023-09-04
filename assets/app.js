let cart = document.querySelector(".shopping-cart");
let switchBtn1 = document.getElementById("cart");
let switchBtn2 = document.getElementById("cart2");
let imageList = "";
let toggle = "";

const apiUrl = `http://jsonblob.com/api/1147831522991923200`;
// const apiUrl = `http://jsonblob.com/api/1073530511632384000`;

window.addEventListener("load", () => {
  fetchRandomImages();

  function fetchRandomImages(params) {
    axios
      .get(apiUrl)
      .then((response) => {
        // ここでresponse.dataが配列であるか確認
        if (Array.isArray(response.data)) {
          displayImages(response.data);
        } else {
          console.log("response.data is not an array:", response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function displayImages(arr) {
    arr.forEach((image, index) => {
      if (index <= 9) {
        imageList = document.querySelector(".ranking");
        imageList.innerHTML += `
      <li class="item${toggle}">
        <div class="item-container --ranking">
          <div class="ranking-num">${index + 1}</div>
          <div class="img-container">
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
      } else {
        imageList = document.querySelector(".normal");
        imageList.innerHTML += `
      <li class="item${toggle}">
        <div class="item-container">
          <div class="img-container">
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
      }
    });

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

    message.addEventListener("animationend", () => {
      message.classList.remove("popup-message");
      message.classList.add("hidden");
      messageContainer.removeChild(messageBlock);
      // messageBlock.remove();
    });
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
