export type MenuLocale = "tr" | "en";

type LocalizedText = {
  tr: string;
  en: string;
};

type LocalizedTags = {
  tr: string[];
  en: string[];
};

export type Category = {
  id: string;
  emoji: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type Product = {
  id: string;
  categoryId: string;
  title: LocalizedText;
  description: LocalizedText;
  price: number;
  tags?: LocalizedTags;
};

export type LocalizedCategory = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

export type LocalizedProduct = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  tags?: string[];
};

export const cafeInfo = {
  name: "cremore",
  tagline: "coffee",
};

export const categories: Category[] = [
  {
    id: "coffee",
    emoji: "☕",
    title: { tr: "Kahveler", en: "Coffees" },
    description: { tr: "Espresso bazli ve filtre secenekler", en: "Espresso-based and filter options" },
  },
  {
    id: "tea",
    emoji: "🍵",
    title: { tr: "Caylar", en: "Teas" },
    description: { tr: "Klasik ve bitki caylari", en: "Classic and herbal tea options" },
  },
  {
    id: "soft",
    emoji: "🥤",
    title: { tr: "Mesrubatlar", en: "Soft Drinks" },
    description: { tr: "Soguk icecekler ve sodalar", en: "Cold drinks and sodas" },
  },
  {
    id: "breakfast",
    emoji: "🥐",
    title: { tr: "Kahvaltilar", en: "Breakfast" },
    description: { tr: "Gune guzel basla", en: "Start your day right" },
  },
];

export const products: Product[] = [
  {
    id: "latte",
    categoryId: "coffee",
    title: { tr: "Latte", en: "Latte" },
    description: { tr: "Espresso + sut kopugu", en: "Espresso + steamed milk foam" },
    price: 110,
    tags: { tr: ["Sicak"], en: ["Hot"] },
  },
  {
    id: "americano",
    categoryId: "coffee",
    title: { tr: "Americano", en: "Americano" },
    description: { tr: "Espresso + sicak su", en: "Espresso + hot water" },
    price: 95,
    tags: { tr: ["Sicak"], en: ["Hot"] },
  },
  {
    id: "flatwhite",
    categoryId: "coffee",
    title: { tr: "Flat White", en: "Flat White" },
    description: { tr: "Yogun espresso + mikro kopuk", en: "Rich espresso + microfoam" },
    price: 115,
  },
  {
    id: "turkish-tea",
    categoryId: "tea",
    title: { tr: "Demleme Cay", en: "Brewed Turkish Tea" },
    description: { tr: "Ince belli bardakta", en: "Served in a classic tulip glass" },
    price: 35,
    tags: { tr: ["Klasik"], en: ["Classic"] },
  },
  {
    id: "herbal",
    categoryId: "tea",
    title: { tr: "Bitki Cayi", en: "Herbal Tea" },
    description: { tr: "Papatya / Ihlamur / Adacayi", en: "Chamomile / Linden / Sage" },
    price: 65,
  },
  {
    id: "cola",
    categoryId: "soft",
    title: { tr: "Kola", en: "Cola" },
    description: { tr: "330 ml", en: "330 ml" },
    price: 55,
  },
  {
    id: "soda",
    categoryId: "soft",
    title: { tr: "Soda", en: "Soda Water" },
    description: { tr: "Maden suyu", en: "Mineral water" },
    price: 35,
  },
  {
    id: "serpme",
    categoryId: "breakfast",
    title: { tr: "Serpme Kahvalti", en: "Turkish Breakfast Platter" },
    description: {
      tr: "Peynir tabagi, zeytin, recel, yumurta",
      en: "Cheese plate, olives, jams and eggs",
    },
    price: 260,
    tags: { tr: ["Paylasimlik"], en: ["Sharing"] },
  },
  {
    id: "toast",
    categoryId: "breakfast",
    title: { tr: "Karisik Tost", en: "Mixed Toast" },
    description: { tr: "Kasar + sucuk", en: "Cheddar + sujuk" },
    price: 140,
  },
];

function localizeText(text: LocalizedText, locale: MenuLocale) {
  return text[locale];
}

function localizeTags(tags: LocalizedTags | undefined, locale: MenuLocale) {
  return tags ? tags[locale] : undefined;
}

export function localizeCategory(category: Category, locale: MenuLocale): LocalizedCategory {
  return {
    id: category.id,
    emoji: category.emoji,
    title: localizeText(category.title, locale),
    description: localizeText(category.description, locale),
  };
}

export function localizeProduct(product: Product, locale: MenuLocale): LocalizedProduct {
  return {
    id: product.id,
    categoryId: product.categoryId,
    title: localizeText(product.title, locale),
    description: localizeText(product.description, locale),
    price: product.price,
    tags: localizeTags(product.tags, locale),
  };
}

export function getCategoryById(id: string) {
  return categories.find((category) => category.id === id);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(categoryId: string) {
  return products.filter((product) => product.categoryId === categoryId);
}

export function getLocalizedCategories(locale: MenuLocale) {
  return categories.map((category) => localizeCategory(category, locale));
}

export function getLocalizedCategoryById(id: string, locale: MenuLocale) {
  const category = getCategoryById(id);
  return category ? localizeCategory(category, locale) : undefined;
}

export function getLocalizedProductById(id: string, locale: MenuLocale) {
  const product = getProductById(id);
  return product ? localizeProduct(product, locale) : undefined;
}

export function getLocalizedProductsByCategory(categoryId: string, locale: MenuLocale) {
  return getProductsByCategory(categoryId).map((product) => localizeProduct(product, locale));
}
