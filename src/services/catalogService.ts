import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db, firebaseEnabled } from "../lib/firebase";
import {
  seedCategories,
  seedProducts,
  resetCategoriesToFallback,
  resetProductsToFallback,
  setCategories,
  setProducts,
  type Category,
  type MenuGroupId,
  type Product,
} from "../data/menu";

type ProductDocument = {
  categoryId: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  descriptionEn: string;
  price: number;
  imageUrl: string;
};

type CategoryDocument = {
  groupId: MenuGroupId;
  emoji: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
};

export type AdminProductInput = {
  categoryId: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  descriptionEn: string;
  price: number;
  imageUrl: string;
};

export type AdminProductRow = AdminProductInput & { id: string };
export type AdminCategoryInput = CategoryDocument;
export type AdminCategoryRow = AdminCategoryInput & { id: string };

const productsCollectionName = "products";
const categoriesCollectionName = "categories";
let syncStarted = false;

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
  };
}

export function startCatalogSync() {
  if (syncStarted) return () => undefined;
  syncStarted = true;

  if (!firebaseEnabled || !db) {
    setCategories([]);
    setProducts([]);
    return () => undefined;
  }

  const categoriesRef = collection(db, categoriesCollectionName);
  const categoriesQuery = query(categoriesRef, orderBy("createdAt", "asc"));
  const productsRef = collection(db, productsCollectionName);
  const productsQuery = query(productsRef, orderBy("createdAt", "desc"));

  const unsubscribeCategories = onSnapshot(
    categoriesQuery,
    (snapshot) => {
      const rows = snapshot.docs.map((item) => toMenuCategory(item.id, item.data() as CategoryDocument));
      setCategories(rows);
    },
    () => {
      resetCategoriesToFallback();
    }
  );

  const unsubscribeProducts = onSnapshot(
    productsQuery,
    (snapshot) => {
      const rows = snapshot.docs.map((item) => toMenuProduct(item.id, item.data() as ProductDocument));
      setProducts(rows);
    },
    () => {
      resetProductsToFallback();
    }
  );

  return () => {
    unsubscribeCategories();
    unsubscribeProducts();
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
    const rows = snapshot.docs.map((item) => {
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
      };
    });
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
      .map((item) => {
        const data = item.data() as CategoryDocument;
        return {
          id: item.id,
          groupId: data.groupId,
          emoji: data.emoji || "🍽",
          titleTr: data.titleTr || "",
          titleEn: data.titleEn || "",
          descriptionTr: data.descriptionTr || "",
          descriptionEn: data.descriptionEn || "",
        };
      })
      .filter((item) => item.groupId === groupId);

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
    createdAt: serverTimestamp(),
  });
}

export async function removeAdminProduct(productId: string) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  await deleteDoc(doc(db, productsCollectionName, productId));
}

export async function updateAdminProduct(productId: string, payload: AdminProductInput) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  await updateDoc(doc(db, productsCollectionName, productId), payload);
}

export async function createAdminCategory(payload: AdminCategoryInput) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  const categoriesRef = collection(db, categoriesCollectionName);
  await addDoc(categoriesRef, {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

export async function removeAdminCategory(categoryId: string) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  await deleteDoc(doc(db, categoriesCollectionName, categoryId));
}

export async function updateAdminCategory(categoryId: string, payload: AdminCategoryInput) {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  await updateDoc(doc(db, categoriesCollectionName, categoryId), payload);
}

export async function seedCatalogToDatabase() {
  if (!firebaseEnabled || !db) {
    throw new Error("Firebase is not configured");
  }

  const batch = writeBatch(db);

  for (const category of seedCategories) {
    const categoryRef = doc(db, categoriesCollectionName, category.id);
    batch.set(categoryRef, {
      groupId: category.groupId,
      emoji: category.emoji,
      titleTr: category.title.tr,
      titleEn: category.title.en,
      descriptionTr: category.description.tr,
      descriptionEn: category.description.en,
      createdAt: serverTimestamp(),
    });
  }

  for (const product of seedProducts) {
    const productRef = doc(db, productsCollectionName, product.id);
    batch.set(productRef, {
      categoryId: product.categoryId,
      nameTr: product.title.tr,
      nameEn: product.title.en,
      descriptionTr: product.description.tr,
      descriptionEn: product.description.en,
      price: Number(product.price) || 0,
      imageUrl: product.imageUrl || "",
      createdAt: serverTimestamp(),
    });
  }

  await batch.commit();
}
