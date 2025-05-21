class CartAPI {
  constructor(storageKey) {
    this.storageKey = storageKey;
    this.cart = this.loadCart();
  }
  loadCart() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : [];
  }
  saveCart() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
  }
  addItem(product) {
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.saveCart();
  }
  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }
  getItems() {
    return this.cart;
  }
  getTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  clear() {
    this.cart = [];
    this.saveCart();
  }
}

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginForm = document.getElementById('login-form');
const welcomeDiv = document.getElementById('welcome');
const welcomeMsg = document.getElementById('welcome-message');
const errorMsg = document.getElementById('error-msg');
const productsContainer = document.getElementById('products-container');
const cartItemsDiv = document.getElementById('cart-items');
const totalPriceDiv = document.getElementById('total-price');
const addProductForm = document.getElementById('add-product-form');
const addProductBtn = document.getElementById('add-product-btn');
const titulosLogin = document.querySelectorAll('.loginTittle');

const validCredentials = {
  username: 'pedro',
  password: 'pass'
};

const products = [
  { id: 1, name: 'Camiseta', price: 15.99 },
  { id: 2, name: 'Pantalones', price: 29.99 },
  { id: 3, name: 'Zapatos', price: 49.99 },
  { id: 4, name: 'Gorra', price: 12.50 },
  { id: 5, name: 'Mochila', price: 39.00 }
];

const cart = new CartAPI('userCart');

document.addEventListener('DOMContentLoaded', () => {
  const loggedUser = localStorage.getItem('loggedUser');
  if (loggedUser) {
    showWelcome(loggedUser);
    titulosLogin.forEach(el => el.style.display = 'none');
  } else {
    showLoginForm();
  }
});

loginBtn.addEventListener('click', () => {
  errorMsg.style.display = 'none';
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    showError('Por favor, completa ambos campos.');
    return;
  }

  if (username === validCredentials.username && password === validCredentials.password) {
    localStorage.setItem('loggedUser', username);
    titulosLogin.forEach(el => el.style.display = 'none');
    cart.clear();
    showWelcome(username);
  } else {
    showError('Usuario o contraseña incorrectos.');
  }
});

logoutBtn.addEventListener('click', () => {
  cart.clear();
  titulosLogin.forEach(el => el.style.display = 'block');
  alert(`¡ Cierre de Sesion Realizado ! \n Adios ${localStorage.getItem('loggedUser')}`);
  localStorage.removeItem('loggedUser');
  showLoginForm();
});

addProductBtn.addEventListener('click', () => {
  errorMsg.style.display = 'none';
  const newProductName = document.getElementById('new-product-name').value.trim();
  const newProductPrice = parseFloat(document.getElementById('new-product-price').value);

  if (!newProductName || isNaN(newProductPrice) || newProductPrice <= 0) {
    showError('Por favor, completa todos los campos correctamente.');
    return;
  }

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name: newProductName,
    price: newProductPrice
  };

  alert(`¡ Producto ${newProductName} Ingresado Correctamente !`);
  products.push(newProduct);
  renderProducts();

  document.getElementById('new-product-name').value = '';
  document.getElementById('new-product-price').value = '';
});

function showWelcome(username) {
  alert(`¡ Inicio de Sesion Autorizada !`);
  welcomeMsg.textContent = `¡Bienvenido ${localStorage.getItem('loggedUser')}!`;
  loginForm.style.display = 'none';
  welcomeDiv.style.display = 'block';
  addProductForm.style.display = 'block';
  productsContainer.style.display = 'block';
  document.getElementById('cart').style.display = 'block';
  renderProducts();
  renderCart();
}

function showLoginForm() {
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  errorMsg.style.display = 'none';
  loginForm.style.display = 'block';
  welcomeDiv.style.display = 'none';
  addProductForm.style.display = 'none';
  productsContainer.style.display = 'none';
  document.getElementById('cart').style.display = 'none';
  productsContainer.innerHTML = '';
  cartItemsDiv.innerHTML = '';
  totalPriceDiv.textContent = 'Total: $0.00';
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = 'block';
}

function renderProducts() {
  productsContainer.innerHTML = '';
  products.forEach(prod => {
    const prodDiv = document.createElement('div');
    prodDiv.className = 'product';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'product-name';
    nameSpan.textContent = prod.name;

    const priceSpan = document.createElement('span');
    priceSpan.className = 'product-price';
    priceSpan.textContent = `$${prod.price.toFixed(2)}`;

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Agregar';
    addBtn.addEventListener('click', () => {
      cart.addItem(prod);
      renderCart();
    });

    prodDiv.appendChild(nameSpan);
    prodDiv.appendChild(priceSpan);
    prodDiv.appendChild(addBtn);

    productsContainer.appendChild(prodDiv);
  });
}

function renderCart() {
  const items = cart.getItems();
  cartItemsDiv.innerHTML = '';
  if (items.length === 0) {
    cartItemsDiv.textContent = 'El carrito está vacío.';
    totalPriceDiv.textContent = 'Total: $0.00';
    return;
  }
  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';

    const nameQty = document.createElement('span');
    nameQty.className = 'cart-item-name';
    nameQty.textContent = `${item.name} x${item.quantity}`;

    const price = document.createElement('span');
    price.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Eliminar';
    removeBtn.title = 'Eliminar producto del carrito';
    removeBtn.addEventListener('click', () => {
      cart.removeItem(item.id);
      renderCart();
    });

    itemDiv.appendChild(nameQty);
    itemDiv.appendChild(price);
    itemDiv.appendChild(removeBtn);

    cartItemsDiv.appendChild(itemDiv);
  });
  totalPriceDiv.textContent = `Total: $${cart.getTotal().toFixed(2)}`;
}

