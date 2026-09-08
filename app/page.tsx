"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import CategoryFilter from "@/components/CategoryFilter";
import Header from "@/components/Header";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import SortBar from "@/components/SortBar";
import { products as allProducts, Product } from "@/data/products";

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  // Filter produk berdasarkan kategori + search, lalu sort
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by search query (real-time)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price_asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort((a, b) => b.id - a.id);
        break;
      case "popular":
      default:
        result = [...result].sort((a, b) => b.sold - a.sold);
        break;
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div style={{ backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
      {/* Header — pass searchQuery supaya input sync */}
      <Header
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* Flash Sale Banner */}
      <FlashSaleBanner />

      {/* Category Filter tabs */}
      <CategoryFilter active={activeCategory} onChange={(cat) => {
        setActiveCategory(cat);
      }} />

      {/* Sort Bar */}
      <SortBar sort={sortBy} onSort={setSortBy} count={filteredProducts.length} />

      {/* Product Grid */}
      <div style={{ padding: "0 12px 80px" }}>
        {filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#999",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Produk tidak ditemukan</p>
            <p style={{ fontSize: 13, marginTop: 6, color: "#bbb" }}>
              Coba kata kunci lain atau pilih kategori berbeda
            </p>
          </div>
        ) : (
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
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail fullscreen modal */}
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
