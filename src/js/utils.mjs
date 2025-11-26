// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

// small UI alert that appears at the top of the main element
export function alertMessage(message, scroll = true, kind = 'error') {
  const main = document.querySelector('main') || document.body;

  // build alert element
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.classList.add(kind === 'success' ? 'alert--success' : 'alert--error');

  // allow strings or objects
  const content = (typeof message === 'string') ? message : JSON.stringify(message, null, 2);

  alert.innerHTML = `<div class="alert__content"><pre>${content}</pre></div><button class="alert__close" aria-label="Close alert">×</button>`;

  // remove handler for close button
  alert.addEventListener('click', function (e) {
    const target = e.target;
    if (target.classList.contains('alert__close')) {
      main.removeChild(alert);
    }
  });

  // insert at top of main and optionally scroll
  main.prepend(alert);
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}