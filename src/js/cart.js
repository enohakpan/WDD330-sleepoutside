import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  updateCartFooter(cartItems);
}

function cartItemTemplate(item) {
  const imageSrc = (item.Images && item.Images.PrimaryMedium)
    ? item.Images.PrimaryMedium
    : (item.Image || "images/noun_Tent_2517.svg");

  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${imageSrc}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors && item.Colors[0] ? item.Colors[0].ColorName : ''}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function updateCartFooter(cartItems) {
  const footer = document.querySelector(".cart-footer");
  const totalEl = document.querySelector(".cart-total");
  if (!footer || !totalEl) return;

  if (cartItems && cartItems.length > 0) {
    const total = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.FinalPrice);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
    totalEl.textContent = `Total: ${formatted}`;
    footer.classList.remove("hide");
  } else {
    footer.classList.add("hide");
    totalEl.textContent = "Total: ";
  }
}

renderCartContents();