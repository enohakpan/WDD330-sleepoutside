// Sort product cards inside .product-list by name or price.
// Works by finding a "name" element and a "price" element inside each .product-card.
document.addEventListener('DOMContentLoaded', () => {
  const list = document.querySelector('.product-list');
  const select = document.getElementById('sort');
  if (!list || !select) return;

  // Build items array capturing original index for stable sorts
  function buildItems() {
    return Array.from(list.children).map((el, i) => {
      // try common selectors for name
      const nameEl =
        el.querySelector('.card__name, .product-name, .name, h2, h3') ||
        el.querySelector('[data-name]');
      const rawName = nameEl ? nameEl.textContent.trim() : '';

      // try common selectors for price
      const priceEl =
        el.querySelector('.product-card__price, .price, .card__price') ||
        el.querySelector('[data-price]') ||
        // fallback: find any text with a dollar sign inside the card
        Array.from(el.querySelectorAll('*')).find(n => /\$\s*\d/.test(n.textContent));

      let rawPrice = priceEl ? priceEl.textContent : '';
      // extract number from text (e.g. "$199.99")
      const priceMatch = rawPrice.match(/-?\d+(\.\d+)?/);
      const price = priceMatch ? parseFloat(priceMatch[0]) : 0;

      return { el, name: rawName.toLowerCase(), price, index: i };
    });
  }

  function render(arr) {
    // append in order to the list (this moves existing nodes)
    arr.forEach(item => list.appendChild(item.el));
  }

  function applySort(mode) {
    const items = buildItems();
    let sorted = [...items];

    switch (mode) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name) || a.index - b.index);
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name) || a.index - b.index);
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price || a.index - b.index);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price || a.index - b.index);
        break;
      default:
        sorted.sort((a, b) => a.index - b.index);
    }

    render(sorted);
  }

  // initialize to current select value (or default)
  applySort(select.value || 'default');

  // listen for changes
  select.addEventListener('change', (e) => applySort(e.target.value));
});