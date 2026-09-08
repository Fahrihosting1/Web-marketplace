"use client";

import Image from "next/image";
import { Product, formatPrice, formatSold, getDiscount } from "@/data/products";
import { Star, MapPin, X, ShoppingCart, MessageCircle, ChevronLeft } from "lucide-react";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const badgeConfig = {
  sale: { label: "SALE", bg: "#D0011B" },
  hot: { label: "🔥 LARIS", bg: "#FF6633" },
  new: { label: "BARU", bg: "#26AA99" },
};

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const discount = product.originalPrice
    ? getDiscount(product.price, product.originalPrice)
    : 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#F5F5F5",
        zIndex: 1000,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#EE4D2D",
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          gap: "12px",
          zIndex: 10,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <span style={{ color: "#fff", fontSize: "16px", fontWeight: 600 }}>Detail Produk</span>
      </div>

      {/* Product image */}
      <div style={{ position: "relative", width: "100%", paddingBottom: "100%", backgroundColor: "#fff" }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
        {product.badge && (
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              backgroundColor: badgeConfig[product.badge].bg,
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            {badgeConfig[product.badge].label}
          </span>
        )}
        {discount > 0 && (
          <span
            style={{
              position: "absolute",
              top: product.badge ? 44 : 12,
              left: 12,
              backgroundColor: "#D0011B",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            -{discount}%
          </span>
        )}
      </div>

      {/* Product info */}
      <div style={{ backgroundColor: "#fff", padding: "16px", marginBottom: "8px" }}>
        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
          <span style={{ color: "#EE4D2D", fontWeight: 700, fontSize: "22px" }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span style={{ color: "#bbb", fontSize: "14px", textDecoration: "line-through" }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {discount > 0 && (
            <span
              style={{
                backgroundColor: "#FFEEEE",
                color: "#EE4D2D",
                fontSize: "12px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Name */}
        <p style={{ fontSize: "15px", color: "#212121", lineHeight: "1.5", marginBottom: "12px", fontWeight: 500 }}>
          {product.name}
        </p>

        {/* Rating & Sold */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {[1,2,3,4,5].map((s) => (
              <Star
                key={s}
                size={14}
                fill={s <= Math.round(product.rating) ? "#FF9F00" : "#ddd"}
                color={s <= Math.round(product.rating) ? "#FF9F00" : "#ddd"}
              />
            ))}
          </div>
          <span style={{ fontSize: "13px", color: "#555", fontWeight: 600 }}>{product.rating}</span>
          <span style={{ color: "#ddd" }}>|</span>
          <span style={{ fontSize: "13px", color: "#555" }}>Terjual {formatSold(product.sold)}</span>
        </div>
      </div>

      {/* Seller info */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "14px 16px",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#EE4D2D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: "16px",
            flexShrink: 0,
          }}
        >
          {product.location[0]}
        </div>
        <div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#212121", marginBottom: "2px" }}>
            Toko {product.location}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <MapPin size={11} color="#999" />
            <span style={{ fontSize: "12px", color: "#999" }}>{product.location}</span>
          </div>
        </div>
      </div>

      {/* Description placeholder */}
      <div style={{ backgroundColor: "#fff", padding: "14px 16px", marginBottom: "80px" }}>
        <p style={{ fontSize: "14px", fontWeight: 700, color: "#212121", marginBottom: "8px" }}>
          Deskripsi Produk
        </p>
        <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.6" }}>
          {product.name}. Produk berkualitas tinggi dengan garansi kepuasan pelanggan.
          Pengiriman cepat ke seluruh Indonesia. Hubungi penjual untuk info lebih lanjut.
        </p>
      </div>

      {/* Bottom action bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          padding: "12px 16px",
          display: "flex",
          gap: "10px",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <button
          style={{
            flex: 1,
            padding: "12px",
            border: "1.5px solid #EE4D2D",
            borderRadius: "6px",
            backgroundColor: "#fff",
            color: "#EE4D2D",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <MessageCircle size={16} />
          Chat
        </button>
        <button
          style={{
            flex: 2,
            padding: "12px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#EE4D2D",
            color: "#fff",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <ShoppingCart size={16} />
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}
