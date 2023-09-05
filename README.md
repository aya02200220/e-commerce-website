# Manga E-commerce Web Application

## Overview

This project is an E-commerce web application where you can purchase various manga titles. The application fetches data from an API and displays it in a user-friendly interface. You can browse through a collection of manga, add your favorite titles to a shopping cart, and proceed to checkout. The application also includes a favorite feature, where you can mark specific manga titles as your favorite.

## Features

1. **Display Manga**: Fetches and displays manga from an external API.
2. **Random Manga**: Generates a list of random manga titles to display.
3. **Favorites**: Allows users to add or remove manga from a favorite list.
4. **Shopping Cart**: Users can add manga to a shopping cart for checkout.
5. **Dynamic Pricing**: Displays the pricing information for each manga.
6. **Local Storage**: Utilizes local storage to remember favorite items and cart contents.

## How It Works

### Initialization

- On window load, the `fetchRandomImages` function fetches manga data from an external API and populates the page with this data.
- If the API is unavailable, it falls back to using local manga data.

### Manga List

- Manga is displayed in two sections: random and normal.
- Each manga displayed includes its image, title, and price.

### Favorites

- Users can click on a favorite icon (`fav-icon`) to add/remove manga from their favorites list.
- The number of items in the favorites list is displayed in a badge (`favCount`).

### Shopping Cart

- Items can be added to the cart by clicking on the "Add to Cart" button.
- The cart can be viewed and edited at any time by clicking on a button (`cart` and `cart2`) to toggle its visibility.

### Checkout

- The total price and item count in the cart are dynamically updated.
- Items can be removed from the cart, and their quantity can be adjusted.

## Technology Stack

- JavaScript (ES6+)
- HTML/CSS
- Axios for API requests

## Setup and Installation

Follow the standard procedures for setting up an HTML/JS/CSS project. No special installation steps are required.

## Limitations

- Currently, all data is stored in local storage. This means if the user clears their browser cache, the cart and favorites data will be lost.

## Future Improvements

- Implement a backend database to store user data.
- Add more features such as user authentication, reviews, and more.

## Development

- To clear the stored data, you can uncomment `// localStorage.removeItem('randoms'); // localStorage.clear();`.

## License

This project is open-source, feel free to use, modify and distribute.

That's all for now. Happy shopping for your favorite manga!
