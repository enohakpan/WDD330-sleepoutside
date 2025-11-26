import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

export default class CheckoutProcess {
  constructor(key = 'so-cart', outputSelector = '.checkout-summary') {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.service = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();

    // wire up zip change to calculate full totals
    const zip = document.querySelector('#zip');
    if (zip) {
      zip.addEventListener('change', () => this.calculateOrderTotal());
    }

    // form submit
    const form = document.querySelector('form[name="checkout"]');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.checkout(form);
      });
    }
  }

  calculateItemSubTotal() {
    // sum FinalPrice values and update items & subtotal elements
    this.itemTotal = (this.list || []).reduce((sum, item) => {
      const price = parseFloat(item.FinalPrice);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    const numberItemsEl = document.getElementById('numberItems');
    const cartTotalEl = document.getElementById('cartTotal');
    if (numberItemsEl) numberItemsEl.innerText = this.list.length;
    if (cartTotalEl) cartTotalEl.innerText = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.itemTotal);
  }

  calculateOrderTotal() {
    // tax = 6% of subtotal
    this.tax = this.itemTotal * 0.06;

    // shipping = $10 for first item + $2 for each additional
    const count = (this.list || []).length;
    this.shipping = count === 0 ? 0 : 10 + Math.max(0, count - 1) * 2;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxEl = document.querySelector(`${this.outputSelector} #tax`) || document.getElementById('tax');
    const shippingEl = document.querySelector(`${this.outputSelector} #shipping`) || document.getElementById('shipping');
    const totalEl = document.querySelector(`${this.outputSelector} #total`) || document.getElementById('total');

    const fmt = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

    if (taxEl) taxEl.innerText = fmt(this.tax);
    if (shippingEl) shippingEl.innerText = fmt(this.shipping);
    if (totalEl) totalEl.innerText = fmt(this.orderTotal);
  }

  // convert localstorage cart to the simplified items list server expects
  packageItems(items) {
    return (items || []).map((i) => ({
      id: i.Id || i.id || '',
      name: i.Name || i.name || '',
      price: Number(i.FinalPrice || i.Price || 0),
      quantity: 1
    }));
  }

  async checkout(formElement) {
    // ensure HTML5 form validation passes
    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }
    // ensure totals are calculated before sending
    this.calculateOrderTotal();

    // convert form to JSON
    const formData = new FormData(formElement);
    const payload = {};
    formData.forEach((value, key) => (payload[key] = value));

    // attach order metadata
    payload.orderDate = new Date().toISOString();
    // totals as strings to match example
    payload.orderTotal = this.orderTotal.toFixed(2);
    payload.shipping = this.shipping; // server accepts number
    payload.tax = this.tax.toFixed(2);

    payload.items = this.packageItems(this.list);

    // call external service
    try {
      const result = await this.service.checkout(payload);
      console.log('Checkout response:', result);
      // show success to user
      alert('Order submitted successfully.\nOrder ID: ' + (result && result.id ? result.id : 'n/a'));
      // (optional) clear local storage cart
      // localStorage.removeItem(this.key);
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Checkout failed. See console for details.');
    }
  }
}
