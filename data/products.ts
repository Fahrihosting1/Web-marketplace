export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  sold: number;
  rating: number;
  location: string;
  badge?: "sale" | "new" | "hot";
  url: string;
}

export const categories = [
  { id: "all", label: "Semua" },
  { id: "fashion", label: "Fashion" },
  { id: "elektronik", label: "Elektronik" },
  { id: "kecantikan", label: "Kecantikan" },
  { id: "rumah", label: "Rumah" },
  { id: "makanan", label: "Makanan" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Tas Selempang Wanita Premium Aesthetic Kulit PU Anti Air",
    price: 89000,
    originalPrice: 150000,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    category: "fashion",
    sold: 2341,
    rating: 4.8,
    location: "Jakarta",
    badge: "sale",
    url: "https://shopee.co.id",
  },
  {
    id: 2,
    name: "Earbuds TWS Bluetooth 5.3 Bass Kencang Tahan Air IPX5",
    price: 129000,
    originalPrice: 299000,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
    category: "elektronik",
    sold: 5820,
    rating: 4.9,
    location: "Surabaya",
    badge: "hot",
    url: "https://shopee.co.id",
  },
  {
    id: 3,
    name: "Serum Vitamin C 20% Brightening Glowing Anti Kusam Korea",
    price: 45000,
    originalPrice: 85000,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
    category: "kecantikan",
    sold: 9102,
    rating: 4.7,
    location: "Bandung",
    badge: "sale",
    url: "https://shopee.co.id",
  },
  {
    id: 4,
    name: "Sneakers Pria Wanita Putih Kasual Trendy Sepatu Olahraga",
    price: 185000,
    originalPrice: 350000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    category: "fashion",
    sold: 3450,
    rating: 4.6,
    location: "Bekasi",
    badge: "sale",
    url: "https://shopee.co.id",
  },
  {
    id: 5,
    name: "Aesthetic Desk Lamp LED Wireless Charger 3in1 Study Lamp",
    price: 219000,
    originalPrice: 400000,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
    category: "rumah",
    sold: 1230,
    rating: 4.8,
    location: "Tangerang",
    badge: "new",
    url: "https://shopee.co.id",
  },
  {
    id: 6,
    name: "Boba Milk Tea Premium Sirup Kekinian 500ml Ready to Drink",
    price: 28000,
    originalPrice: undefined,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    category: "makanan",
    sold: 7800,
    rating: 4.9,
    location: "Jakarta",
    badge: "hot",
    url: "https://shopee.co.id",
  },
  {
    id: 7,
    name: "Smartwatch Pria Wanita AMOLED Monitor Kesehatan Sport",
    price: 349000,
    originalPrice: 599000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    category: "elektronik",
    sold: 4100,
    rating: 4.7,
    location: "Depok",
    badge: "sale",
    url: "https://shopee.co.id",
  },
  {
    id: 8,
    name: "Celana Cargo Pria Tactical Outdoor Multi Pocket Slim Fit",
    price: 159000,
    originalPrice: 280000,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80",
    category: "fashion",
    sold: 2210,
    rating: 4.5,
    location: "Bogor",
    url: "https://shopee.co.id",
  },
  {
    id: 9,
    name: "Lip Tint Korea Velvet Matte Tahan Lama 12 Jam Moisturizing",
    price: 35000,
    originalPrice: 65000,
    image: "https://images.unsplash.com/photo-1586495777744-4e6232bf4b65?w=400&q=80",
    category: "kecantikan",
    sold: 12000,
    rating: 4.8,
    location: "Medan",
    badge: "hot",
    url: "https://shopee.co.id",
  },
  {
    id: 10,
    name: "Mini Blender Portable Juicer USB Rechargeable 6 Pisau",
    price: 89000,
    originalPrice: 150000,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80",
    category: "rumah",
    sold: 5670,
    rating: 4.6,
    location: "Semarang",
    badge: "sale",
    url: "https://shopee.co.id",
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatSold(sold: number): string {
  if (sold >= 1000) return `${(sold / 1000).toFixed(1)}rb`;
  return sold.toString();
}

export function getDiscount(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
