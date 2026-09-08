import { NextRequest, NextResponse } from "next/server";

// ─── Helpers ────────────────────────────────────────────────────────────────
function getMeta(html: string, ...keys: string[]): string | undefined {
  for (const key of keys) {
    // <meta property="og:title" content="...">  OR reversed attr order
    const patterns = [
      new RegExp(
        `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
        "i"
      ),
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
        "i"
      ),
    ];
    for (const re of patterns) {
      const m = html.match(re);
      if (m?.[1]) return decodeHtmlEntities(m[1]);
    }
  }
  return undefined;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function findPriceFromJsonLd(html: string): number | undefined {
  const blocks = [...html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )];

  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1].trim());
      const candidates = Array.isArray(parsed) ? parsed : [parsed];

      for (const node of candidates) {
        const price = extractPriceFromNode(node);
        if (price) return price;
      }
    } catch {
      // ignore malformed JSON-LD blocks
    }
  }
  return undefined;
}

function extractPriceFromNode(node: unknown): number | undefined {
  if (!node || typeof node !== "object") return undefined;
  const obj = node as Record<string, unknown>;

  // Direct offers.price
  const offers = obj.offers;
  if (offers) {
    const offerList = Array.isArray(offers) ? offers : [offers];
    for (const offer of offerList) {
      if (offer && typeof offer === "object") {
        const p = (offer as Record<string, unknown>).price ?? (offer as Record<string, unknown>).lowPrice;
        if (p !== undefined) {
          const num = Number(String(p).replace(/[^0-9.]/g, ""));
          if (!Number.isNaN(num) && num > 0) return num;
        }
      }
    }
  }

  // @graph nested structures
  if (Array.isArray(obj["@graph"])) {
    for (const child of obj["@graph"] as unknown[]) {
      const p = extractPriceFromNode(child);
      if (p) return p;
    }
  }

  return undefined;
}

function findPriceFromMeta(html: string): number | undefined {
  const raw = getMeta(
    html,
    "product:price:amount",
    "og:price:amount",
    "twitter:data1"
  );
  if (!raw) return undefined;
  const num = Number(raw.replace(/[^0-9.]/g, ""));
  return Number.isNaN(num) ? undefined : num;
}

// Beberapa marketplace (terutama Tokopedia short-link vt.tokopedia.com)
// menyajikan halaman "security check" / captcha ke request tanpa browser asli.
// Kalau ini tidak dideteksi, judul halaman challenge (mis. "Security Check")
// akan salah dianggap sebagai nama produk.
const BLOCK_PAGE_SIGNALS = [
  "security check",
  "access denied",
  "attention required",
  "just a moment",
  "are you a human",
  "are you human",
  "verify you are human",
  "please verify",
  "robot check",
  "bot detection",
  "captcha",
  "unusual traffic",
  "forbidden",
];

function looksLikeBlockPage(title: string | undefined, html: string): boolean {
  const t = (title ?? "").toLowerCase();
  if (BLOCK_PAGE_SIGNALS.some((s) => t.includes(s))) return true;

  // Halaman challenge biasanya sangat pendek dan tidak punya JSON-LD produk
  // ataupun og:price — cek juga sedikit body untuk sinyal umum Cloudflare/captcha.
  const bodySample = html.slice(0, 5000).toLowerCase();
  if (
    bodySample.includes("cf-challenge") ||
    bodySample.includes("cf_chl_") ||
    bodySample.includes("g-recaptcha") ||
    bodySample.includes("hcaptcha")
  ) {
    return true;
  }
  return false;
}

// ─── Route ──────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const targetUrl = req.nextUrl.searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Parameter 'url' wajib diisi" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("invalid protocol");
  } catch {
    return NextResponse.json({ error: "URL tidak valid" }, { status: 400 });
  }

  try {
    const res = await fetch(parsed.toString(), {
      headers: {
        // Header yang lebih mirip browser asli supaya lebih kecil kemungkinan
        // kena halaman "security check" / anti-bot marketplace.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        Referer: "https://www.google.com/",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      // Tokopedia/Shopee dkk sering balas 403/429 saat mendeteksi bot.
      if (res.status === 403 || res.status === 429) {
        return NextResponse.json(
          {
            error:
              "Situs ini memblokir permintaan otomatis (bot protection). Isi data produk secara manual ya.",
          },
          { status: 502 }
        );
      }
      return NextResponse.json(
        { error: `Gagal mengambil halaman (status ${res.status})` },
        { status: 502 }
      );
    }

    const html = await res.text();

    const title =
      getMeta(html, "og:title", "twitter:title") ??
      html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();

    // Jangan percaya judul halaman kalau ternyata itu halaman "security check" /
    // captcha, bukan halaman produk sungguhan — sebelumnya nilai seperti
    // "Security Check" bisa lolos jadi Nama Produk.
    if (looksLikeBlockPage(title, html)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Situs ini menampilkan halaman verifikasi/keamanan (bukan halaman produk), sehingga data tidak bisa dideteksi otomatis. Buka link-nya di browser, salin nama/harga/foto secara manual.",
        },
        { status: 502 }
      );
    }

    const image = getMeta(html, "og:image", "og:image:secure_url", "twitter:image");

    const price = findPriceFromJsonLd(html) ?? findPriceFromMeta(html);

    const foundAny = Boolean(title || image || price);

    return NextResponse.json({
      success: foundAny,
      name: title,
      image,
      price,
      warning: !price
        ? "Harga tidak terdeteksi otomatis — situs ini mungkin merender harga lewat JavaScript. Isi manual ya."
        : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal memproses";
    return NextResponse.json(
      { error: `Tidak bisa mengambil data dari URL ini (${message})` },
      { status: 502 }
    );
  }
}
