"use client";

import Image from "next/image";
import { Product, formatPrice, formatSold, getDiscount } from "@/data/products";
import { Star, MapPin } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const badgeConfig = {
  sale: { label: "SALE", bg: "#D0011B" },
  hot: { label: "🔥 LARIS", bg: "#FF6633" },
  new: { label: "BARU", bg: "#26AA99" },
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const discount = product.originalPrice
    ? getDiscount(product.price, product.originalPrice)
    : 0;

  return (
    <div
      onClick={onClick}
      className="product-card"
      style={{
        display: "block",
        backgroundColor: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        position: "relative",
        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
        transition: "transform 0.15s, box-shadow 0.15s",
        cursor: "pointer",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", paddingBottom: "100%", backgroundColor: "#f5f5f5" }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{ objectFit: "cover" }}
          unoptimized
        />

        {/* Badge */}
        {product.badge && (
          <span
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              backgroundColor: badgeConfig[product.badge].bg,
              color: "#fff",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: "3px",
              letterSpacing: "0.02em",
            }}
          >
            {badgeConfig[product.badge].label}
          </span>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span
            style={{
              position: "absolute",
              top: product.badge ? 30 : 6,
              left: 6,
              backgroundColor: "#D0011B",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 5px",
              borderRadius: "3px",
            }}
          >
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "8px" }}>
        <p
          className="line-clamp-2"
          style={{
            fontSize: "13px",
            lineHeight: "1.4",
            color: "#212121",
            marginBottom: "6px",
            minHeight: "36px",
          }}
        >
          {product.name}
        </p>

        <div style={{ marginBottom: "4px" }}>
          <span style={{ color: "#EE4D2D", fontWeight: 700, fontSize: "15px" }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span
              style={{
                color: "#bbb",
                fontSize: "11px",
                textDecoration: "line-through",
                marginLeft: "4px",
              }}
            >
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
          <Star size={11} fill="#FF9F00" color="#FF9F00" />
          <span style={{ fontSize: "11px", color: "#555" }}>{product.rating}</span>
          <span style={{ fontSize: "11px", color: "#bbb" }}>|</span>
          <span style={{ fontSize: "11px", color: "#555" }}>Terjual {formatSold(product.sold)}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <MapPin size={10} color="#999" />
          <span style={{ fontSize: "11px", color: "#999" }}>{product.location}</span>
        </div>
      </div>

      <style>{`
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  );
}
