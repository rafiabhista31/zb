"use client";

import { useEffect, useMemo, useState } from "react";

const products = [
  { id: 1, name: "Velvet Matte Lipstick", category: "Lip", price: 129000, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600" },
  { id: 2, name: "Natural Eyeshadow Palette", category: "Eyes", price: 159000, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600" },
  { id: 3, name: "Hydrating Face Serum", category: "Skincare", price: 175000, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600" },
  { id: 4, name: "Soft Blush Powder", category: "Face", price: 99000, image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600" },
  { id: 5, name: "Glossy Lip Tint", category: "Lip", price: 89000, image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600" },
  { id: 6, name: "Daily Moisturizer", category: "Skincare", price: 145000, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600" },
];
const STORAGE_KEY = "arateulLatestOrder";
const rupiah = (number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(number);

function OrderStatus({ order }) {
  if (!order) return <div className="status-empty"><span className="status-icon">♡</span><h3>Belum ada pesanan</h3><p>Status pesananmu akan muncul di sini setelah checkout berhasil dikirim.</p></div>;
  return (
    <>
      <div className="status-topline">
        <div><p className="status-label">NOMOR PESANAN</p><strong className="order-number">{order.id}</strong></div>
        <span className="status-pill">{order.status}</span>
      </div>
      <h3>{order.status}</h3>
      <p>Hai {order.customerName}, status pesananmu saat ini adalah {order.status}.</p>
      <div className="status-meta"><span>Total sementara</span><strong>{rupiah(Number(order.total) || 0)}</strong></div>
      <small>Dibuat: {order.createdAt || "-"}</small>
      <p className="status-disclaimer">Status pesanan diperbarui oleh admin. Data demo tersimpan di browser ini.</p>
    </>
  );
}

export default function HomePage() {
  const [category, setCategory] = useState("All");
  const [keyword, setKeyword] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", payment: "", notes: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setOrder(JSON.parse(saved));
    } catch {}
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        try { setOrder(event.newValue ? JSON.parse(event.newValue) : null); } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const q = keyword.toLowerCase();
    return matchesCategory && (product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q));
  }), [category, keyword]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  }

  function addToCart(id) {
    const product = products.find((item) => item.id === id);
    setCart((current) => {
      const exists = current.find((item) => item.id === id);
      return exists ? current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }];
    });
    notify(`${product.name} berhasil ditambahkan ke keranjang!`);
  }

  function changeQuantity(id, amount) {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0));
  }

  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function submitCheckout(event) {
    event.preventDefault();
    if (!cart.length) return notify("Keranjang belanja masih kosong!");

    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replaceAll("-", "");
    const orderId = `ZB-${datePart}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      customerName: form.name,
      total,
      status: "Menunggu konfirmasi admin",
      createdAt: now.toLocaleString("id-ID"),
    };
    const orderDetails = cart.map((item) => `- ${item.name} x${item.quantity} = ${rupiah(item.price * item.quantity)}`).join("\\n");
    const message = `*PESANAN BARU - ZARA BEAUTY*\\n\\n*DATA PELANGGAN*\\nNama: ${form.name}\\nWhatsApp: ${form.phone}\\nEmail: ${form.email || "-"}\\n\\n*ALAMAT PENGIRIMAN*\\n${form.address}\\n\\n*DETAIL PESANAN*\\n${orderDetails}\\n\\n*Subtotal: ${rupiah(total)}*\\nMetode pembayaran: ${form.payment}\\n\\nCatatan: ${form.notes || "-"}\\n\\nMohon konfirmasi total akhir, ongkir, dan instruksi pembayaran.`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
    setOrder(newOrder);
    window.open(`https://wa.me/6285888731786?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setCart([]);
    setForm({ name: "", phone: "", email: "", address: "", payment: "", notes: "" });
    setCheckoutOpen(false);
    notify("Pesanan berhasil disiapkan. Menunggu konfirmasi admin.");
    window.setTimeout(() => document.getElementById("order-status")?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  return (
    <>
      <header className="navbar">
        <a href="#home" className="logo">ZARA <span>BEAUTY</span></a>
        <nav><a href="#home">Home</a><a href="#products">Products</a><a href="#about">About</a><a href="#order-status">Status Pesanan</a></nav>
        <button className="cart-button" onClick={() => setCartOpen(true)}>Bag (<span>{count}</span>)</button>
      </header>

      <section className="hero" id="home">
        <div className="hero-content"><p className="eyebrow">BEAUTY STARTS WITH YOU</p><h1>Discover Your<br /><em>Natural Beauty</em></h1><p>Temukan produk kecantikan pilihan untuk menemani setiap versi terbaik dirimu.</p><a href="#products" className="primary-button">SHOP NOW</a></div>
      </section>

      <section className="categories">
        <p className="eyebrow">EXPLORE OUR COLLECTION</p><h2>Find Your Beauty Essentials</h2>
        <div className="category-list">
          {["All", "Lip", "Face", "Eyes", "Skincare"].map((item) => <button key={item} className={`category ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="section-heading"><div><p className="eyebrow">OUR BEST PICKS</p><h2>Shop Our Products</h2></div><input type="search" placeholder="Search products..." value={keyword} onChange={(event) => setKeyword(event.target.value)} /></div>
        <div className="product-grid">
          {visibleProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={product.name} loading="lazy" /></div><div className="product-info"><p className="product-category">{product.category}</p><h3>{product.name}</h3><p className="product-price">{rupiah(product.price)}</p><button className="add-button" onClick={() => addToCart(product.id)}>ADD TO BAG +</button></div></article>)}
          {!visibleProducts.length && <p>Produk tidak ditemukan.</p>}
        </div>
      </section>

      <section className="about" id="about"><p className="eyebrow">ABOUT ZARA BEAUTY</p><h2>Beauty Starts With You</h2><p>Temukan pilihan produk kecantikan untuk mendukung rasa percaya diri dan ekspresi terbaikmu setiap hari.</p></section>

      <section className="order-status-section" id="order-status"><p className="eyebrow">ORDER UPDATE</p><h2>Status Pesanan</h2><div className="order-status-card" id="order-status-card"><OrderStatus order={order} /></div></section>

      <footer><a href="#home" className="logo">ZARA <span>BEAUTY</span></a><a href="/admin/login" className="admin-footer-link">Admin</a><p>© 2026 ZARA BEAUTY. All rights reserved.</p></footer>

      {cartOpen && <><div className="overlay show" onClick={() => setCartOpen(false)} /><aside className="cart-panel open"><div className="cart-header"><h2>Your Shopping Bag</h2><button onClick={() => setCartOpen(false)}>✕</button></div><div id="cart-items">{cart.length === 0 ? <p>Keranjang belanjamu masih kosong.</p> : cart.map((item) => <div className="cart-item" key={item.id}><div><h4>{item.name}</h4><p>{rupiah(item.price)}</p><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)}>-</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)}>+</button></div></div><button className="remove-button" onClick={() => setCart((current) => current.filter((x) => x.id !== item.id))}>Hapus</button></div>)}</div><div className="cart-bottom"><div className="subtotal"><span>Subtotal</span><strong>{rupiah(total)}</strong></div><button className="primary-button full-button" onClick={() => { if (!cart.length) return notify("Keranjang belanja masih kosong!"); setCartOpen(false); setCheckoutOpen(true); }}>CHECKOUT</button></div></aside></>}

      {checkoutOpen && <div className="modal-overlay show" onClick={() => setCheckoutOpen(false)}><div className="checkout-modal" onClick={(event) => event.stopPropagation()}><div className="modal-banner"><div className="modal-banner-content"><p>ZARA BEAUTY</p><h2>Your Beauty,<br />Your Confidence.</h2><span>BEAUTY STARTS WITH YOU</span></div></div><div className="modal-form-content"><button type="button" className="close-modal" onClick={() => setCheckoutOpen(false)}>✕</button><p className="eyebrow">ALMOST YOURS</p><h2>Complete Your Order</h2><p className="modal-description">Isi informasi berikut untuk melanjutkan pesanan.</p>
        <form onSubmit={submitCheckout}>
          <label htmlFor="customer-name">Nama Lengkap *</label><input id="customer-name" name="name" value={form.name} onChange={updateForm} required placeholder="Nama lengkap" />
          <label htmlFor="customer-phone">Nomor WhatsApp *</label><input id="customer-phone" name="phone" type="tel" value={form.phone} onChange={updateForm} required placeholder="08xxxxxxxxxx" />
          <label htmlFor="customer-email">Email</label><input id="customer-email" name="email" type="email" value={form.email} onChange={updateForm} placeholder="email@example.com" />
          <label htmlFor="customer-address">Alamat Lengkap *</label><textarea id="customer-address" name="address" value={form.address} onChange={updateForm} required placeholder="Nama jalan, nomor rumah, kecamatan, kota, kode pos" />
          <label htmlFor="payment-method">Metode Pembayaran *</label><select id="payment-method" name="payment" value={form.payment} onChange={updateForm} required><option value="">Pilih metode pembayaran</option><option>Transfer Bank</option><option>QRIS</option><option>COD (jika tersedia)</option></select>
          <label htmlFor="order-notes">Catatan Pesanan</label><textarea id="order-notes" name="notes" value={form.notes} onChange={updateForm} placeholder="Catatan tambahan (opsional)" />
          <div className="checkout-total"><span>Total sementara</span><strong>{rupiah(total)}</strong></div>
          <label className="agreement"><input type="checkbox" required /><span>Saya memastikan informasi pesanan sudah benar.</span></label>
          <p className="security-note">Jangan kirim PIN, password, CVV, atau kode OTP. Admin akan mengirimkan instruksi pembayaran setelah pesanan dikonfirmasi.</p>
          <button type="submit" className="primary-button full-button">KONFIRMASI VIA WHATSAPP</button>
        </form>
      </div></div></div>}

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </>
  );
}
