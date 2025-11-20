// Simple client-side interactions for the example site.
// Product data (static, trustworthy descriptions)
const PRODUCTS = {
  1: {id:1, title:"mini cake", price:25000, description:"ini cake dengan ukuran yang kecil dan cocok untuk hadiah.",image:"/cake.jpg"},
  2: {id:2, title:"cupcake", price:50000, description:"Tampilan yang cantik dengan rasa vanila cream diatasnya.",image:"/cupcake.jpg"},
  3: {id:3, title:"monskis", price:20000, description:"cookies dengan ukuran yang kecil dan coklat yang melimpah", image:"/cookies.jpg"}
};

// Render product details on product.html
function renderProductFromQuery(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || '1';
  const p = PRODUCTS[id];
  const area = document.getElementById('product-area');
  if(!p){ area.innerHTML = '<p>Produk tidak ditemukan.</p>'; return; }
  area.innerHTML = `<div class="row">
    <div class="col-md-4"><div class="placeholder-img" style="height:220px"><img src="${p.image}" class="img-fluid rounded" alt="${p.title}"></div></div>
    <div class="col-md-6">
      <h2>${p.title}</h2>
      <p>${p.description}</p>
      <p class="fw-bold">Rp ${p.price.toLocaleString('id-ID')}</p>
      <form id="orderForm" class="row g-2">
        <div class="col-6"><label>Qty</label><input type="number" id="qty" value="1" min="1" class="form-control"></div>
        <div class="col-6"><label>&nbsp;</label><button class="btn btn-primary w-100" id="btn_simpan" type="button">Tambah ke Keranjang</button></div>
      </form>
      <div id="orderResult" class="mt-3"></div>
    </div>
  </div>`;
  document.getElementById('btn_simpan').addEventListener('click', ()=>{
    const qty = parseInt(document.getElementById('qty').value) || 1;
    const total = qty * p.price;
    const order = {productId:p.id, title:p.title, qty, total};
    // Simpan sementara di localStorage
    const cart = JSON.parse(localStorage.getItem('tokoku_cart')||'[]');
    cart.push(order);
    localStorage.setItem('tokoku_cart', JSON.stringify(cart));
    document.getElementById('orderResult').innerHTML = `<div class="alert alert-success">Berhasil ditambahkan: ${qty} x ${p.title} — Total Rp ${total.toLocaleString('id-ID')}</div>`;
  });
}

// Register form handler
function setupRegisterForm(){
  const form = document.getElementById('registerForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{ e.preventDefault(); });
  document.getElementById('btn_register').addEventListener('click', ()=>{
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const pwd = document.getElementById('password').value;
    if(!name || !email || pwd.length<6){
      document.getElementById('registerResult').innerHTML = '<div class="alert alert-danger">Periksa kembali input.</div>';
      return;
    }
    const users = JSON.parse(localStorage.getItem('tokoku_users')||'[]');
    users.push({name,email,created:new Date().toISOString()});
    localStorage.setItem('tokoku_users', JSON.stringify(users));
    document.getElementById('registerResult').innerHTML = '<div class="alert alert-success">Pendaftaran berhasil. Data tersimpan sementara.</div>';
    form.reset();
  });
}

// Contact / guestbook handler
function setupContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{ e.preventDefault(); });
  document.getElementById('btn_contact').addEventListener('click', ()=>{
    const name = document.getElementById('guestName').value.trim();
    const email = document.getElementById('guestEmail').value.trim();
    const msg = document.getElementById('message').value.trim();
    if(!name || !email || !msg){ alert('Lengkapi form.'); return; }
    const list = JSON.parse(localStorage.getItem('tokoku_guestbook')||'[]');
    list.unshift({name,email,msg,date:new Date().toLocaleString()});
    localStorage.setItem('tokoku_guestbook', JSON.stringify(list));
    renderGuestbook();
    form.reset();
  });
}

function renderGuestbook(){
  const list = JSON.parse(localStorage.getItem('tokoku_guestbook')||'[]');
  const container = document.getElementById('guestbookList');
  if(!container) return;
  if(list.length===0){ container.innerHTML = '<p>Belum ada pesan.</p>'; return; }
  container.innerHTML = list.map(item=>`<div class="card mb-2"><div class="card-body"><h6>${item.name} <small class="text-muted">(${item.date})</small></h6><p>${item.msg}</p></div></div>`).join('');
}

// Initialize page-specific things
document.addEventListener('DOMContentLoaded', ()=>{
  renderProductFromQuery();
  setupRegisterForm();
  setupContactForm();
  renderGuestbook();
});