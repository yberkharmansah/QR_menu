<template>
  <div class="page">
    <AppHeader title="Admin Panel" subtitle="Firebase + Cloudinary" backTo="/" />

    <main class="content">
      <section v-if="!firebaseEnabled" class="card">
        <div class="warn">Firebase env degerleri eksik. `.env` dosyasini doldurman gerekiyor.</div>
      </section>

      <section v-else-if="!user" class="card">
        <h2 class="sectionTitle">Admin Giris</h2>
        <div class="field">
          <label class="label">Email</label>
          <input v-model="email" class="input" type="email" placeholder="admin@example.com" />
        </div>
        <div class="field">
          <label class="label">Sifre</label>
          <input v-model="password" class="input" type="password" placeholder="******" />
        </div>
        <UiButton @click="signIn" :disabled="loading">{{ loading ? "Giris yapiliyor..." : "Giris Yap" }}</UiButton>
        <div v-if="error" class="error">{{ error }}</div>
      </section>

      <template v-else>
        <section class="card">
          <div class="headRow">
            <h2 class="sectionTitle">Yonetim</h2>
            <div class="headActions">
              <button class="pill" @click="seedDatabase" :disabled="loading">Verileri Database'e Bas</button>
              <button class="pill" @click="signOutUser">Cikis</button>
            </div>
          </div>
          <p class="sectionText">Static listeyi Firestore'a aktarip artik sadece database uzerinden devam eder.</p>
        </section>

        <section class="card">
          <div class="tabs">
            <button
              v-for="tab in adminTabs"
              :key="tab.id"
              class="tabBtn"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <template v-if="activeTab === 'product-create'">
            <h2 class="sectionTitle">Urun Ekle</h2>

            <div class="grid">
              <div class="field">
                <label class="label">Kategori</label>
                <select v-model="productCreateForm.categoryId" class="input">
                  <option disabled value="">Kategori sec</option>
                  <option v-for="category in localizedCategories" :key="category.id" :value="category.id">
                    {{ category.emoji }} {{ category.title }}
                  </option>
                </select>
              </div>

              <div class="field">
                <label class="label">Fiyat (TL)</label>
                <input v-model.number="productCreateForm.price" class="input" type="number" min="0" />
              </div>
            </div>

            <div class="grid">
              <div class="field">
                <label class="label">Urun Adi (TR)</label>
                <input v-model="productCreateForm.nameTr" class="input" type="text" />
              </div>
              <div class="field">
                <label class="label">Urun Adi (EN)</label>
                <input v-model="productCreateForm.nameEn" class="input" type="text" />
              </div>
            </div>

            <div class="grid">
              <div class="field">
                <label class="label">Aciklama (TR)</label>
                <textarea v-model="productCreateForm.descriptionTr" class="textarea" rows="3" />
              </div>
              <div class="field">
                <label class="label">Aciklama (EN)</label>
                <textarea v-model="productCreateForm.descriptionEn" class="textarea" rows="3" />
              </div>
            </div>

            <div class="field">
              <label class="label">Urun Resmi (opsiyonel)</label>
              <input class="input" type="file" accept="image/*" @change="onCreateFileChange" />
            </div>

            <div v-if="createPreviewUrl" class="previewWrap">
              <img :src="createPreviewUrl" alt="product preview" class="preview" />
            </div>

            <UiButton @click="createProduct" :disabled="loading || !canCreateProduct">
              {{ loading ? "Kaydediliyor..." : "Urunu Kaydet" }}
            </UiButton>
          </template>

          <template v-else-if="activeTab === 'product-edit'">
            <h2 class="sectionTitle">Urun Duzenle</h2>

            <div class="field">
              <label class="label">Urun Sec</label>
              <select v-model="selectedProductId" class="input">
                <option disabled value="">Urun sec</option>
                <option v-for="item in adminProducts" :key="item.id" :value="item.id">
                  {{ item.nameTr }} / {{ item.nameEn }}
                </option>
              </select>
            </div>

            <template v-if="selectedProductId">
              <div class="grid">
                <div class="field">
                  <label class="label">Kategori</label>
                  <select v-model="productEditForm.categoryId" class="input">
                    <option disabled value="">Kategori sec</option>
                    <option v-for="category in localizedCategories" :key="category.id" :value="category.id">
                      {{ category.emoji }} {{ category.title }}
                    </option>
                  </select>
                </div>

                <div class="field">
                  <label class="label">Fiyat (TL)</label>
                  <input v-model.number="productEditForm.price" class="input" type="number" min="0" />
                </div>
              </div>

              <div class="grid">
                <div class="field">
                  <label class="label">Urun Adi (TR)</label>
                  <input v-model="productEditForm.nameTr" class="input" type="text" />
                </div>
                <div class="field">
                  <label class="label">Urun Adi (EN)</label>
                  <input v-model="productEditForm.nameEn" class="input" type="text" />
                </div>
              </div>

              <div class="grid">
                <div class="field">
                  <label class="label">Aciklama (TR)</label>
                  <textarea v-model="productEditForm.descriptionTr" class="textarea" rows="3" />
                </div>
                <div class="field">
                  <label class="label">Aciklama (EN)</label>
                  <textarea v-model="productEditForm.descriptionEn" class="textarea" rows="3" />
                </div>
              </div>

              <div class="field">
                <label class="label">Urun Resmi (degistirmek icin sec)</label>
                <input class="input" type="file" accept="image/*" @change="onEditFileChange" />
              </div>

              <div v-if="editPreviewUrl || productEditForm.imageUrl" class="previewWrap">
                <img :src="editPreviewUrl || productEditForm.imageUrl" alt="product preview" class="preview" />
              </div>

              <div class="inlineActions">
                <UiButton @click="updateProduct" :disabled="loading || !canEditProduct">
                  {{ loading ? "Kaydediliyor..." : "Degisiklikleri Kaydet" }}
                </UiButton>
                <button class="dangerBtn" @click="removeProduct" :disabled="loading">Urunu Sil</button>
              </div>
            </template>
          </template>

          <template v-else-if="activeTab === 'category-create'">
            <h2 class="sectionTitle">Kategori Ekle</h2>

            <div class="field">
              <label class="label">Grup</label>
              <select v-model="categoryCreateForm.groupId" class="input">
                <option value="drinks">Icecek</option>
                <option value="foods">Yemek</option>
              </select>
            </div>

            <div class="grid">
              <div class="field">
                <label class="label">Emoji</label>
                <input v-model="categoryCreateForm.emoji" class="input" type="text" placeholder="🍽️" />
              </div>
              <div class="field">
                <label class="label">Kategori Adi (TR)</label>
                <input v-model="categoryCreateForm.titleTr" class="input" type="text" />
              </div>
            </div>

            <div class="grid">
              <div class="field">
                <label class="label">Kategori Adi (EN)</label>
                <input v-model="categoryCreateForm.titleEn" class="input" type="text" />
              </div>
              <div class="field">
                <label class="label">Aciklama (TR)</label>
                <input v-model="categoryCreateForm.descriptionTr" class="input" type="text" />
              </div>
            </div>

            <div class="field">
              <label class="label">Aciklama (EN)</label>
              <input v-model="categoryCreateForm.descriptionEn" class="input" type="text" />
            </div>

            <UiButton @click="createCategory" :disabled="loading || !canCreateCategory">
              {{ loading ? "Kaydediliyor..." : "Kategori Ekle" }}
            </UiButton>
          </template>

          <template v-else>
            <h2 class="sectionTitle">Kategori Duzenle</h2>

            <div class="field">
              <label class="label">Kategori Sec</label>
              <select v-model="selectedCategoryId" class="input">
                <option disabled value="">Kategori sec</option>
                <option v-for="item in allCategories" :key="item.id" :value="item.id">
                  {{ item.groupId === "drinks" ? "Icecek" : "Yemek" }} | {{ item.titleTr }} / {{ item.titleEn }}
                </option>
              </select>
            </div>

            <template v-if="selectedCategoryId">
              <div class="field">
                <label class="label">Grup</label>
                <select v-model="categoryEditForm.groupId" class="input">
                  <option value="drinks">Icecek</option>
                  <option value="foods">Yemek</option>
                </select>
              </div>

              <div class="grid">
                <div class="field">
                  <label class="label">Emoji</label>
                  <input v-model="categoryEditForm.emoji" class="input" type="text" />
                </div>
                <div class="field">
                  <label class="label">Kategori Adi (TR)</label>
                  <input v-model="categoryEditForm.titleTr" class="input" type="text" />
                </div>
              </div>

              <div class="grid">
                <div class="field">
                  <label class="label">Kategori Adi (EN)</label>
                  <input v-model="categoryEditForm.titleEn" class="input" type="text" />
                </div>
                <div class="field">
                  <label class="label">Aciklama (TR)</label>
                  <input v-model="categoryEditForm.descriptionTr" class="input" type="text" />
                </div>
              </div>

              <div class="field">
                <label class="label">Aciklama (EN)</label>
                <input v-model="categoryEditForm.descriptionEn" class="input" type="text" />
              </div>

              <div class="inlineActions">
                <UiButton @click="updateCategory" :disabled="loading || !canEditCategory">
                  {{ loading ? "Kaydediliyor..." : "Degisiklikleri Kaydet" }}
                </UiButton>
                <button class="dangerBtn" @click="removeCategory" :disabled="loading">Kategoriyi Sil</button>
              </div>
            </template>
          </template>
        </section>

        <section class="card">
          <h2 class="sectionTitle">Mevcut Kayitlar</h2>
          <div class="stats">
            <div>Toplam kategori: {{ allCategories.length }}</div>
            <div>Toplam urun: {{ adminProducts.length }}</div>
          </div>
        </section>

        <div v-if="error" class="card">
          <div class="error">{{ error }}</div>
        </div>
        <div v-if="success" class="card">
          <div class="success">{{ success }}</div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { appStore } from "../store/appStore";
