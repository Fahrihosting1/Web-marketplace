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
        // Beberapa marketplace menolak request tanpa User-Agent browser
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Gagal mengambil halaman (status ${res.status})` },
        { status: 502 }
      );
    }

    const html = await res.text();

    const title =
      getMeta(html, "og:title", "twitter:title") ??
      html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();

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
