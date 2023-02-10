let switchBtn = document.getElementById("cart");
let cart = document.querySelector(".shopping-cart");

// let imageList = document.querySelector(".items-list");
// let imageListRanking = document.querySelector(".items-list --ranking");
let imageList = "";
let toggle = "";

// http://jsonblob.com/1072984198809403392

// const apiKey = "6Mc3o91FMODLzNXOOa8qa96LrpODWubXgYZievZP7xY";
// const apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=30`;
// const apiKey = "6Mc3o91FMODLzNXOOa8qa96LrpODWubXgYZievZP7xY";
const apiUrl = `https://fakestoreapi.com/products`;

window.addEventListener("load", () => {
  fetchRandomImages();
  function fetchRandomImages(params) {
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log(response);
        displayImages(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function displayImages(arr) {
    arr.forEach((image, index) => {
      if (index <= 4) {
        imageList = document.querySelector(".ranking");
        imageList.innerHTML += `
      <li class="item${toggle}">
        <div class="item-container${toggle}">
          <div class="ranking-num">${index + 1}</div>
          <img class="item-img" src="${image.image}" alt="tokyo ghoul">
          <p class="title">${image.title}</p>
          <div class="price">$${image.price}</div>
          <button class="addBtn" type="button">Add to cart</button>
        </li>
        `;
      } else {
        imageList = document.querySelector(".normal");
        imageList.innerHTML += `
      <li class="item${toggle}">
        <div class="item-container${toggle}">
          <img class="item-img" src="${image.image}" alt="tokyo ghoul">
          <p class="title">${image.title}</p>
          <div class="price">$${image.price}</div>
          <button class="addBtn" type="button">Add to cart</button>
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
  ///// cart event ////////////////////////////////////////////
  updateCartTotal();

  function addToCartClicked(event) {
    let button = event.target;
    let shopItem = button.parentElement.parentElement;
    let title = shopItem.getElementsByClassName("title")[0].innerText;
    let price = parseFloat(
      shopItem.getElementsByClassName("price")[0].innerText.replace("$", "")
    );
    let imageSrc = shopItem.getElementsByClassName("item-img")[0].src;
    console.log(title);
    console.log(price);
    console.log(imageSrc);
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
  }

  function addItemToCart(title, price, imageSrc) {
    console.log("next add: " + title);
    let cartRow = document.createElement("li");
    cartRow.classList.add("cart-list");
    // let cartItems = document.getElementsByClassName("cart-items")[0];
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
            <div class="amount">$${price}</div>
          </div>
          <div class="cart-quantity cart-column counter">
            <input
              class="cart-quantity-input count"
              type="number"
              value="1"
            />
            <button class="remove" type="button">REMOVE</button>
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
  }

  // document
  //   .getElementsByClassName("btn-purchase")[0]
  //   .addEventListener("click", purchaseClicked);

  // function purchaseClicked() {
  //   alert("Thank you for your purchase");
  //   let cartItems = document.getElementsByClassName("cart-items")[0];
  //   while (cartItems.hasChildNodes()) {
  //     cartItems.removeChild(cartItems.firstChild);
  //   }
  // updateCartTotal();
  // }

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
    // let cartRows = cartItemContainer.getElementsByClassName("cart-list");
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
      "$" + total;
    totalQuantityElement[0].innerText = totalQuantity;
    totalQuantityElement[1].innerText = totalQuantity;
  }

  /////////////////////////////////////////////////

  /////////////////////////////////////////////////
  // switch displaying cart
  let changeElement = (el) => {
    el.classList.toggle("active");
  };

  switchBtn.addEventListener(
    "click",
    () => {
      changeElement(cart);
    },
    false
  );

  ////////////////////////////////
});
