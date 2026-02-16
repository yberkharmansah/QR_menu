import { computed, reactive } from "vue";
import { getLocalizedProductById, getProductById } from "../data/menu";

export type Theme = "dark" | "light";
type Locale = "tr" | "en";

type CartItem = { productId: string; qty: number };

export const THEMES: Theme[] = ["dark", "light"];

const dict = {
  tr: {
    menu: "Menu",
    categories: "Kategoriler",
    goCategories: "Kategorilere Git",
    searchCategory: "Kategori ara",
    searchProduct: "Urun ara",
    addToCart: "Sepete Ekle",
    addedDemo: "Demo: urun sepete eklendi",
    cart: "Sepet",
    total: "Toplam",
    emptyCart: "Sepet bos",
    clear: "Temizle",
    close: "Kapat",
    qty: "Adet",
    increase: "Arttir",
    decrease: "Azalt",
    theme: "Tema",
    language: "Dil",
    sort: "Sirala",
    sortAsc: "Fiyat: Artan",
    price: "Fiyat",
    tags: "Etiketler",
    back: "Geri",
    welcome: "QR menuye hos geldin. Kategorilerden urunlere goz at.",
    flowHint: "Sunum akisi: Giris -> Kategoriler -> Urunler -> Detay",
    chooseTheme: "Demo Tema Secimi",
    chooseThemeHint: "Tema secimi tum sayfalara aninda uygulanir.",
    themeForest: "Emerald Night",
    themeForestDesc: "Mevcut tema. Koyu zemin, zengin yesil vurgular.",
    themeIvory: "Ivory Reserve",
    themeIvoryDesc: "Acik ve premium gorunum. Sicak krem tonlari.",
    themeRoyal: "Midnight Gold",
    themeRoyalDesc: "Luks gece hissi. Lacivert ve altin detaylar.",
    socialAccounts: "Sosyal Medya Hesaplarımız",
  },
  en: {
    menu: "Menu",
    categories: "Categories",
    goCategories: "Go to categories",
    searchCategory: "Search category",
    searchProduct: "Search product",
    addToCart: "Add to cart",
    addedDemo: "Demo: item added to cart",
    cart: "Cart",
    total: "Total",
    emptyCart: "Cart is empty",
    clear: "Clear",
    close: "Close",
    qty: "Qty",
    increase: "Increase",
    decrease: "Decrease",
    theme: "Theme",
    language: "Language",
    sort: "Sort",
    sortAsc: "Price: Ascending",
    price: "Price",
    tags: "Tags",
    back: "Back",
    welcome: "Welcome to the QR menu. Browse products by categories.",
    flowHint: "Demo flow: Home -> Categories -> Products -> Detail",
    chooseTheme: "Demo Theme Selection",
    chooseThemeHint: "Your selected theme applies instantly to all pages.",
    themeForest: "Emerald Night",
    themeForestDesc: "Current visual style with deep green accents.",
    themeIvory: "Ivory Reserve",
    themeIvoryDesc: "Bright premium style with warm ivory tones.",
    themeRoyal: "Midnight Gold",
    themeRoyalDesc: "Luxury night mode with navy and gold contrast.",
    socialAccounts: "Our Social Media Accounts",
  },
} as const;

function normalizeTheme(raw: string | null): Theme {
  if (raw === "dark" || raw === "light") return raw;
  if (raw === "forest" || raw === "royal") return "dark";
  if (raw === "ivory") return "light";
  return "dark";
}

export const appStore = reactive({
  locale: (localStorage.getItem("locale") as Locale) || "tr",
  theme: normalizeTheme(localStorage.getItem("theme")),
  cartOpen: false,
  cart: [] as CartItem[],
});

export function t(key: keyof typeof dict.tr) {
  return dict[appStore.locale][key];
}

export function setLocale(locale: Locale) {
  appStore.locale = locale;
  localStorage.setItem("locale", locale);
}

export function setTheme(theme: Theme) {
  appStore.theme = theme;
  localStorage.setItem("theme", theme);
  document.documentElement.dataset.theme = theme;
}

export function cycleTheme() {
  setTheme(appStore.theme === "dark" ? "light" : "dark");
}

export function toggleCart(open?: boolean) {
  appStore.cartOpen = open ?? !appStore.cartOpen;
}

export function addToCart(productId: string, qty = 1) {
  const item = appStore.cart.find((x) => x.productId === productId);
  if (item) item.qty += qty;
  else appStore.cart.push({ productId, qty });
  appStore.cartOpen = true;
}

export function inc(productId: string) {
  addToCart(productId, 1);
}

export function dec(productId: string) {
  const item = appStore.cart.find((x) => x.productId === productId);
  if (!item) return;
  item.qty -= 1;
  if (item.qty <= 0) appStore.cart = appStore.cart.filter((x) => x.productId !== productId);
}

export function clearCart() {
  appStore.cart = [];
}

export const cartCount = computed(() => appStore.cart.reduce((sum, line) => sum + line.qty, 0));

export const cartTotal = computed(() => {
  return appStore.cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product?.price ?? 0) * item.qty;
  }, 0);
});

export const cartLines = computed(() => {
  return appStore.cart
    .map((item) => {
      const product = getLocalizedProductById(item.productId, appStore.locale);
      return product ? { ...item, title: product.title, price: product.price } : null;
    })
    .filter(Boolean) as Array<{ productId: string; qty: number; title: string; price: number }>;
});