import AppHeader from "../components/AppHeader.vue";
import UiButton from "../components/UiButton.vue";
import { getLocalizedCategories, type MenuGroupId } from "../data/menu";
import { auth, firebaseEnabled } from "../lib/firebase";
import { uploadImageToCloudinary } from "../lib/cloudinary";
import {
  createAdminCategory,
  createAdminProduct,
  removeAdminCategory,
  removeAdminProduct,
  seedCatalogToDatabase,
  subscribeAdminCategories,
  subscribeAdminProducts,
  updateAdminCategory,
  updateAdminProduct,
  type AdminCategoryRow,
  type AdminProductRow,
} from "../services/catalogService";

type AdminTabId = "product-create" | "product-edit" | "category-create" | "category-edit";

const adminTabs: { id: AdminTabId; label: string }[] = [
  { id: "product-create", label: "Urun Ekle" },
  { id: "product-edit", label: "Urun Duzenle" },
  { id: "category-create", label: "Kategori Ekle" },
  { id: "category-edit", label: "Kategori Duzenle" },
];

const activeTab = ref<AdminTabId>("product-create");
const user = ref<User | null>(null);
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");
const selectedProductId = ref("");
const selectedCategoryId = ref("");
const createFile = ref<File | null>(null);
const editFile = ref<File | null>(null);
const createPreviewUrl = ref("");
const editPreviewUrl = ref("");
const adminProducts = ref<AdminProductRow[]>([]);
const drinkCategories = ref<AdminCategoryRow[]>([]);
const foodCategories = ref<AdminCategoryRow[]>([]);

