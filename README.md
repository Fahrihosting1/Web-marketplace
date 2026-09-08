# TokoBest.id - Marketplace Link Bio TikTok

Marketplace sederhana bergaya Shopee untuk ditaruh di link bio TikTok.

## 🚀 Deploy ke Vercel (5 menit)

### Cara 1: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

### Cara 2: Via GitHub + Vercel Dashboard
1. Push project ini ke GitHub
2. Buka [vercel.com](https://vercel.com) → New Project
3. Import repo GitHub kamu
4. Klik **Deploy** — selesai!

## 🛍️ Cara Edit Produk

Edit file `data/products.ts`:

```typescript
{
  id: 1,
  name: "Nama produk kamu",
  price: 89000,             // harga jual
  originalPrice: 150000,   // harga coret (opsional)
  image: "URL foto produk", // link foto dari mana saja
  category: "fashion",      // fashion / elektronik / kecantikan / rumah / makanan
  sold: 2341,               // jumlah terjual
  rating: 4.8,              // rating bintang
  location: "Jakarta",      // kota toko
  badge: "sale",            // "sale" | "hot" | "new" | hapus jika tidak ada
  url: "https://shopee.co.id/link-produk-kamu", // link produk Shopee/Tokopedia
}
```

## 📱 Fitur
- ✅ Tampilan mirip Shopee (grid 2 kolom di HP)
- ✅ Flash sale countdown timer
- ✅ Filter kategori
- ✅ Sort: Populer / Terbaru / Harga
- ✅ Search produk
- ✅ Badge: SALE / 🔥 LARIS / BARU
- ✅ Responsive (HP & desktop)
- ✅ Klik produk → langsung ke link Shopee/Tokopedia

## 🗂️ Struktur
```
├── app/           → halaman utama
├── components/    → Header, ProductCard, dll
├── data/          → products.ts (edit ini untuk produk)
└── public/        → aset statis
```
