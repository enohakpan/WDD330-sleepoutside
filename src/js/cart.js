import { getLocalStorage } from "./utils.mjs";


// RENDER CART CONTENTS
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

// Delete button included
function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>

      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>

      <!-- DELETE BUTTON -->
      <button class="remove-btn" data-id="${item.Id}">
        Remove
      </button>
    </li>
  `;
}

// Run the cart render
renderCartContents();