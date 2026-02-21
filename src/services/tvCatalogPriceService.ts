import { collection, getDocs } from "firebase/firestore";
import { db, firebaseEnabled } from "../lib/firebase";

function normalizeKey(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function formatPrice(price: number) {
  return `${Number(price || 0)} TL`;
}

export async function applyCatalogPricesToTvHtml(html: string) {
  if (!firebaseEnabled || !db) return html;

  try {
    const snapshot = await getDocs(collection(db, "products"));
    const priceByName = new Map<string, number>();

    snapshot.forEach((doc) => {
      const data = doc.data() as { nameTr?: string; nameEn?: string; price?: number };
      const price = Number(data.price ?? 0);

      if (data.nameTr) {
        priceByName.set(normalizeKey(data.nameTr), price);
      }
      if (data.nameEn) {
        priceByName.set(normalizeKey(data.nameEn), price);
      }
    });

    if (priceByName.size === 0) return html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rows = Array.from(doc.querySelectorAll(".itemRow"));
    if (rows.length === 0) return html;

    rows.forEach((row) => {
      const nameEl = row.querySelector(".itemName");
      const priceEl = row.querySelector(".itemPrice");
      if (!nameEl || !priceEl) return;

      const key = normalizeKey(nameEl.textContent || "");
      const next = priceByName.get(key);
      if (typeof next === "number") {
        priceEl.textContent = formatPrice(next);
      }
    });

    return "<!doctype html>\n" + doc.documentElement.outerHTML;
  } catch {
    return html;
  }
}
