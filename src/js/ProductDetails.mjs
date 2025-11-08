import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
        // use the datasource to get the details for the current product
        this.product = await this.dataSource.findProductById(this.productId);
        
        // Check if we have valid product data
        if (this.product && this.product.Brand) {
            this.renderProductDetails();
            document
                .getElementById("addToCart")
                .addEventListener("click", this.addProductToCart.bind(this));
        } else {
            throw new Error('Invalid product data - missing required properties');
        }
    } catch (error) {
        console.error('Error initializing product details:', error);
        const container = document.querySelector(".product-detail");
        if (container) {
            container.innerHTML = `<p>Error loading product details</p>`;
        }
    }
  }

  addProductToCart() {
    let cartItems = getLocalStorage("so-cart") || [];
    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.Id === this.product.Id);
    
    if (existingItem) {
        // If item exists, increment its quantity
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        // If item is new, add it with quantity 1
        this.product.quantity = 1;
        cartItems.push(this.product);
    }
    
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  if (!product || !product.Brand) {
      console.error('Invalid product data');
      return;
  }

  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = product.FinalPrice;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}

// ************* Alternative Display Product Details Method *******************
// function productDetailsTemplate(product) {
//   return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
//     <h2 class="divider">${product.NameWithoutBrand}</h2>
//     <img
//       class="divider"
//       src="${product.Image}"
//       alt="${product.NameWithoutBrand}"
//     />
//     <p class="product-card__price">$${product.FinalPrice}</p>
//     <p class="product__color">${product.Colors[0].ColorName}</p>
//     <p class="product__description">
//     ${product.DescriptionHtmlSimple}
//     </p>
//     <div class="product-detail__add">
//       <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
//     </div></section>`;
// }