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

// function fetchRandomImages(params) {
//   axios
//     .get(apiUrl)
//     .then((response) => {
//       // console.log(response);
//       // displayImages(response.data);
//       displayImages(response.data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

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
    // console.log(image);

    if (index <= 4) {
      imageList = document.getElementById("ranking");
      imageList.innerHTML += `
      <li class="item${toggle}">
         <div class="item-container${toggle}">
         <div class="ranking-num">${index + 1}</div>
            <img class="item-img" src="${image.image}" alt="tokyo ghoul">
            <div class="price">$${image.price}</div>
            <button class="addBtn">Add to cart</button>
          </div>
        </li>
        `;
    } else {
      imageList = document.getElementById("normal");
      imageList.innerHTML += `
      <li class="item${toggle}">
         <div class="item-container${toggle}">
            <img class="item-img" src="${image.image}" alt="tokyo ghoul">
            <div class="price">$${image.price}</div>
            <button class="addBtn">Add to cart</button>
          </div>
        </li>
        `;
    }
  });
}

///// cart event ////////////////////////////////////////////
window.addEventListener("load", () => {
  // let removeCartItemButtons = document.querySelector(".remove");
  let removeCartItemButtons = document.getElementsByClassName("remove");
  for (let i = 0; i < removeCartItemButtons.length; i++) {
    console.log("kakunin");
    let button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  // let quantityInputs = document.getElementsByClassName("cart-quantity-input");
  // for (let i = 0; i < quantityInputs.length; i++) {
  //   let input = quantityInputs[i];
  //   input.addEventListener("change", quantityChanged);
  // }

  // let addToCartButtons = document.getElementsByClassName("shop-item-button");
  // for (let i = 0; i < addToCartButtons.length; i++) {
  //   let button = addToCartButtons[i];
  //   button.addEventListener("click", addToCartClicked);
  // }

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
    console.log("here");
    let buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    // updateCartTotal();
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
