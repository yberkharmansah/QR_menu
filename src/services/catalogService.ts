import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db, firebaseEnabled } from "../lib/firebase";
import {
  resetCategoriesToFallback,
  resetProductsToFallback,
  setCategories,
  setProducts,
  type Category,
  type MenuGroupId,
  type Product,
} from "../data/menu";
import { reactive } from "vue";

type ProductDocument = {
  categoryId: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  descriptionEn: string;
  price: number;
  imageUrl: string;
  sortOrder?: number;
};

type CategoryDocument = {
  groupId: MenuGroupId;
  emoji: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  sortOrder?: number;
};

export type AdminProductInput = {
  categoryId: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  descriptionEn: string;
  price: number;
  imageUrl: string;
  sortOrder?: number;
};

export type AdminProductRow = AdminProductInput & { id: string };
export type AdminCategoryInput = CategoryDocument;
export type AdminCategoryRow = AdminCategoryInput & { id: string };

const productsCollectionName = "products";
const categoriesCollectionName = "categories";
const catalogMetaCollectionName = "appMeta";
const catalogMetaDocumentId = "catalog";
const catalogCacheKey = "qr-menu.catalog-cache.v2";
const catalogVersionPollMs = 60_000;
let syncStarted = false;
let versionPollTimer: ReturnType<typeof setInterval> | null = null;
let lastVersionCheckAt = 0;
let currentCatalogVersion: string | null = null;
let refreshInFlight: Promise<void> | null = null;

export const catalogSyncState = reactive({
  categoriesLoaded: false,
  productsLoaded: false,
  categoriesError: false,
  productsError: false,
});

type CatalogCachePayload = {
  version: string | null;
  categories: Category[];
  products: Product[];
  savedAt: number;
};

function toMenuProduct(id: string, docData: ProductDocument): Product {
  return {
    id,
    categoryId: docData.categoryId,
    title: {
      tr: docData.nameTr,
      en: docData.nameEn,
    },
    description: {
      tr: docData.descriptionTr,
      en: docData.descriptionEn,
    },
    price: Number(docData.price) || 0,
    imageUrl: docData.imageUrl,
    sortOrder: Number.isFinite(docData.sortOrder) ? Number(docData.sortOrder) : undefined,
  };
}

function toMenuCategory(id: string, docData: CategoryDocument): Category {
  return {
    id,
    groupId: docData.groupId,
    emoji: docData.emoji,
    title: {
      tr: docData.titleTr,
      en: docData.titleEn,
    },
    description: {
      tr: docData.descriptionTr,
      en: docData.descriptionEn,
    },
    sortOrder: Number.isFinite(docData.sortOrder) ? Number(docData.sortOrder) : undefined,
  };
}

