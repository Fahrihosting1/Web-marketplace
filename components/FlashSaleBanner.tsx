"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export default function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 42, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 23, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #D0011B 0%, #EE4D2D 50%, #FF6633 100%)",
        padding: "10px 16px",
        maxWidth: "1200px",
        margin: "12px auto",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Zap size={20} fill="#FFE066" color="#FFE066" />
        <span style={{ fontWeight: 800, fontSize: "16px", letterSpacing: "0.5px" }}>
          FLASH SALE
        </span>
        <span style={{ fontSize: "12px", opacity: 0.9, marginLeft: "4px" }}>
          Diskon hingga 70%!
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <span style={{ fontSize: "11px", opacity: 0.9 }}>Berakhir dalam</span>
        {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((val, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <span
              style={{
                backgroundColor: "rgba(0,0,0,0.25)",
                color: "#fff",
                fontWeight: 800,
                fontSize: "14px",
                padding: "2px 6px",
                borderRadius: "4px",
                fontVariantNumeric: "tabular-nums",
                minWidth: "26px",
                textAlign: "center",
              }}
            >
              {val}
            </span>
            {i < 2 && <span style={{ fontWeight: 800 }}>:</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
