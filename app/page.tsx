"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import SortBar from "@/components/SortBar";
import ProductCard from "@/components/ProductCard";
import { products, Product } from "@/data/products";
import { PackageSearch } from "lucide-react";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Sort
    switch (sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      case "popular":
      default:
        result.sort((a, b) => b.sold - a.sold);
        break;
    }

    return result;
  }, [search, category, sort]);

  return (
    <div style={{ backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
      <Header onSearch={setSearch} searchQuery={search} />
      <CategoryFilter active={category} onChange={setCategory} />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 12px 80px",
        }}
      >
        <FlashSaleBanner />

        <SortBar sort={sort} onSort={setSort} count={filtered.length} />

        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#aaa",
            }}
          >
            <PackageSearch size={60} color="#ddd" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: "16px", color: "#999", marginBottom: "8px" }}>
              Produk tidak ditemukan
            </p>
            <p style={{ fontSize: "13px", color: "#bbb" }}>
              Coba kata kunci lain atau kategori berbeda
            </p>
            <button
              onClick={() => { setSearch(""); setCategory("all"); }}
              style={{
                marginTop: "16px",
                padding: "10px 24px",
                backgroundColor: "#EE4D2D",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "8px",
            }}
            className="product-grid"
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            marginTop: "32px",
            fontSize: "12px",
            color: "#bbb",
          }}
        >
          © 2025 TokoBest.id · Semua produk diverifikasi
        </p>
      </div>

      {/* Responsive grid for larger screens */}
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