function readCatalogCache() {
  try {
    const raw = localStorage.getItem(catalogCacheKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CatalogCachePayload;
    if (!Array.isArray(parsed.categories) || !Array.isArray(parsed.products)) return null;

    return parsed;
  } catch {
    return null;
  }
}

function writeCatalogCache(payload: CatalogCachePayload) {
  localStorage.setItem(catalogCacheKey, JSON.stringify(payload));
}

function applyCatalogData(categories: Category[], products: Product[], version: string | null) {
  setCategories(categories);
  setProducts(products);
  currentCatalogVersion = version;
}

function markCatalogLoaded(hasError: boolean) {
  catalogSyncState.categoriesLoaded = true;
  catalogSyncState.productsLoaded = true;
  catalogSyncState.categoriesError = hasError;
  catalogSyncState.productsError = hasError;
}

function getCatalogMetaRef() {
  return doc(db!, catalogMetaCollectionName, catalogMetaDocumentId);
}

async function touchCatalogVersion() {
  if (!firebaseEnabled || !db) return;

  const version = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  await setDoc(
    getCatalogMetaRef(),
    {
      version,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function fetchCatalogVersion() {
  if (!firebaseEnabled || !db) return null;

  const snapshot = await getDoc(getCatalogMetaRef());
  const version = snapshot.data()?.version;
  lastVersionCheckAt = Date.now();
  return typeof version === "string" ? version : null;
}

async function fetchCatalogCollections() {
  const categoriesRef = collection(db!, categoriesCollectionName);
  const productsRef = collection(db!, productsCollectionName);

  const [categoriesSnapshot, productsSnapshot] = await Promise.all([
    getDocs(query(categoriesRef, orderBy("createdAt", "asc"))),
    getDocs(query(productsRef, orderBy("createdAt", "desc"))),
  ]);

  const categories = categoriesSnapshot.docs
    .map((item, index) => {
      const row = toMenuCategory(item.id, item.data() as CategoryDocument);
      return {
        ...row,
        sortOrder: row.sortOrder ?? index,
      };
    })
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const products = productsSnapshot.docs
    .map((item, index) => {
      const row = toMenuProduct(item.id, item.data() as ProductDocument);
      return {
        ...row,
        sortOrder: row.sortOrder ?? index,
      };
    })
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return { categories, products };
}

async function refreshPublicCatalog(options?: { force?: boolean }) {
  if (!firebaseEnabled || !db) {
    resetCategoriesToFallback();
    resetProductsToFallback();
    markCatalogLoaded(true);
    return;
  }

  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const cached = readCatalogCache();

    try {
      const remoteVersion = await fetchCatalogVersion();
      const shouldUseCached =
        !options?.force &&
        cached &&
        cached.version !== null &&
        remoteVersion !== null &&
        cached.version === remoteVersion;

      if (shouldUseCached) {
        applyCatalogData(cached.categories, cached.products, remoteVersion);
        markCatalogLoaded(false);
        return;
      }

      const { categories, products } = await fetchCatalogCollections();
      applyCatalogData(categories, products, remoteVersion);
      writeCatalogCache({
        version: remoteVersion,
        categories,
        products,
        savedAt: Date.now(),
      });
      markCatalogLoaded(false);
    } catch (error) {
      console.error("Catalog refresh failed.", error);

      if (cached) {
        applyCatalogData(cached.categories, cached.products, cached.version);
      } else {
        resetCategoriesToFallback();
        resetProductsToFallback();
        currentCatalogVersion = null;
      }

      markCatalogLoaded(true);
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

async function checkForCatalogUpdates(force = false) {
  if (!syncStarted || !firebaseEnabled || !db) return;
  if (!force && Date.now() - lastVersionCheckAt < catalogVersionPollMs) return;

  try {
    const remoteVersion = await fetchCatalogVersion();
    if (remoteVersion !== currentCatalogVersion) {
      await refreshPublicCatalog({ force: true });
    }
  } catch (error) {
    console.error("Catalog version check failed.", error);
  }
}

function startCatalogVersionMonitor() {
  if (versionPollTimer) return;

  const handleVisibility = () => {
    if (document.visibilityState === "visible") {
      void checkForCatalogUpdates(true);
    }
  };

  const handleFocus = () => {
    void checkForCatalogUpdates(true);
  };

  versionPollTimer = setInterval(() => {
    if (document.visibilityState === "visible") {
      void checkForCatalogUpdates();
    }
  }, catalogVersionPollMs);

  window.addEventListener("focus", handleFocus);
  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    if (versionPollTimer) {
      clearInterval(versionPollTimer);
      versionPollTimer = null;
    }

    window.removeEventListener("focus", handleFocus);
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}

export function startCatalogSync() {
  if (syncStarted) return () => undefined;
  syncStarted = true;

  catalogSyncState.categoriesLoaded = false;
  catalogSyncState.productsLoaded = false;
  catalogSyncState.categoriesError = false;
  catalogSyncState.productsError = false;

  if (!firebaseEnabled || !db) {
    resetCategoriesToFallback();
    resetProductsToFallback();
    markCatalogLoaded(true);
    return () => undefined;
  }

  void refreshPublicCatalog();
  const stopVersionMonitor = startCatalogVersionMonitor();

  return () => {
    stopVersionMonitor?.();
    syncStarted = false;
  };
}

export function subscribeAdminProducts(listener: (rows: AdminProductRow[]) => void) {
  if (!firebaseEnabled || !db) {
    listener([]);
    return () => undefined;
  }

  const productsRef = collection(db, productsCollectionName);
  const productsQuery = query(productsRef, orderBy("createdAt", "desc"));

  return onSnapshot(productsQuery, (snapshot) => {
    const rows = snapshot.docs
      .map((item, index) => {
        const data = item.data() as ProductDocument;
        return {
          id: item.id,
          categoryId: data.categoryId,
          nameTr: data.nameTr,
          nameEn: data.nameEn,
          descriptionTr: data.descriptionTr,
          descriptionEn: data.descriptionEn,
          price: Number(data.price) || 0,
          imageUrl: data.imageUrl || "",
          sortOrder: Number.isFinite(data.sortOrder) ? Number(data.sortOrder) : index,
        };
      })
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    listener(rows);
  });
}

export function subscribeAdminCategories(groupId: MenuGroupId, listener: (rows: AdminCategoryRow[]) => void) {
  if (!firebaseEnabled || !db) {
    listener([]);
    return () => undefined;
  }

  const categoriesRef = collection(db, categoriesCollectionName);
  const categoriesQuery = query(categoriesRef, orderBy("createdAt", "asc"));

  return onSnapshot(categoriesQuery, (snapshot) => {
    const rows = snapshot.docs
      .map((item, index) => {
        const data = item.data() as CategoryDocument;
        return {
          id: item.id,
          groupId: data.groupId,
          emoji: data.emoji || "🍽️",
          titleTr: data.titleTr || "",
          titleEn: data.titleEn || "",
          descriptionTr: data.descriptionTr || "",
          descriptionEn: data.descriptionEn || "",
          sortOrder: Number.isFinite(data.sortOrder) ? Number(data.sortOrder) : index,
        };
      })
      .filter((item) => item.groupId === groupId)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    listener(rows);
  });
}

export async function createAdminProduct(payload: AdminProductInput) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  const productsRef = collection(db, productsCollectionName);
  await addDoc(productsRef, {
    ...payload,
    sortOrder: Number.isFinite(payload.sortOrder) ? Number(payload.sortOrder) : Date.now(),
    createdAt: serverTimestamp(),
  });
  await touchCatalogVersion();
}

export async function removeAdminProduct(productId: string) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  await deleteDoc(doc(db, productsCollectionName, productId));
  await touchCatalogVersion();
}

export async function updateAdminProduct(productId: string, payload: AdminProductInput) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  await updateDoc(doc(db, productsCollectionName, productId), payload);
  await touchCatalogVersion();
}

export async function createAdminCategory(payload: AdminCategoryInput) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  const categoriesRef = collection(db, categoriesCollectionName);
  await addDoc(categoriesRef, {
    ...payload,
    sortOrder: Number.isFinite(payload.sortOrder) ? Number(payload.sortOrder) : Date.now(),
    createdAt: serverTimestamp(),
  });
  await touchCatalogVersion();
}

export async function removeAdminCategory(categoryId: string) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  await deleteDoc(doc(db, categoriesCollectionName, categoryId));
  await touchCatalogVersion();
}

export async function updateAdminCategory(categoryId: string, payload: AdminCategoryInput) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  await updateDoc(doc(db, categoriesCollectionName, categoryId), payload);
  await touchCatalogVersion();
}