const productCreateForm = reactive({
  categoryId: "",
  nameTr: "",
  nameEn: "",
  descriptionTr: "",
  descriptionEn: "",
  price: 0,
});

const productEditForm = reactive({
  categoryId: "",
  nameTr: "",
  nameEn: "",
  descriptionTr: "",
  descriptionEn: "",
  price: 0,
  imageUrl: "",
});

const categoryCreateForm = reactive({
  groupId: "drinks" as MenuGroupId,
  emoji: "🍽️",
  titleTr: "",
  titleEn: "",
  descriptionTr: "",
  descriptionEn: "",
});

const categoryEditForm = reactive({
  groupId: "drinks" as MenuGroupId,
  emoji: "",
  titleTr: "",
  titleEn: "",
  descriptionTr: "",
  descriptionEn: "",
});

const localizedCategories = computed(() => getLocalizedCategories(appStore.locale));
const allCategories = computed(() => [...drinkCategories.value, ...foodCategories.value]);

const canCreateProduct = computed(() => {
  return Boolean(
    productCreateForm.categoryId &&
      productCreateForm.nameTr.trim() &&
      productCreateForm.nameEn.trim() &&
      productCreateForm.descriptionTr.trim() &&
      productCreateForm.descriptionEn.trim() &&
      productCreateForm.price >= 0
  );
});

