"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "arateulLatestOrder";
const statuses = ["Menunggu konfirmasi admin", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];
const money = (value) => Number(value || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default function AdminDashboardPage() {
  const [ready, setReady] = useState(false);
  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("zaraAdminDemo") !== "true") {
      window.location.replace("/admin/login");
      return;
    }
    setReady(true);
    loadOrder();
    const onStorage = (event) => { if (event.key === KEY) loadOrder(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function loadOrder() {
    try {
      const raw = localStorage.getItem(KEY);
      const saved = raw ? JSON.parse(raw) : null;
      setOrder(saved);
      setSelectedStatus(saved?.status || statuses[0]);
    } catch {
      setOrder(null);
    }
  }

  function saveStatus() {
    if (!order) return;
    const updated = { ...order, status: selectedStatus };
    localStorage.setItem(KEY, JSON.stringify(updated));
    setOrder(updated);
    setNotice("Status pesanan berhasil diperbarui di browser ini.");
  }

  function logout() {
    sessionStorage.removeItem("zaraAdminDemo");
    window.location.href = "/admin/login";
  }

  if (!ready) return null;

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <Link className="brand" href="/">ZARA <span>BEAUTY</span></Link>
        <p className="sidebar-caption">ADMIN PANEL</p>
        <a className="nav-item active" href="#overview">Overview</a>
        <a className="nav-item" href="#orders">Pesanan</a>
        <a className="nav-item" href="#products">Produk</a>
        <Link className="nav-item" href="/">Lihat Toko</Link>
        <button id="logout-button" className="logout-button" onClick={logout}>Keluar</button>
      </aside>

      <main className="dashboard-main" id="overview">
        <header className="dashboard-header">
          <div><p className="eyebrow">OVERVIEW</p><h1>Dashboard</h1><p className="muted">Ringkasan aktivitas ZARA BEAUTY.</p></div>
          <div className="admin-profile"><span className="avatar">A</span><span>Administrator</span></div>
        </header>

        <section className="stats-grid">
          <article className="stat-card"><span>Pesanan Tersimpan</span><strong>{order ? "1" : "0"}</strong><small>Data browser ini</small></article>
          <article className="stat-card"><span>Menunggu Konfirmasi</span><strong>{order?.status === statuses[0] ? "1" : "0"}</strong><small>Data browser ini</small></article>
          <article className="stat-card"><span>Pesanan Diproses</span><strong>{order?.status === "Diproses" ? "1" : "0"}</strong><small>Data browser ini</small></article>
          <article className="stat-card"><span>Total Produk</span><strong>8</strong><small>Data demo</small></article>
        </section>

        <section className="panel" id="orders">
          <div className="panel-heading"><div><p className="eyebrow">ORDER MANAGEMENT</p><h2>Manajemen Pesanan</h2></div><span className="demo-tag">SIMULASI</span></div>
          {!order ? <p>Belum ada pesanan masuk. Buat pesanan dari halaman toko untuk melihatnya di sini.</p> : (
            <div className="order-card">
              <h3>Pesanan {order.id}</h3>
              <p>Nama pelanggan: {order.customerName}</p>
              <p>Total: {money(order.total)}</p>
              <p>Status saat ini: <strong>{order.status}</strong></p>
              <label htmlFor="order-status-select">Ubah Status Pesanan</label>
              <select id="order-status-select" value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setNotice(""); }}>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <button className="primary-button" onClick={saveStatus}>Simpan Status</button>
              {notice && <p className="table-note">{notice}</p>}
              <p className="table-note">Perubahan tersimpan pada localStorage browser ini, bukan pada server.</p>
            </div>
          )}
        </section>

        <section className="panel" id="products">
          <div className="panel-heading"><div><p className="eyebrow">PRODUCT MANAGEMENT</p><h2>Produk Toko</h2></div></div>
          <div className="product-preview">
            <div><strong>Velvet Matte Lipstick</strong><span>Lip · Rp 129.000</span></div>
            <div><strong>Perfect Glow Foundation</strong><span>Face · Rp 189.000</span></div>
            <div><strong>Natural Eyeshadow Palette</strong><span>Eyes · Rp 159.000</span></div>
            <div><strong>Hydrating Face Serum</strong><span>Skincare · Rp 175.000</span></div>
          </div>
          <p className="table-note">Daftar produk ini merupakan contoh tampilan.</p>
        </section>
      </main>
    </div>
  );
}
