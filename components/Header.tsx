"use client";

import { useState } from "react";
import { Search, ShoppingCart, Bell, ChevronDown } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function Header({ onSearch, searchQuery }: HeaderProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <header
      style={{
        background: "linear-gradient(135deg, #EE4D2D 0%, #FF6633 100%)",
        padding: "12px 16px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(238,77,45,0.3)",
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          <span
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: "22px",
              letterSpacing: "-0.5px",
              fontStyle: "italic",
            }}
          >
            TokoBest
          </span>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)", marginLeft: "2px" }}>
            .id
          </span>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            display: "flex",
            backgroundColor: "#fff",
            borderRadius: "4px",
            overflow: "hidden",
            maxWidth: "600px",
          }}
        >
          <input
            type="text"
            placeholder="Cari produk favoritmu..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              padding: "9px 12px",
              fontSize: "13px",
              color: "#333",
              backgroundColor: "transparent",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#EE4D2D",
              border: "none",
              padding: "9px 14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Search size={16} />
          </button>
        </form>

        {/* Right icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "#fff" }}>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "2px",
              fontSize: "12px",
              padding: 0,
            }}
          >
            <Bell size={20} />
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "2px",
              fontSize: "12px",
              padding: 0,
            }}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      {/* Category quick links */}
      <div
        style={{
          display: "flex",
          gap: "0",
          marginTop: "10px",
          maxWidth: "1200px",
          margin: "10px auto 0",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {["Flash Sale ⚡", "Gratis Ongkir", "Pilihan Terbaik", "Promo Hari Ini", "Koleksi Baru"].map(
          (label) => (
            <button
              key={label}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: "20px",
                padding: "4px 12px",
                fontSize: "11px",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                marginRight: "8px",
                flexShrink: 0,
              }}
            >
              {label}
            </button>
          )
        )}
      </div>
    </header>
  );
}