const canEditProduct = computed(() => {
  return Boolean(
    selectedProductId.value &&
      productEditForm.categoryId &&
      productEditForm.nameTr.trim() &&
      productEditForm.nameEn.trim() &&
      productEditForm.descriptionTr.trim() &&
      productEditForm.descriptionEn.trim() &&
      productEditForm.price >= 0
  );
});

const canCreateCategory = computed(() => {
  return Boolean(
    categoryCreateForm.emoji.trim() &&
      categoryCreateForm.titleTr.trim() &&
      categoryCreateForm.titleEn.trim() &&
      categoryCreateForm.descriptionTr.trim() &&
      categoryCreateForm.descriptionEn.trim()
  );
});

const canEditCategory = computed(() => {
  return Boolean(
    selectedCategoryId.value &&
      categoryEditForm.emoji.trim() &&
      categoryEditForm.titleTr.trim() &&
      categoryEditForm.titleEn.trim() &&
      categoryEditForm.descriptionTr.trim() &&
      categoryEditForm.descriptionEn.trim()
  );
});

let stopAuth: (() => void) | null = null;
let stopProducts: (() => void) | null = null;
let stopDrinkCategories: (() => void) | null = null;
let stopFoodCategories: (() => void) | null = null;

watch(selectedProductId, (nextId) => {
  const product = adminProducts.value.find((item) => item.id === nextId);
  if (!product) return;

  productEditForm.categoryId = product.categoryId;
  productEditForm.nameTr = product.nameTr;
  productEditForm.nameEn = product.nameEn;
  productEditForm.descriptionTr = product.descriptionTr;
  productEditForm.descriptionEn = product.descriptionEn;
  productEditForm.price = product.price;
  productEditForm.imageUrl = product.imageUrl || "";
  clearEditFileState();
});

watch(selectedCategoryId, (nextId) => {
  const category = allCategories.value.find((item) => item.id === nextId);
  if (!category) return;

  categoryEditForm.groupId = category.groupId;
  categoryEditForm.emoji = category.emoji;
  categoryEditForm.titleTr = category.titleTr;
  categoryEditForm.titleEn = category.titleEn;
  categoryEditForm.descriptionTr = category.descriptionTr;
  categoryEditForm.descriptionEn = category.descriptionEn;
});

onMounted(() => {
  if (!auth) return;

  stopAuth = onAuthStateChanged(auth, (nextUser) => {
    user.value = nextUser;
  });

  stopProducts = subscribeAdminProducts((rows) => {
    adminProducts.value = rows;
    if (selectedProductId.value && !rows.some((item) => item.id === selectedProductId.value)) {
      selectedProductId.value = "";
    }
  });

  stopDrinkCategories = subscribeAdminCategories("drinks", (rows) => {
    drinkCategories.value = rows;
    if (selectedCategoryId.value && !allCategories.value.some((item) => item.id === selectedCategoryId.value)) {
      selectedCategoryId.value = "";
    }
  });

  stopFoodCategories = subscribeAdminCategories("foods", (rows) => {
    foodCategories.value = rows;
    if (selectedCategoryId.value && !allCategories.value.some((item) => item.id === selectedCategoryId.value)) {
      selectedCategoryId.value = "";
    }
  });
});

onBeforeUnmount(() => {
  if (stopAuth) stopAuth();
  if (stopProducts) stopProducts();
  if (stopDrinkCategories) stopDrinkCategories();
  if (stopFoodCategories) stopFoodCategories();
  clearCreateFileState();
  clearEditFileState();
});

function clearMessages() {
  error.value = "";
  success.value = "";
}

