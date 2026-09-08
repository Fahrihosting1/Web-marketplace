"use client";

import { SlidersHorizontal } from "lucide-react";

interface SortBarProps {
  sort: string;
  onSort: (sort: string) => void;
  count: number;
}

const sortOptions = [
  { id: "popular", label: "Populer" },
  { id: "newest", label: "Terbaru" },
  { id: "price_asc", label: "Harga ↑" },
  { id: "price_desc", label: "Harga ↓" },
];

export default function SortBar({ sort, onSort, count }: SortBarProps) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "2px",
        maxWidth: "1200px",
        margin: "0 auto 8px",
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
      }}
    >
      <SlidersHorizontal size={14} color="#777" />
      <span style={{ fontSize: "12px", color: "#777", marginRight: "4px" }}>
        {count} produk
      </span>
      <div
        style={{
          display: "flex",
          gap: "0",
          marginLeft: "auto",
          overflowX: "auto",
        }}
      >
        {sortOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSort(opt.id)}
            style={{
              padding: "5px 10px",
              border: "1px solid",
              borderColor: sort === opt.id ? "#EE4D2D" : "#ddd",
              borderRadius: "4px",
              background: sort === opt.id ? "#EE4D2D" : "transparent",
              color: sort === opt.id ? "#fff" : "#555",
              fontSize: "11px",
              cursor: "pointer",
              marginLeft: "4px",
              whiteSpace: "nowrap",
              fontWeight: sort === opt.id ? 600 : 400,
              transition: "all 0.15s",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
