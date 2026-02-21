import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, firebaseEnabled } from "../lib/firebase";

export type TvSlug = "items" | "icecekler" | "yiyecekler";

const collectionName = "tvHtmlOverrides";

function localKey(slug: TvSlug) {
  return `tvHtmlOverride:${slug}`;
}

function docRef(slug: TvSlug) {
  if (!db) return null;
  return doc(db, collectionName, slug);
}

export async function loadTvHtml(slug: TvSlug, fallbackPath: string) {
  if (firebaseEnabled) {
    try {
      const ref = docRef(slug);
      if (ref) {
        const snap = await getDoc(ref);
        const html = snap.data()?.html;
        if (typeof html === "string" && html.trim().length > 0) {
          return html;
        }
      }
    } catch {
      // Firestore okunamazsa fallback'e devam et.
    }
  }

  const local = localStorage.getItem(localKey(slug));
  if (local) return local;

  const response = await fetch(fallbackPath);
  return response.ok ? await response.text() : "";
}

export async function saveTvHtmlOverride(slug: TvSlug, html: string) {
  localStorage.setItem(localKey(slug), html);

  if (!firebaseEnabled) return;
  const ref = docRef(slug);
  if (!ref) return;

  await setDoc(ref, {
    html,
    updatedAt: serverTimestamp(),
  });
}

export async function clearTvHtmlOverride(slug: TvSlug) {
  localStorage.removeItem(localKey(slug));

  if (!firebaseEnabled) return;
  const ref = docRef(slug);
  if (!ref) return;

  await deleteDoc(ref);
}
