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
}

///// cart event ////////////////////////////////////////////
window.addEventListener("load", () => {
  updateCartTotal();

  //remove items -----------------------------------------
  let removeCartItemButtons = document.getElementsByClassName("remove");
  for (let i = 0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  // counter event -----------------------------------------
  let quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  // add to cart event -----------------------------------------
  let addToCartButtons = document.querySelectorAll(".addBtn");
  for (let i = 0; i < addToCartButtons.length; i++) {
    let button = addToCartButtons[i];
    console.log("addkakuninnyou  ");
    console.log(button);
    button.addEventListener("click", addToCartClicked);
  }

  function addToCartClicked() {
    console.log("adddd");
    // let button = event.target;
    // console.log(button);
    // let shopItem = button.parentElement.parentElement;
    // let title = shopItem.getElementsByClassName("cart title")[0].innerText;
    // let price = shopItem.getElementsByClassName("amount")[0].innerText;
    // let imageSrc = shopItem.getElementsByClassName("item-img")[0].src;
    // addItemToCart(title, price, imageSrc);
    // updateCartTotal();
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
  //   updateCartTotal();
  // }

  function removeCartItem(event) {
    console.log("remove 確認");
    // let buttonClicked = event.target;
    // buttonClicked.parentElement.parentElement.remove();
    // updateCartTotal();
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
    let cartRows = cartItemContainer.getElementsByClassName("cart-list");
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
