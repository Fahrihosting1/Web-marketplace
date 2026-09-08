"use client";

import { useState, useEffect, useRef } from "react";
import { products as initialProducts, categories, Product, formatPrice } from "@/data/products";

// ─── Types ────────────────────────────────────────────────────────────────────
type Badge = "sale" | "hot" | "new" | undefined;
type SortField = "id" | "name" | "price" | "sold";
type SortDir = "asc" | "desc";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

const BADGE_OPTIONS: { value: Badge; label: string; color: string }[] = [
  { value: undefined, label: "Tidak ada", color: "#999" },
  { value: "sale", label: "SALE", color: "#D0011B" },
  { value: "hot", label: "🔥 LARIS", color: "#FF6633" },
  { value: "new", label: "BARU", color: "#26AA99" },
];

const CAT_OPTIONS = categories.filter((c) => c.id !== "all");

const emptyProduct = (): Omit<Product, "id"> => ({
  name: "",
  price: 0,
  originalPrice: undefined,
  image: "",
  category: "fashion",
  sold: 0,
  rating: 5.0,
  location: "",
  badge: undefined,
  url: "",
});

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string | number; sub?: string; icon: string; accent: string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 60); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "20px 22px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      border: "1px solid #F0F0F0",
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.35s ease, transform 0.35s ease",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: accent + "18", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: accent, marginTop: 2, fontWeight: 600 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function ToastItem({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300); }, 2800);
    return () => clearTimeout(t);
  }, []);
  const colors: Record<string, string> = { success: "#42B549", error: "#D0011B", info: "#2563EB" };
  const icons: Record<string, string> = { success: "✓", error: "✕", info: "i" };
  return (
    <div style={{
      background: "#fff",
      borderRadius: 10,
      padding: "12px 18px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
      border: `1.5px solid ${colors[toast.type]}30`,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(60px)",
      transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
      marginBottom: 8, minWidth: 240,
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: "50%",
        background: colors[toast.type], color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, flexShrink: 0,
      }}>{icons[toast.type]}</span>
      <span style={{ fontSize: 13, color: "#333", flex: 1 }}>{toast.message}</span>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, title, onClose, children }: {
  open: boolean; title: string; onClose: () => void; children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (open) { setTimeout(() => setShow(true), 10); }
    else { setShow(false); }
  }, [open]);
  if (!open && !show) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }}>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.45)",
        opacity: show ? 1 : 0,
        transition: "opacity 0.25s ease",
        backdropFilter: "blur(2px)",
      }} />
      <div style={{
        position: "relative", background: "#fff",
        borderRadius: 16, width: "100%", maxWidth: 560,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        opacity: show ? 1 : 0,
        transform: show ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
        transition: "all 0.28s cubic-bezier(.4,0,.2,1)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 16px",
          borderBottom: "1px solid #F0F0F0",
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{title}</h3>
          <button onClick={onClose} style={{
            background: "#F5F5F5", border: "none", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#555", transition: "background 0.15s",
          }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, required, children, hint }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#D0011B", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#999" }}>{hint}</p>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #E8E8E8",
  borderRadius: 8, fontSize: 13, color: "#333",
  outline: "none", background: "#fff", boxSizing: "border-box",
  transition: "border-color 0.15s",
  fontFamily: "inherit",
};

// ─── ProductForm ──────────────────────────────────────────────────────────────
function ProductForm({ data, onChange }: {
  data: Omit<Product, "id"> & { id?: number };
  onChange: (d: Omit<Product, "id"> & { id?: number }) => void;
}) {
  const set = (field: string, value: unknown) => onChange({ ...data, [field]: value });

  const [detecting, setDetecting] = useState(false);
  const [detectMsg, setDetectMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const detectFromUrl = async () => {
    if (!data.url.trim()) {
      setDetectMsg({ type: "error", text: "Isi URL link produk dulu ya" });
      return;
    }
    setDetecting(true);
    setDetectMsg(null);
    try {
      const res = await fetch(`/api/scrape-product?url=${encodeURIComponent(data.url.trim())}`);
      const json = await res.json();

      if (!res.ok || json.error) {
        setDetectMsg({ type: "error", text: json.error ?? "Gagal mendeteksi produk dari URL ini" });
        return;
      }

      const updates: Partial<Omit<Product, "id">> = {};
      if (json.name && !data.name.trim()) updates.name = json.name;
      if (json.image) updates.image = json.image;
      if (json.price) updates.price = json.price;
      onChange({ ...data, ...updates });

      if (json.warning) {
        setDetectMsg({ type: "info", text: json.warning });
      } else {
        setDetectMsg({ type: "success", text: "Nama, foto & harga berhasil dideteksi ✓" });
      }
    } catch {
      setDetectMsg({ type: "error", text: "Gagal menghubungi server, coba lagi" });
    } finally {
      setDetecting(false);
    }
  };

  const msgColor = { success: "#26AA99", error: "#D0011B", info: "#2563EB" };

  return (
    <div>
      <Field label="URL Link Produk" required hint="Tempel link Shopee/Tokopedia/dll, lalu klik Deteksi Otomatis">
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...inputStyle, flex: 1 }} value={data.url}
            onChange={e => set("url", e.target.value)}
            placeholder="https://shopee.co.id/..." />
          <button
            type="button"
            onClick={detectFromUrl}
            disabled={detecting}
            style={{
              flexShrink: 0,
              padding: "0 16px",
              borderRadius: 8,
              border: "none",
              background: detecting ? "#F0A98A" : "linear-gradient(135deg,#EE4D2D,#FF6633)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: detecting ? "default" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {detecting ? "Mendeteksi..." : "🔍 Deteksi Otomatis"}
          </button>
        </div>
        {detectMsg && (
          <p style={{ margin: "6px 0 0", fontSize: 11.5, color: msgColor[detectMsg.type], fontWeight: 600 }}>
            {detectMsg.text}
          </p>
        )}
      </Field>

      <Field label="Nama Produk" required>
        <input style={inputStyle} value={data.name}
          onChange={e => set("name", e.target.value)}
          placeholder="Masukkan nama produk..." />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Harga Jual" required>
          <input style={inputStyle} type="number" value={data.price || ""}
            onChange={e => set("price", Number(e.target.value))}
            placeholder="89000" />
        </Field>
        <Field label="Harga Coret" hint="Opsional">
          <input style={inputStyle} type="number" value={data.originalPrice || ""}
            onChange={e => set("originalPrice", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="150000" />
        </Field>
      </div>

      <Field label="URL Foto Produk" required hint="Terisi otomatis setelah deteksi, atau isi manual">
        <input style={inputStyle} value={data.image}
          onChange={e => set("image", e.target.value)}
          placeholder="https://..." />
        {data.image && (
          <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", height: 100, background: "#f5f5f5" }}>
            <img src={data.image} alt="preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        )}
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Kategori">
          <select style={{ ...inputStyle, cursor: "pointer" }} value={data.category}
            onChange={e => set("category", e.target.value)}>
            {CAT_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Badge">
          <select style={{ ...inputStyle, cursor: "pointer" }}
            value={data.badge ?? ""}
            onChange={e => set("badge", e.target.value || undefined)}>
            {BADGE_OPTIONS.map(b => (
              <option key={String(b.value)} value={b.value ?? ""}>{b.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Field label="Terjual">
          <input style={inputStyle} type="number" value={data.sold || ""}
            onChange={e => set("sold", Number(e.target.value))} placeholder="0" />
        </Field>
        <Field label="Rating">
          <input style={inputStyle} type="number" step="0.1" min="1" max="5"
            value={data.rating || ""} onChange={e => set("rating", Number(e.target.value))}
            placeholder="4.8" />
        </Field>
        <Field label="Kota">
          <input style={inputStyle} value={data.location}
            onChange={e => set("location", e.target.value)} placeholder="Jakarta" />
        </Field>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ open, name, onConfirm, onClose }: {
  open: boolean; name: string; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Modal open={open} title="Hapus Produk" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
        <p style={{ fontSize: 14, color: "#444", marginBottom: 6 }}>
          Hapus produk ini secara permanen?
        </p>
        <p style={{
          fontSize: 13, fontWeight: 700, color: "#1a1a2e",
          background: "#F5F5F5", padding: "8px 16px", borderRadius: 8,
          margin: "12px auto", display: "inline-block",
        }}>"{name}"</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
          <button onClick={onClose} style={{
            padding: "10px 24px", borderRadius: 8, border: "1.5px solid #E0E0E0",
            background: "#fff", color: "#555", fontSize: 13, fontWeight: 600,
            cursor: "pointer",
          }}>Batal</button>
          <button onClick={onConfirm} style={{
            padding: "10px 24px", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg,#D0011B,#FF3B30)",
            color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(208,1,27,0.3)",
          }}>Hapus Sekarang</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("produk");

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id"> & { id?: number }>(emptyProduct());

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const pushToast = (message: string, type: Toast["type"] = "success") => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, message, type }]);
  };

  // Highlight row
  const [flashRow, setFlashRow] = useState<number | null>(null);
  const flash = (id: number) => {
    setFlashRow(id);
    setTimeout(() => setFlashRow(null), 1200);
  };

  // Derived list
  const displayed = items
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
      const matchCat = catFilter === "all" || p.category === catFilter;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return dir * a.name.localeCompare(b.name);
      return dir * ((a[sortField] as number) - (b[sortField] as number));
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortArrow = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span style={{ color: "#ccc", fontSize: 11 }}> ↕</span>;
    return <span style={{ color: "#42B549", fontSize: 11 }}> {sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  // ADD
  const openAdd = () => { setFormData(emptyProduct()); setAddOpen(true); };
  const saveAdd = () => {
    if (!formData.name.trim() || !formData.price) {
      pushToast("Nama & harga wajib diisi", "error"); return;
    }
    const newId = Math.max(...items.map(p => p.id)) + 1;
    const newProduct = { ...formData, id: newId } as Product;
    setItems(p => [...p, newProduct]);
    setAddOpen(false);
    flash(newId);
    pushToast("Produk berhasil ditambahkan! 🎉");
  };

  // EDIT
  const openEdit = (p: Product) => { setFormData({ ...p }); setEditTarget(p); };
  const saveEdit = () => {
    if (!formData.name.trim() || !formData.price) {
      pushToast("Nama & harga wajib diisi", "error"); return;
    }
    setItems(prev => prev.map(p => p.id === editTarget!.id ? { ...formData, id: editTarget!.id } as Product : p));
    setEditTarget(null);
    flash(editTarget!.id);
    pushToast("Produk diperbarui ✓");
  };

  // DELETE
  const confirmDelete = () => {
    setItems(prev => prev.filter(p => p.id !== deleteTarget!.id));
    pushToast(`"${deleteTarget!.name.slice(0, 30)}..." dihapus`, "info");
    setDeleteTarget(null);
  };

  const stats = {
    total: items.length,
    totalSold: items.reduce((s, p) => s + p.sold, 0),
    avgPrice: Math.round(items.reduce((s, p) => s + p.price, 0) / items.length),
    hotItems: items.filter(p => p.badge === "hot").length,
  };

  // Nav items
  const navItems = [
    { id: "produk", icon: "📦", label: "Produk" },
    { id: "analytics", icon: "📊", label: "Analitik" },
    { id: "pesanan", icon: "🛒", label: "Pesanan" },
    { id: "pengaturan", icon: "⚙️", label: "Pengaturan" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F3F4F6", fontFamily: "'Inter','Segoe UI',sans-serif", overflow: "hidden" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: sidebarOpen ? 230 : 64,
        background: "linear-gradient(180deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%)",
        display: "flex", flexDirection: "column",
        transition: "width 0.28s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden", flexShrink: 0,
        boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
        position: "relative", zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarOpen ? "22px 20px 18px" : "22px 0 18px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center",
          justifyContent: sidebarOpen ? "space-between" : "center",
          transition: "padding 0.28s",
        }}>
          {sidebarOpen && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg,#42B549,#2d8a33)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, boxShadow: "0 4px 12px rgba(66,181,73,0.4)",
              }}>🛍</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: "-0.3px" }}>TokoBest</div>
                <div style={{ color: "#42B549", fontSize: 10, fontWeight: 600 }}>Admin Panel</div>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg,#42B549,#2d8a33)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🛍</div>
          )}
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            background: "rgba(255,255,255,0.08)",
            border: "none", borderRadius: 8,
            width: 28, height: 28, cursor: "pointer",
            color: "#aaa", fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s, transform 0.28s",
            transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
            flexShrink: 0,
          }}>‹</button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: sidebarOpen ? 12 : 0, justifyContent: sidebarOpen ? "flex-start" : "center",
              padding: sidebarOpen ? "10px 14px" : "10px 0",
              borderRadius: 10, border: "none", cursor: "pointer",
              marginBottom: 4,
              background: activeNav === item.id
                ? "linear-gradient(90deg,rgba(66,181,73,0.18),rgba(66,181,73,0.08))"
                : "transparent",
              borderLeft: activeNav === item.id ? "3px solid #42B549" : "3px solid transparent",
              transition: "all 0.15s",
              overflow: "hidden",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && (
                <span style={{
                  fontSize: 13, fontWeight: activeNav === item.id ? 700 : 500,
                  color: activeNav === item.id ? "#42B549" : "#94A3B8",
                  whiteSpace: "nowrap",
                  transition: "opacity 0.2s",
                }}>{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{
          padding: sidebarOpen ? "14px 16px" : "14px 8px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center",
          gap: 10, justifyContent: sidebarOpen ? "flex-start" : "center",
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg,#42B549,#0F3460)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#fff", fontWeight: 700, flexShrink: 0,
          }}>A</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>Admin</div>
              <div style={{ fontSize: 10, color: "#64748B" }}>admin@tokobest.id</div>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <header style={{
          background: "#fff", padding: "0 24px",
          height: 60, display: "flex", alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #F0F0F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#1a1a2e" }}>
              {navItems.find(n => n.id === activeNav)?.label}
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>
              {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="/" target="_blank" style={{
              padding: "8px 16px", borderRadius: 8,
              border: "1.5px solid #42B549", color: "#42B549",
              fontSize: 12, fontWeight: 700, textDecoration: "none",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.15s",
            }}>🔗 Lihat Toko</a>
            <button onClick={openAdd} style={{
              padding: "8px 18px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg,#42B549,#2d8a33)",
              color: "#fff", fontSize: 12, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 4px 12px rgba(66,181,73,0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}>+ Tambah Produk</button>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
            <StatCard label="Total Produk" value={stats.total} sub={`${displayed.length} tampil`} icon="📦" accent="#42B549" />
            <StatCard label="Total Terjual" value={stats.totalSold.toLocaleString("id-ID")} sub="unit" icon="🛒" accent="#2563EB" />
            <StatCard label="Rata-rata Harga" value={formatPrice(stats.avgPrice)} icon="💰" accent="#F59E0B" />
            <StatCard label="Produk Laris" value={stats.hotItems} sub="badge 🔥" icon="🔥" accent="#EF4444" />
          </div>

          {/* Table card */}
          <div style={{
            background: "#fff", borderRadius: 14,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            border: "1px solid #F0F0F0", overflow: "hidden",
          }}>
            {/* Table toolbar */}
            <div style={{
              padding: "14px 20px", display: "flex",
              alignItems: "center", gap: 12, flexWrap: "wrap",
              borderBottom: "1px solid #F5F5F5",
            }}>
              {/* Search */}
              <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Cari nama atau kota..."
                  style={{ ...inputStyle, paddingLeft: 34, maxWidth: 300 }} />
              </div>

              {/* Cat filter */}
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                style={{ ...inputStyle, width: "auto", cursor: "pointer", padding: "9px 12px" }}>
                <option value="all">Semua Kategori</option>
                {CAT_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>

              <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: "auto" }}>
                {displayed.length} dari {items.length} produk
              </span>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#FAFAFA" }}>
                    {[
                      { label: "Produk", field: "name" as SortField },
                      { label: "Harga", field: "price" as SortField },
                      { label: "Terjual", field: "sold" as SortField },
                      { label: "Kategori", field: null },
                      { label: "Badge", field: null },
                      { label: "Aksi", field: null },
                    ].map(col => (
                      <th key={col.label}
                        onClick={() => col.field && handleSort(col.field)}
                        style={{
                          padding: "10px 16px", textAlign: "left",
                          fontSize: 11, fontWeight: 700, color: "#64748B",
                          letterSpacing: "0.04em", whiteSpace: "nowrap",
                          cursor: col.field ? "pointer" : "default",
                          userSelect: "none",
                          borderBottom: "1px solid #F0F0F0",
                        }}>
                        {col.label.toUpperCase()}{col.field && <SortArrow field={col.field} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayed.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "#94A3B8" }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                        <div style={{ fontSize: 14 }}>Tidak ada produk ditemukan</div>
                      </td>
                    </tr>
                  )}
                  {displayed.map((p, idx) => {
                    const isFlash = flashRow === p.id;
                    const badge = BADGE_OPTIONS.find(b => b.value === p.badge);
                    return (
                      <tr key={p.id} style={{
                        borderBottom: idx < displayed.length - 1 ? "1px solid #F8F8F8" : "none",
                        background: isFlash
                          ? "linear-gradient(90deg,rgba(66,181,73,0.12),rgba(66,181,73,0.04))"
                          : idx % 2 === 0 ? "#fff" : "#FAFCFA",
                        transition: "background 0.6s ease",
                      }}>
                        {/* Product */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                              width: 46, height: 46, borderRadius: 10,
                              overflow: "hidden", flexShrink: 0,
                              background: "#F5F5F5",
                              border: "1px solid #EEE",
                            }}>
                              <img src={p.image} alt={p.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div>
                              <div className="line-clamp-1" style={{
                                fontSize: 13, fontWeight: 600, color: "#1a1a2e",
                                maxWidth: 220,
                              }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
                                📍 {p.location} · ⭐ {p.rating}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Price */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#42B549" }}>
                            {formatPrice(p.price)}
                          </div>
                          {p.originalPrice && (
                            <div style={{ fontSize: 11, color: "#bbb", textDecoration: "line-through" }}>
                              {formatPrice(p.originalPrice)}
                            </div>
                          )}
                        </td>
                        {/* Sold */}
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>
                            {p.sold.toLocaleString("id-ID")}
                          </span>
                        </td>
                        {/* Category */}
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            background: "#EEF8EF", color: "#2d8a33",
                            padding: "3px 10px", borderRadius: 20,
                            fontSize: 11, fontWeight: 600,
                          }}>
                            {categories.find(c => c.id === p.category)?.label ?? p.category}
                          </span>
                        </td>
                        {/* Badge */}
                        <td style={{ padding: "12px 16px" }}>
                          {badge?.value ? (
                            <span style={{
                              background: badge.color + "18",
                              color: badge.color,
                              padding: "3px 10px", borderRadius: 20,
                              fontSize: 11, fontWeight: 700,
                            }}>{badge.label}</span>
                          ) : (
                            <span style={{ color: "#DDD", fontSize: 13 }}>—</span>
                          )}
                        </td>
                        {/* Actions */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => openEdit(p)} style={{
                              padding: "6px 14px", borderRadius: 7,
                              border: "1.5px solid #42B549", background: "transparent",
                              color: "#42B549", fontSize: 11, fontWeight: 700,
                              cursor: "pointer", transition: "all 0.15s",
                              whiteSpace: "nowrap",
                            }}>✏️ Edit</button>
                            <button onClick={() => setDeleteTarget(p)} style={{
                              padding: "6px 14px", borderRadius: 7,
                              border: "1.5px solid #FFE0E0", background: "#FFF5F5",
                              color: "#D0011B", fontSize: 11, fontWeight: 700,
                              cursor: "pointer", transition: "all 0.15s",
                              whiteSpace: "nowrap",
                            }}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{
              padding: "12px 20px", borderTop: "1px solid #F5F5F5",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 12, color: "#94A3B8" }}>
                Menampilkan {displayed.length} produk
              </span>
              <span style={{ fontSize: 12, color: "#42B549", fontWeight: 600 }}>
                TokoBest Admin v1.0
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* ── MODALS ── */}
      <Modal open={addOpen} title="Tambah Produk Baru" onClose={() => setAddOpen(false)}>
        <ProductForm data={formData} onChange={setFormData} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={() => setAddOpen(false)} style={{
            padding: "10px 20px", borderRadius: 8, border: "1.5px solid #E0E0E0",
            background: "#fff", color: "#555", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Batal</button>
          <button onClick={saveAdd} style={{
            padding: "10px 24px", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg,#42B549,#2d8a33)",
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(66,181,73,0.35)",
          }}>Simpan Produk</button>
        </div>
      </Modal>

      <Modal open={!!editTarget} title="Edit Produk" onClose={() => setEditTarget(null)}>
        <ProductForm data={formData} onChange={setFormData} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={() => setEditTarget(null)} style={{
            padding: "10px 20px", borderRadius: 8, border: "1.5px solid #E0E0E0",
            background: "#fff", color: "#555", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Batal</button>
          <button onClick={saveEdit} style={{
            padding: "10px 24px", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg,#42B549,#2d8a33)",
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(66,181,73,0.35)",
          }}>Simpan Perubahan</button>
        </div>
      </Modal>

      <DeleteConfirm
        open={!!deleteTarget}
        name={deleteTarget?.name ?? ""}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {/* ── TOAST CONTAINER ── */}
      <div style={{
        position: "fixed", bottom: 24, right: 24,
        zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "flex-end",
      }}>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t}
            onDone={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
        ))}
      </div>
    </div>
  );
}
