import { collection, getDocs } from "firebase/firestore";
import { db, firebaseEnabled } from "../lib/firebase";

const herbalTeaAliases = new Set([
  "ihlamur",
  "kusburnu",
  "kiscayi",
  "nanelimon",
]);
const sutlacAliases = new Set([
  "sutlac",
  "firinsutlac",
  "firindasutlac",
  "bakedricepudding",
  "ricepudding",
]);
const sutlacDisplayName = "Fırın Sütlaç";

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
    let herbalTeaPrice: number | undefined;
    let sutlacPrice: number | undefined;

    snapshot.forEach((doc) => {
      const data = doc.data() as { nameTr?: string; nameEn?: string; price?: number };
      const price = Number(data.price ?? 0);
      const docIdKey = normalizeKey(doc.id);
      const nameTrKey = data.nameTr ? normalizeKey(data.nameTr) : "";
      const nameEnKey = data.nameEn ? normalizeKey(data.nameEn) : "";

      priceByName.set(docIdKey, price);
      if (data.nameTr) {
        priceByName.set(nameTrKey, price);
      }
      if (data.nameEn) {
        priceByName.set(nameEnKey, price);
      }

      if (docIdKey === "bitkicaylari" || nameTrKey === "bitkicaylari" || nameEnKey === "herbalteas") {
        herbalTeaPrice = price;
      }
      if (docIdKey === "sutlac" || sutlacAliases.has(nameTrKey) || sutlacAliases.has(nameEnKey)) {
        sutlacPrice = price;
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
      if (sutlacAliases.has(key)) {
        nameEl.textContent = sutlacDisplayName;
      }
      const next =
        priceByName.get(key) ??
        (sutlacAliases.has(key) ? sutlacPrice : undefined) ??
        (herbalTeaAliases.has(key) ? herbalTeaPrice : undefined);
      if (typeof next === "number") {
        priceEl.textContent = formatPrice(next);
      }
    });

    return "<!doctype html>\n" + doc.documentElement.outerHTML;
  } catch {
    return html;
  }
}
