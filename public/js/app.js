const productsGrid = document.getElementById('productsGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsEl = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');

let cart = JSON.parse(localStorage.getItem('az_cart') || '[]');

const formatMoney = (value) => Number(value).toFixed(2);

const saveCart = () => {
  localStorage.setItem('az_cart', JSON.stringify(cart));
  renderCart();
};

const renderCart = () => {
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartItemsEl.innerHTML = '';

  let subtotal = 0;
  cart.forEach((item, idx) => {
    subtotal += item.price * item.quantity;
    const row = document.createElement('div');
    row.innerHTML = `
      <p><strong>${item.name}</strong> (${item.size || '-'} / ${item.color || '-'})</p>
      <p>$${formatMoney(item.price)} x <input type="number" min="1" value="${item.quantity}" data-idx="${idx}" class="qtyInput" /></p>
      <button data-remove="${idx}" class="btn">Eliminar</button>
      <hr />
    `;
    cartItemsEl.appendChild(row);
  });

  subtotalEl.textContent = formatMoney(subtotal);
  totalEl.textContent = formatMoney(subtotal > 200 ? subtotal : subtotal + 12);

  document.querySelectorAll('.qtyInput').forEach((input) => {
    input.addEventListener('change', (e) => {
      cart[Number(e.target.dataset.idx)].quantity = Number(e.target.value);
      saveCart();
    });
  });

  document.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      cart.splice(Number(e.target.dataset.remove), 1);
      saveCart();
    });
  });
};

const addToCart = (product) => {
  const size = prompt(`Selecciona talla (${product.sizes.join(', ')})`) || product.sizes[0] || 'Única';
  const color = prompt(`Selecciona color (${product.colors.join(', ')})`) || product.colors[0] || 'Único';
  const existing = cart.find((i) => i.productId === product._id && i.size === size && i.color === color);
  if (existing) existing.quantity += 1;
  else cart.push({ productId: product._id, name: product.name, price: product.price, quantity: 1, size, color });
  saveCart();
};

const renderProducts = (products) => {
  productsGrid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        <img src="${product.images[0] || 'https://placehold.co/600x800?text=AZ+Moda'}" alt="${product.name}" />
        <div class="content">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p><strong>$${formatMoney(product.price)}</strong></p>
          <p>Disponibles: ${product.inventory}</p>
          <button class="btn btn-dark" data-add="${product._id}">Agregar al carrito</button>
        </div>
      </article>
    `
    )
    .join('');

  document.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => {
      const product = products.find((item) => item._id === button.dataset.add);
      addToCart(product);
    });
  });
};

const loadProducts = async () => {
  const params = new URLSearchParams();
  ['searchInput', 'categoryFilter', 'sizeFilter', 'minPrice', 'maxPrice'].forEach((id) => {
    const value = document.getElementById(id).value;
    if (!value) return;
    const key = id
      .replace('Input', '')
      .replace('Filter', '')
      .replace('minPrice', 'minPrice')
      .replace('maxPrice', 'maxPrice');
    params.set(key.charAt(0).toLowerCase() + key.slice(1), value);
  });

  const response = await fetch(`/api/products?${params.toString()}`);
  const products = await response.json();
  renderProducts(products);
};

document.getElementById('applyFiltersBtn').addEventListener('click', loadProducts);
document.getElementById('openCartBtn').addEventListener('click', () => cartDrawer.classList.remove('hidden'));
document.getElementById('closeCartBtn').addEventListener('click', () => cartDrawer.classList.add('hidden'));

document.getElementById('checkoutForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!cart.length) return alert('Tu carrito está vacío');

  const formData = new FormData(event.target);
  const customer = Object.fromEntries(formData.entries());

  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer, items: cart })
  });

  const result = await response.json();
  const resultEl = document.getElementById('checkoutResult');

  if (!response.ok) {
    resultEl.textContent = result.message || 'No se pudo procesar el pedido';
    return;
  }

  resultEl.textContent = `Pedido confirmado. Número: ${result.orderNumber}. Pago: ${result.paymentStatus}`;
  cart = [];
  saveCart();
  event.target.reset();
  loadProducts();
});

renderCart();
loadProducts();