function clearCreateFileState() {
  createFile.value = null;
  if (createPreviewUrl.value) URL.revokeObjectURL(createPreviewUrl.value);
  createPreviewUrl.value = "";
}

function clearEditFileState() {
  editFile.value = null;
  if (editPreviewUrl.value) URL.revokeObjectURL(editPreviewUrl.value);
  editPreviewUrl.value = "";
}

async function signIn() {
  clearMessages();
  if (!auth) return;

  try {
    loading.value = true;
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value);
  } catch {
    error.value = "Giris basarisiz. Email/sifre bilgisini kontrol et.";
  } finally {
    loading.value = false;
  }
}

async function signOutUser() {
  clearMessages();
  if (!auth) return;
  await signOut(auth);
}

function onCreateFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;
  createFile.value = file;
  if (createPreviewUrl.value) URL.revokeObjectURL(createPreviewUrl.value);
  createPreviewUrl.value = file ? URL.createObjectURL(file) : "";
}

function onEditFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;
  editFile.value = file;
  if (editPreviewUrl.value) URL.revokeObjectURL(editPreviewUrl.value);
  editPreviewUrl.value = file ? URL.createObjectURL(file) : "";
}

function resetCreateProductForm() {
  productCreateForm.categoryId = "";
  productCreateForm.nameTr = "";
  productCreateForm.nameEn = "";
  productCreateForm.descriptionTr = "";
  productCreateForm.descriptionEn = "";
  productCreateForm.price = 0;
  clearCreateFileState();
}

function resetCreateCategoryForm() {
  categoryCreateForm.groupId = "drinks";
  categoryCreateForm.emoji = "🍽️";
  categoryCreateForm.titleTr = "";
  categoryCreateForm.titleEn = "";
  categoryCreateForm.descriptionTr = "";
  categoryCreateForm.descriptionEn = "";
}

async function createProduct() {
  clearMessages();
  if (!canCreateProduct.value) return;

  try {
    loading.value = true;
    const imageUrl = createFile.value ? await uploadImageToCloudinary(createFile.value) : "";

    await createAdminProduct({
      categoryId: productCreateForm.categoryId,
      nameTr: productCreateForm.nameTr.trim(),
      nameEn: productCreateForm.nameEn.trim(),
      descriptionTr: productCreateForm.descriptionTr.trim(),
      descriptionEn: productCreateForm.descriptionEn.trim(),
      price: Number(productCreateForm.price),
      imageUrl,
    });

    success.value = "Urun eklendi.";
    resetCreateProductForm();
  } catch {
    error.value = "Urun eklenemedi.";
  } finally {
    loading.value = false;
  }
}

async function updateProduct() {
  clearMessages();
  if (!canEditProduct.value || !selectedProductId.value) return;

  try {
    loading.value = true;

    let imageUrl = productEditForm.imageUrl;
    if (editFile.value) {
      imageUrl = await uploadImageToCloudinary(editFile.value);
    }

    await updateAdminProduct(selectedProductId.value, {
      categoryId: productEditForm.categoryId,
      nameTr: productEditForm.nameTr.trim(),
      nameEn: productEditForm.nameEn.trim(),
      descriptionTr: productEditForm.descriptionTr.trim(),
      descriptionEn: productEditForm.descriptionEn.trim(),
      price: Number(productEditForm.price),
      imageUrl,
    });

    success.value = "Urun guncellendi.";
    clearEditFileState();
  } catch {
    error.value = "Urun guncellenemedi.";
  } finally {
    loading.value = false;
  }
}

async function removeProduct() {
  clearMessages();
  if (!selectedProductId.value) return;
  const approved = window.confirm("Bu urunu silmek istedigine emin misin?");
  if (!approved) return;

  try {
    loading.value = true;
    await removeAdminProduct(selectedProductId.value);
    selectedProductId.value = "";
    success.value = "Urun silindi.";
  } catch {
    error.value = "Urun silinemedi.";
  } finally {
    loading.value = false;
  }
}