export async function seedCatalogToDatabase() {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  const batch = writeBatch(db);

  for (const [index, category] of seedCategories.entries()) {
    const categoryRef = doc(db, categoriesCollectionName, category.id);
    batch.set(categoryRef, {
      groupId: category.groupId,
      emoji: category.emoji,
      titleTr: category.title.tr,
      titleEn: category.title.en,
      descriptionTr: category.description.tr,
      descriptionEn: category.description.en,
      sortOrder: index,
      createdAt: serverTimestamp(),
    });
  }

  for (const [index, product] of seedProducts.entries()) {
    const productRef = doc(db, productsCollectionName, product.id);
    batch.set(productRef, {
      categoryId: product.categoryId,
      nameTr: product.title.tr,
      nameEn: product.title.en,
      descriptionTr: product.description.tr,
      descriptionEn: product.description.en,
      price: Number(product.price) || 0,
      imageUrl: product.imageUrl || "",
      sortOrder: index,
      createdAt: serverTimestamp(),
    });
  }

  await batch.commit();
  await touchCatalogVersion();
}

export async function reorderAdminCategories(orderedCategoryIds: string[]) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  const batch = writeBatch(db);
  orderedCategoryIds.forEach((categoryId, index) => {
    batch.update(doc(db, categoriesCollectionName, categoryId), { sortOrder: index });
  });

  await batch.commit();
  await touchCatalogVersion();
}

export async function reorderAdminProducts(orderedProductIds: string[]) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  const batch = writeBatch(db);
  orderedProductIds.forEach((productId, index) => {
    batch.update(doc(db, productsCollectionName, productId), { sortOrder: index });
  });

  await batch.commit();
  await touchCatalogVersion();
}

export async function bulkUpdateAdminProductPrices(priceUpdates: Array<{ productId: string; price: number }>) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  if (priceUpdates.length === 0) return;

  const batch = writeBatch(db);
  priceUpdates.forEach((update) => {
    batch.update(doc(db, productsCollectionName, update.productId), { price: update.price });
  });

  await batch.commit();
  await touchCatalogVersion();
}
