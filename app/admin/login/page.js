"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("zaraAdminDemo") === "true") {
      window.location.replace("/admin/dashboard");
    }
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (username.trim() === "admin" && password === "admin123") {
      sessionStorage.setItem("zaraAdminDemo", "true");
      window.location.href = "/admin/dashboard";
    } else {
      setError("Username atau password salah.");
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <Link className="brand" href="/">ZARA <span>BEAUTY</span></Link>
        <p className="eyebrow">ADMINISTRATOR</p>
        <h1>Selamat datang</h1>
        <p className="muted">Masuk untuk melihat dashboard toko.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" required />
          <p className="error-message">{error}</p>
          <button className="primary-button" type="submit">LOGIN</button>
        </form>
        <div className="demo-info"><strong>Akun demo tampilan</strong><span>Username: admin</span><span>Password: admin123</span></div>
        <Link className="back-link" href="/">← Kembali ke halaman toko</Link>
      </div>
    </main>
  );
}