async function createCategory() {
  clearMessages();
  if (!canCreateCategory.value) return;

  try {
    loading.value = true;
    await createAdminCategory({
      groupId: categoryCreateForm.groupId,
      emoji: categoryCreateForm.emoji.trim(),
      titleTr: categoryCreateForm.titleTr.trim(),
      titleEn: categoryCreateForm.titleEn.trim(),
      descriptionTr: categoryCreateForm.descriptionTr.trim(),
      descriptionEn: categoryCreateForm.descriptionEn.trim(),
    });

    success.value = "Kategori eklendi.";
    resetCreateCategoryForm();
  } catch {
    error.value = "Kategori eklenemedi.";
  } finally {
    loading.value = false;
  }
}

async function updateCategory() {
  clearMessages();
  if (!canEditCategory.value || !selectedCategoryId.value) return;

  try {
    loading.value = true;
    await updateAdminCategory(selectedCategoryId.value, {
      groupId: categoryEditForm.groupId,
      emoji: categoryEditForm.emoji.trim(),
      titleTr: categoryEditForm.titleTr.trim(),
      titleEn: categoryEditForm.titleEn.trim(),
      descriptionTr: categoryEditForm.descriptionTr.trim(),
      descriptionEn: categoryEditForm.descriptionEn.trim(),
    });

    success.value = "Kategori guncellendi.";
  } catch {
    error.value = "Kategori guncellenemedi.";
  } finally {
    loading.value = false;
  }
}

async function removeCategory() {
  clearMessages();
  if (!selectedCategoryId.value) return;

  const hasProductsInCategory = adminProducts.value.some((item) => item.categoryId === selectedCategoryId.value);
  if (hasProductsInCategory) {
    error.value = "Bu kategoride urun var. Once urunleri bu kategoriden kaldir.";
    return;
  }

  try {
    loading.value = true;
    await removeAdminCategory(selectedCategoryId.value);
    selectedCategoryId.value = "";
    success.value = "Kategori silindi.";
  } catch {
    error.value = "Kategori silinemedi.";
  } finally {
    loading.value = false;
  }
}

async function seedDatabase() {
  clearMessages();
  try {
    loading.value = true;
    await seedCatalogToDatabase();
    success.value = "Static kategori ve urunler Firestore'a yazildi.";
  } catch {
    error.value = "Seed islemi basarisiz. Firestore yetkilerini kontrol et.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page {
  min-height: 100dvh;
}

.content {
  display: grid;
  gap: 12px;
  padding: 8px 16px 24px;
}

.card {
  border-radius: 18px;
  border: 1px solid var(--stroke);
  background: var(--card);
  padding: 14px;
  display: grid;
  gap: 10px;
}

.headRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.headActions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sectionTitle {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
}

.sectionText {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.tabBtn {
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: transparent;
  color: var(--text);
  padding: 9px 12px;
  font-weight: 800;
  cursor: pointer;
}

.tabBtn.active {
  background: rgba(31, 111, 74, 0.25);
}

.pill {
  border-radius: 999px;
  padding: 8px 12px;
  border: 1px solid var(--stroke);
  background: transparent;
  color: var(--text);
  font-weight: 800;
  cursor: pointer;
}

.grid {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
}

.field {
  display: grid;
  gap: 6px;
}

.label {
  font-size: 12px;
  color: var(--muted);
  font-weight: 800;
}

.input,
.textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--stroke);
  background: var(--input);
  color: var(--text);
  padding: 10px 12px;
  outline: none;
}

.textarea {
  resize: vertical;
}

.previewWrap {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--stroke);
}

.preview {
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  object-position: center;
  display: block;
}

.inlineActions {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.dangerBtn {
  border-radius: 12px;
  border: 1px solid #cc4c4c;
  color: #ffd6d6;
  background: rgba(151, 44, 44, 0.15);
  font-weight: 800;
  padding: 10px 12px;
  cursor: pointer;
}

.stats {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.warn,
.error,
.success {
  font-size: 13px;
}

.warn,
.error {
  color: #ff9e9e;
}

.success {
  color: #9be2a2;
}

@media (max-width: 640px) {
  .headRow {
    flex-direction: column;
    align-items: flex-start;
  }

  .tabs {
    grid-template-columns: 1fr;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .inlineActions {
    grid-template-columns: 1fr;
  }
}
</style>
