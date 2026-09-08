"use client";

import { categories } from "@/data/products";

interface CategoryFilterProps {
  active: string;
  onChange: (id: string) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: "103px",
        zIndex: 90,
      }}
    >
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          scrollbarWidth: "none",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 12px",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            style={{
              padding: "12px 16px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: active === cat.id ? 700 : 400,
              color: active === cat.id ? "#EE4D2D" : "#555",
              whiteSpace: "nowrap",
              borderBottom: active === cat.id ? "2px solid #EE4D2D" : "2px solid transparent",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
