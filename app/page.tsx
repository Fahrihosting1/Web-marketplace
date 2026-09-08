"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import { products, Product } from "@/data/products";

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div style={{ backgroundColor: "#F5F5F5", minHeight: "100vh", padding: "12px 12px 80px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "8px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
        className="product-grid"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <style>{`
        @media (min-width: 480px) {
          .product-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 768px) {
          .product-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .product-grid { grid-template-columns: repeat(5, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
