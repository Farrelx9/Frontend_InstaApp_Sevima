# InstaApp — Frontend

Frontend untuk **InstaApp**, aplikasi berbagi foto bergaya Instagram. Dibangun dengan **React 19** + **Vite**, terhubung ke REST API Laravel di repo terpisah.

Repo backend (Laravel API): [Backend_InstaApp_Sevima](https://github.com/Farrelx9/Backend_InstaApp_Sevima)

## Fitur

- **Register & Login** dengan autentikasi token, session tersimpan lewat token yang dikirim di setiap request (`Authorization: Bearer`).
- **Feed / Home** — melihat semua post dari semua user.
- **Buat post** — upload gambar dengan auto-crop ke rasio 1:1 (1080×1080) langsung di browser sebelum diunggah, plus caption.
- **Like** — tombol like biasa maupun **double-tap** di foto (seperti Instagram).
- **Komentar** — tambah dan hapus komentar.
- **Halaman detail post** — foto besar dengan dukungan **pinch-to-zoom** (mobile), **scroll-to-zoom** (desktop), dan drag untuk geser saat di-zoom.
- **Profile page** — melihat post milik satu user.
- **Hak akses di UI** — tombol hapus post/komentar hanya muncul untuk pemilik konten (tetap divalidasi ulang di backend).
- **Route protection** — halaman selain Login/Register hanya bisa diakses setelah login (`ProtectedRoute`).

## Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Animasi | Framer Motion |
| HTTP Client | Axios |
| Icon | Lucide React |
| Notifikasi | react-hot-toast |

## Struktur Halaman

| Route | Halaman | Keterangan |
|---|---|---|
| `/login` | `LoginPage` | Publik |
| `/register` | `RegisterPage` | Publik |
| `/` | `HomePage` | Feed utama — butuh login |
| `/create` | `CreatePostPage` | Buat post baru — butuh login |
| `/post/:id` | `PostDetailPage` | Detail post + komentar — butuh login |
| `/profile/:id?` | `ProfilePage` | Profil user — butuh login |

## Instalasi & Menjalankan Lokal

**Requirement:** Node.js 18+, dan backend API (lihat repo backend) sudah berjalan.

```bash
# 1. Clone repo
git clone https://github.com/Farrelx9/Frontend_InstaApp_Sevima.git
cd Frontend_InstaApp_Sevima

# 2. Install dependency
npm install
```

### 3. Konfigurasi Environment

Buat file `.env` di root folder project (sejajar dengan `package.json`), lalu isi dengan:

```env
VITE_API_URL=http://localhost:8000/api
VITE_STORAGE_URL=http://localhost:8000/storage
```

- `VITE_API_URL` — dipakai di `src/services/api.js` sebagai `baseURL` axios, untuk semua request ke endpoint API (login, posts, comments, dll).
- `VITE_STORAGE_URL` — dipakai untuk membangun URL gambar post (fungsi `getImageUrl`), mengarah ke folder `storage` publik Laravel (**tanpa** `/api`).

> **Penting:** Vite hanya membaca variabel env dengan prefix `VITE_`, dan **hanya di-load saat dev server pertama kali start**. Kalau `.env` diubah setelah `npm run dev` sudah jalan, wajib hentikan server (`Ctrl+C`) dan jalankan ulang `npm run dev` supaya perubahan terbaca.
>
> Sesuaikan nilai `VITE_API_URL` dan `VITE_STORAGE_URL` kalau backend Laravel dijalankan di alamat/port yang berbeda dari default.

### 4. Jalankan dev server

```bash
npm run dev
```

Aplikasi akan jalan di `http://localhost:5173`.

## Build untuk Produksi

```bash
npm run build
```

Hasil build ada di folder `dist/`, siap di-deploy ke static hosting (Vercel, Netlify, dsb). Jangan lupa set `VITE_API_URL` dan `VITE_STORAGE_URL` sesuai environment production (misal domain API yang sudah di-deploy) lewat pengaturan environment variable di platform hosting yang dipakai.
