const loginForm = document.getElementById('loginForm');
const dashboardSection = document.getElementById('dashboardSection');
const productSection = document.getElementById('productSection');
const productForm = document.getElementById('productForm');
const adminMessage = document.getElementById('adminMessage');

let token = localStorage.getItem('az_admin_token') || '';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
});

const loadDashboard = async () => {
  const [dashboardRes, ordersRes] = await Promise.all([
    fetch('/api/admin/dashboard', { headers: authHeaders() }),
    fetch('/api/orders', { headers: authHeaders() })
  ]);

  if (!dashboardRes.ok || !ordersRes.ok) return;

  const dashboard = await dashboardRes.json();
  const orders = await ordersRes.json();

  document.getElementById('totalSales').textContent = Number(dashboard.totalSales).toFixed(2);
  document.getElementById('ordersCount').textContent = orders.length;
  document.getElementById('lowStockList').innerHTML = dashboard.lowStock
    .map((product) => `<li>${product.name} (${product.inventory})</li>`)
    .join('');
};

const unlockAdmin = async () => {
  dashboardSection.classList.remove('hidden');
  productSection.classList.remove('hidden');
  await loadDashboard();
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(loginForm).entries());

  const response = await fetch('/api/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  const data = await response.json();
  if (!response.ok) {
    adminMessage.textContent = data.message || 'No se pudo iniciar sesión';
    return;
  }

  token = data.token;
  localStorage.setItem('az_admin_token', token);
  adminMessage.textContent = 'Autenticación exitosa';
  unlockAdmin();
});

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!token) return;

  const form = Object.fromEntries(new FormData(productForm).entries());
  const payload = {
    ...form,
    price: Number(form.price),
    inventory: Number(form.inventory),
    sizes: form.sizes ? form.sizes.split(',').map((value) => value.trim()) : [],
    colors: form.colors ? form.colors.split(',').map((value) => value.trim()) : [],
    images: form.images.split(',').map((value) => value.trim()),
    featured: Boolean(form.featured),
    status: 'active'
  };

  const response = await fetch('/api/products', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    adminMessage.textContent = data.message || 'Error al guardar producto';
    return;
  }

  adminMessage.textContent = `Producto creado: ${data.name}`;
  productForm.reset();
  loadDashboard();
});

if (token) {
  unlockAdmin();
}
