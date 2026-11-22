# ZARA BEAUTY — Next.js

Proyek ini adalah konversi tampilan HTML/CSS/JavaScript ZARA BEAUTY ke Next.js App Router.

## Menjalankan di komputer

1. Install Node.js versi LTS.
2. Ekstrak folder proyek.
3. Buka folder `zara-beauty-nextjs` di VS Code.
4. Jalankan terminal di folder tersebut:

```bash
npm install
npm run dev
```

5. Buka http://localhost:3000

## Halaman

- `/` — halaman toko pelanggan
- `/admin/login` — login admin
- `/admin/dashboard` — dashboard admin

Akun demo:
- Username: `admin`
- Password: `admin123`

## Deploy ke Vercel

1. Upload folder proyek ini ke repository GitHub.
2. Masuk ke https://vercel.com dan login menggunakan GitHub.
3. Pilih **Add New → Project**.
4. Import repository ZARA BEAUTY.
5. Framework akan terdeteksi sebagai Next.js.
6. Klik **Deploy**.

Tidak perlu mengisi Environment Variables untuk versi demo ini.

## Catatan penting

- Data pesanan dan status menggunakan `localStorage`. Data hanya tersedia pada browser/perangkat dan origin yang sama.
- Admin tidak dapat mengubah status pesanan pelanggan dari perangkat berbeda pada versi ini.
- Login admin hanya simulasi frontend. Username dan password demo dapat dilihat dari source code/browser, sehingga jangan gunakan untuk toko produksi.
- Agar pesanan dan status tersinkron antarperangkat serta login aman, proyek perlu backend/database dan autentikasi server.
- Nomor WhatsApp bisnis saat ini masih mengikuti nomor contoh dari file sumber: `6285888731786`. Ganti di `app/page.js` jika diperlukan.
