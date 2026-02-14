export type MenuLocale = "tr" | "en";

export type MenuGroupId = "drinks" | "foods";

type LocalizedText = {
  tr: string;
  en: string;
};

type LocalizedTags = {
  tr: string[];
  en: string[];
};

export type MenuGroup = {
  id: MenuGroupId;
  emoji: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type Category = {
  id: string;
  groupId: MenuGroupId;
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
  imageUrl?: string;
  tags?: LocalizedTags;
};

export type LocalizedGroup = {
  id: MenuGroupId;
  emoji: string;
  title: string;
  description: string;
};

export type LocalizedCategory = {
  id: string;
  groupId: MenuGroupId;
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
  imageUrl?: string;
  tags?: string[];
};

export const cafeInfo = {
  name: "cremore",
  tagline: "coffee",
};

export const menuGroups: MenuGroup[] = [
  {
    id: "drinks",
    emoji: "🥤",
    title: { tr: "Icecekler", en: "Drinks" },
    description: { tr: "Sicak, soguk ve ozel icecekler", en: "Hot, cold and signature beverages" },
  },
  {
    id: "foods",
    emoji: "🍽️",
    title: { tr: "Yiyecekler", en: "Foods" },
    description: { tr: "Kahvalti, ana yemek ve tatlilar", en: "Breakfast, mains and desserts" },
  },
];

export const seedCategories: Category[] = [
  { id: "hot-coffee", groupId: "drinks", emoji: "☕", title: { tr: "Sicak Kahveler", en: "Hot Coffees" }, description: { tr: "Espresso bazli kahveler", en: "Espresso based coffees" } },
  { id: "hot-drinks", groupId: "drinks", emoji: "🍫", title: { tr: "Sicak Icecekler", en: "Hot Drinks" }, description: { tr: "Kahve disi sicak lezzetler", en: "Warm non-coffee drinks" } },
  { id: "teas", groupId: "drinks", emoji: "🍵", title: { tr: "Caylar", en: "Teas" }, description: { tr: "Demleme ve bitki caylari", en: "Brewed and herbal teas" } },
  { id: "soft-drinks", groupId: "drinks", emoji: "🥤", title: { tr: "Mesrubatlar", en: "Soft Drinks" }, description: { tr: "Klasik soguk icecekler", en: "Classic cold beverages" } },
  { id: "fresh-juices", groupId: "drinks", emoji: "🍊", title: { tr: "Sikma Meyve Sulari", en: "Fresh Juices" }, description: { tr: "Taze sikim secenekler", en: "Freshly squeezed options" } },
  { id: "cocktails", groupId: "drinks", emoji: "🍹", title: { tr: "Kokteyl", en: "Cocktails" }, description: { tr: "Cremore imza kokteyller", en: "Cremore signature cocktails" } },
  { id: "frozen", groupId: "drinks", emoji: "❄️", title: { tr: "Frozen", en: "Frozen" }, description: { tr: "Meyveli buzlu icecekler", en: "Icy fruit based drinks" } },
  { id: "milkshake", groupId: "drinks", emoji: "🥛", title: { tr: "Milkshake", en: "Milkshake" }, description: { tr: "Yogun sutlu icecekler", en: "Rich milk based shakes" } },

  { id: "breakfast", groupId: "foods", emoji: "🍳", title: { tr: "Kahvalti", en: "Breakfast" }, description: { tr: "Serpme ve omlet cesitleri", en: "Breakfast plates and omelets" } },
  { id: "toasts", groupId: "foods", emoji: "🥪", title: { tr: "Tostlar", en: "Toasts" }, description: { tr: "Bazlama ve klasik tostlar", en: "Bazlama and classic toasts" } },
  { id: "gozleme", groupId: "foods", emoji: "🫓", title: { tr: "Gozlemeler", en: "Gozleme" }, description: { tr: "Taze hazirlanan gozleme cesitleri", en: "Freshly prepared gozleme options" } },
  { id: "soups", groupId: "foods", emoji: "🍲", title: { tr: "Corba", en: "Soup" }, description: { tr: "Gunun corbasi", en: "Soup of the day" } },
  { id: "appetizers", groupId: "foods", emoji: "🍟", title: { tr: "Aperatifler", en: "Appetizers" }, description: { tr: "Atistirmalik tabaklar", en: "Snack and sharing plates" } },
  { id: "fix", groupId: "foods", emoji: "🍛", title: { tr: "Fix", en: "Fix Menu" }, description: { tr: "Secimli tabaklar", en: "Choice based set plates" } },
  { id: "salads-bowls", groupId: "foods", emoji: "🥗", title: { tr: "Salatalar ve Bowl", en: "Salads and Bowls" }, description: { tr: "Hafif ve doyurucu secenekler", en: "Light and filling options" } },
  { id: "pastas", groupId: "foods", emoji: "🍝", title: { tr: "Makarnalar", en: "Pastas" }, description: { tr: "Makarna ve noodle cesitleri", en: "Pasta and noodle dishes" } },
  { id: "mains", groupId: "foods", emoji: "🥩", title: { tr: "Ana Yemekler", en: "Main Courses" }, description: { tr: "Et ve tavuk ana yemekler", en: "Meat and chicken mains" } },
  { id: "wraps", groupId: "foods", emoji: "🌯", title: { tr: "Wrap", en: "Wrap" }, description: { tr: "Tavuk ve antrikot wrap secenekleri", en: "Chicken and steak wrap options" } },
  { id: "pizzas", groupId: "foods", emoji: "🍕", title: { tr: "Pizzalar", en: "Pizzas" }, description: { tr: "Orta ve buyuk boy pizzalar", en: "Medium and large pizzas" } },
  { id: "burgers", groupId: "foods", emoji: "🍔", title: { tr: "Hamburger", en: "Burgers" }, description: { tr: "Cremore burger secimi", en: "Cremore burger selection" } },
  { id: "desserts", groupId: "foods", emoji: "🍰", title: { tr: "Tatlilar", en: "Desserts" }, description: { tr: "Gunluk tatli cesitleri", en: "Daily dessert options" } },
];

export const seedProducts: Product[] = [
  { id: "espresso-double", categoryId: "hot-coffee", title: { tr: "Espresso Double", en: "Espresso Double" }, description: { tr: "Yogun cift shot espresso", en: "Intense double shot espresso" }, price: 95, tags: { tr: ["Sicak"], en: ["Hot"] } },
  { id: "espresso-single", categoryId: "hot-coffee", title: { tr: "Espresso Single", en: "Espresso Single" }, description: { tr: "Tek shot klasik espresso", en: "Single shot classic espresso" }, price: 80, tags: { tr: ["Sicak"], en: ["Hot"] } },
  { id: "cafe-latte", categoryId: "hot-coffee", title: { tr: "Cafe Latte", en: "Cafe Latte" }, description: { tr: "Espresso ve ipeksi sut kopugu", en: "Espresso with silky milk foam" }, price: 120, tags: { tr: ["Sicak"], en: ["Hot"] } },
  { id: "americano", categoryId: "hot-coffee", title: { tr: "Americano", en: "Americano" }, description: { tr: "Espresso ve sicak su", en: "Espresso with hot water" }, price: 105, tags: { tr: ["Sicak"], en: ["Hot"] } },
  { id: "flat-white", categoryId: "hot-coffee", title: { tr: "Flat White", en: "Flat White" }, description: { tr: "Kuvvetli espresso mikro kopuk", en: "Strong espresso with microfoam" }, price: 125 },
  { id: "cortudo", categoryId: "hot-coffee", title: { tr: "Cortudo", en: "Cortudo" }, description: { tr: "Dengeli espresso sut dokunusu", en: "Balanced espresso with milk touch" }, price: 115 },
  { id: "vanilya-latte", categoryId: "hot-coffee", title: { tr: "Vanilya Latte", en: "Vanilla Latte" }, description: { tr: "Vanilya aromali latte", en: "Latte with vanilla flavor" }, price: 140 },
  { id: "findik-latte", categoryId: "hot-coffee", title: { tr: "Findik Latte", en: "Hazelnut Latte" }, description: { tr: "Findik aromali latte", en: "Latte with hazelnut flavor" }, price: 140 },
  { id: "mocha", categoryId: "hot-coffee", title: { tr: "Mocha", en: "Mocha" }, description: { tr: "Kahve ve cikolata uyumu", en: "Coffee and chocolate blend" }, price: 145 },
  { id: "white-chocolate-mocha", categoryId: "hot-coffee", title: { tr: "White Chocolate Mocha", en: "White Chocolate Mocha" }, description: { tr: "Beyaz cikolatali mocha", en: "Mocha with white chocolate" }, price: 155 },
  { id: "caramel-latte", categoryId: "hot-coffee", title: { tr: "Caramel Latte", en: "Caramel Latte" }, description: { tr: "Karamel soslu latte", en: "Latte with caramel sauce" }, price: 145 },
  { id: "zebra", categoryId: "hot-coffee", title: { tr: "Zebra", en: "Zebra" }, description: { tr: "Beyaz ve sutlu cikolata dengesi", en: "Dark and white chocolate harmony" }, price: 160 },
  { id: "cafe-bonbon", categoryId: "hot-coffee", title: { tr: "Cafe Bonbon", en: "Cafe Bonbon" }, description: { tr: "Espresso ve yogun sut bazli", en: "Espresso with dense milk base" }, price: 145 },
  { id: "cappuchino", categoryId: "hot-coffee", title: { tr: "Cappuchino", en: "Cappuccino" }, description: { tr: "Bol kopuklu klasik cappuccino", en: "Classic cappuccino with rich foam" }, price: 120 },
  { id: "filtre-kahve", categoryId: "hot-coffee", title: { tr: "Filtre Kahve", en: "Filter Coffee" }, description: { tr: "Gunluk taze demlenmis", en: "Freshly brewed daily" }, price: 100 },
  { id: "karamelize-biskuvi-latte", categoryId: "hot-coffee", title: { tr: "Karamelize Biskuvili Latte", en: "Caramelized Biscuit Latte" }, description: { tr: "Biskuvi aromasi ve latte", en: "Biscuit notes blended with latte" }, price: 160 },
  { id: "cookie-latte", categoryId: "hot-coffee", title: { tr: "Cookie Latte", en: "Cookie Latte" }, description: { tr: "Kurabiye aromali latte", en: "Latte with cookie flavor" }, price: 160 },
  { id: "turk-kahvesi", categoryId: "hot-coffee", title: { tr: "Turk Kahvesi", en: "Turkish Coffee" }, description: { tr: "Geleneksel pisirim", en: "Traditional Turkish brew" }, price: 95 },

  { id: "sahlep", categoryId: "hot-drinks", title: { tr: "Sahlep", en: "Salep" }, description: { tr: "Tarcin ile servis edilir", en: "Served with cinnamon" }, price: 110 },
  { id: "sicak-cikolata", categoryId: "hot-drinks", title: { tr: "Sicak Cikolata", en: "Hot Chocolate" }, description: { tr: "Yogun cikolata lezzeti", en: "Rich and creamy chocolate" }, price: 120 },
  { id: "cay", categoryId: "teas", title: { tr: "Cay", en: "Tea" }, description: { tr: "Demleme ince belli cay", en: "Fresh brewed Turkish tea" }, price: 35 },
  { id: "bitki-caylari", categoryId: "teas", title: { tr: "Bitki Caylari", en: "Herbal Teas" }, description: { tr: "Ihlamur, kis cayi, kusburnu", en: "Linden, winter tea, rosehip" }, price: 70 },
  { id: "soguk-cay", categoryId: "soft-drinks", title: { tr: "Soguk Cay", en: "Iced Tea" }, description: { tr: "Soguk servis", en: "Served chilled" }, price: 60 },
  { id: "kola", categoryId: "soft-drinks", title: { tr: "Kola", en: "Cola" }, description: { tr: "330 ml", en: "330 ml" }, price: 55 },
  { id: "gazoz", categoryId: "soft-drinks", title: { tr: "Gazoz", en: "Soda Pop" }, description: { tr: "Klasik gazli icecek", en: "Classic fizzy soft drink" }, price: 50 },
  { id: "soda", categoryId: "soft-drinks", title: { tr: "Soda", en: "Mineral Water" }, description: { tr: "Maden suyu", en: "Sparkling mineral water" }, price: 35 },
  { id: "taze-portakal", categoryId: "fresh-juices", title: { tr: "Taze Sikilmis Portakal Suyu", en: "Fresh Orange Juice" }, description: { tr: "Anlik sikim", en: "Freshly squeezed to order" }, price: 95 },
  { id: "atom", categoryId: "fresh-juices", title: { tr: "Atom", en: "Atom" }, description: { tr: "Karisik meyve guclendirici", en: "Energy boosting mixed fruit" }, price: 120 },
  { id: "cremore-kokteyl", categoryId: "cocktails", title: { tr: "Cremore Kokteyl", en: "Cremore Cocktail" }, description: { tr: "Evin imza tarifi", en: "House signature recipe" }, price: 150 },
  { id: "ocean-prime", categoryId: "cocktails", title: { tr: "Ocean Prime", en: "Ocean Prime" }, description: { tr: "Ferah mavi kokteyl", en: "Refreshing ocean-inspired mix" }, price: 155 },
  { id: "klasik-mojito", categoryId: "cocktails", title: { tr: "Klasik Mojito", en: "Classic Mojito" }, description: { tr: "Nane ve lime aromasi", en: "Mint and lime balance" }, price: 145 },
  { id: "cremore-mojito", categoryId: "cocktails", title: { tr: "Cremore Mojito", en: "Cremore Mojito" }, description: { tr: "Cremore usulu mojito", en: "Cremore style mojito" }, price: 155 },
  { id: "frozen-cilek", categoryId: "frozen", title: { tr: "Frozen Cilek", en: "Strawberry Frozen" }, description: { tr: "Cilek aromali", en: "Strawberry flavor" }, price: 140 },
  { id: "frozen-mango", categoryId: "frozen", title: { tr: "Frozen Mango", en: "Mango Frozen" }, description: { tr: "Mango aromali", en: "Mango flavor" }, price: 140 },
  { id: "frozen-ananas", categoryId: "frozen", title: { tr: "Frozen Ananas", en: "Pineapple Frozen" }, description: { tr: "Ananas aromali", en: "Pineapple flavor" }, price: 140 },
  { id: "frozen-mango-ananas", categoryId: "frozen", title: { tr: "Frozen Mango-Ananas", en: "Mango-Pineapple Frozen" }, description: { tr: "Mango ve ananas karisimi", en: "Mango and pineapple blend" }, price: 145 },
  { id: "frozen-carkifelek", categoryId: "frozen", title: { tr: "Frozen Carkifelek", en: "Passion Fruit Frozen" }, description: { tr: "Carkifelek aromali", en: "Passion fruit flavor" }, price: 145 },
  { id: "milkshake-cilek", categoryId: "milkshake", title: { tr: "Milkshake Cilek", en: "Strawberry Milkshake" }, description: { tr: "Yogun cilekli milkshake", en: "Creamy strawberry milkshake" }, price: 145 },
  { id: "milkshake-karamel", categoryId: "milkshake", title: { tr: "Milkshake Karamel", en: "Caramel Milkshake" }, description: { tr: "Karamel soslu milkshake", en: "Milkshake with caramel sauce" }, price: 145 },

  { id: "cremore-kahvalti", categoryId: "breakfast", title: { tr: "Cremore Kahvalti", en: "Cremore Breakfast" }, description: { tr: "Serpme kahvalti tabagi", en: "Rich Turkish breakfast platter" }, price: 360 },
  { id: "hizli-ve-leziz", categoryId: "breakfast", title: { tr: "Hizli ve Leziz", en: "Quick and Tasty" }, description: { tr: "Hafif kahvalti tabagi", en: "Light breakfast plate" }, price: 180 },
  { id: "soguk-sandvic", categoryId: "breakfast", title: { tr: "Soguk Sandvic", en: "Cold Sandwich" }, description: { tr: "Hindi fume ve peynirli", en: "Turkey and cheese sandwich" }, price: 150 },
  { id: "sade-omlet", categoryId: "breakfast", title: { tr: "Sade Omlet", en: "Plain Omelet" }, description: { tr: "Klasik omlet", en: "Classic omelet" }, price: 80 },
  { id: "peynirli-omlet", categoryId: "breakfast", title: { tr: "Peynirli Omlet", en: "Cheese Omelet" }, description: { tr: "Yumurta ve peynir", en: "Egg and cheese" }, price: 100 },
  { id: "sebzeli-omlet", categoryId: "breakfast", title: { tr: "Sebzeli Omlet", en: "Vegetable Omelet" }, description: { tr: "Yumurta, biber, mantar", en: "Egg, peppers, mushrooms" }, price: 100 },
  { id: "sahanda-yumurta", categoryId: "breakfast", title: { tr: "Sahanda Yumurta", en: "Sunny Side Egg" }, description: { tr: "Goz yumurta", en: "Pan-fried egg" }, price: 80 },
  { id: "menemen", categoryId: "breakfast", title: { tr: "Menemen", en: "Menemen" }, description: { tr: "Domates, biber, yumurta", en: "Tomato, pepper and egg" }, price: 120 },
  { id: "sucuklu-yumurta", categoryId: "breakfast", title: { tr: "Sucuklu Yumurta", en: "Egg with Sujuk" }, description: { tr: "Yumurta ve sucuk", en: "Egg with Turkish sausage" }, price: 120 },

  { id: "cremore-bazlama-tost", categoryId: "toasts", title: { tr: "Cremore Bazlama Tost", en: "Cremore Bazlama Toast" }, description: { tr: "Kavurmali bazlama tost", en: "Bazlama toast with roasted beef" }, price: 180 },
  { id: "peynirli-tost", categoryId: "toasts", title: { tr: "Peynirli Tost", en: "Cheese Toast" }, description: { tr: "Kasar peynirli tost", en: "Toast with cheddar cheese" }, price: 140 },
  { id: "klasik-tost", categoryId: "toasts", title: { tr: "Klasik Tost", en: "Classic Toast" }, description: { tr: "Sucuklu kasarli tost", en: "Sujuk and cheddar toast" }, price: 160 },

  { id: "ispanakli-gozleme", categoryId: "gozleme", title: { tr: "Ispanakli Gozleme", en: "Spinach Gozleme" }, description: { tr: "Ispanak harci ile", en: "With spinach filling" }, price: 120 },
  { id: "peynirli-gozleme", categoryId: "gozleme", title: { tr: "Peynirli Gozleme", en: "Cheese Gozleme" }, description: { tr: "Peynir harci ile", en: "With cheese filling" }, price: 120 },
  { id: "patatesli-gozleme", categoryId: "gozleme", title: { tr: "Patatesli Gozleme", en: "Potato Gozleme" }, description: { tr: "Patates harci ile", en: "With potato filling" }, price: 120 },

  { id: "gunun-corbasi", categoryId: "soups", title: { tr: "Gunun Corbasi", en: "Soup of the Day" }, description: { tr: "Gunun ozel corbasi", en: "Chef's daily soup" }, price: 80 },

  { id: "sigara-boregi", categoryId: "appetizers", title: { tr: "Sigara Boregi", en: "Sigara Borek" }, description: { tr: "6 adet", en: "6 pieces" }, price: 80 },
  { id: "cremore-sepeti", categoryId: "appetizers", title: { tr: "Cremore Sepeti", en: "Cremore Basket" }, description: { tr: "Karisik atistirmalik sepeti", en: "Mixed snack basket" }, price: 280 },
  { id: "patates-cipsi", categoryId: "appetizers", title: { tr: "Patates Cipsi", en: "Potato Chips" }, description: { tr: "Odun dilim patates", en: "Rustic sliced potatoes" }, price: 80 },
  { id: "kumpir", categoryId: "appetizers", title: { tr: "Kumpir", en: "Stuffed Baked Potato" }, description: { tr: "Zengin malzemeli kumpir", en: "Loaded baked potato" }, price: 220 },

  { id: "fix-sebzeli", categoryId: "fix", title: { tr: "Sebzeli", en: "Vegetable Fix" }, description: { tr: "Sebzeli fix tabak", en: "Vegetable fix plate" }, price: 250 },
  { id: "fix-tavuklu", categoryId: "fix", title: { tr: "Tavuklu", en: "Chicken Fix" }, description: { tr: "Tavuklu fix tabak", en: "Chicken fix plate" }, price: 300 },
  { id: "fix-etli", categoryId: "fix", title: { tr: "Etli", en: "Beef Fix" }, description: { tr: "Etli fix tabak", en: "Beef fix plate" }, price: 350 },

  { id: "kis-salatasi", categoryId: "salads-bowls", title: { tr: "Kis Salatasi", en: "Winter Salad" }, description: { tr: "Beyaz peynirli mevsim salatasi", en: "Seasonal salad with white cheese" }, price: 140 },
  { id: "kajun-salata", categoryId: "salads-bowls", title: { tr: "Kajun Salata", en: "Cajun Salad" }, description: { tr: "Kajun tavuklu salata", en: "Salad with cajun chicken" }, price: 160 },
  { id: "hellim-ton-salata", categoryId: "salads-bowls", title: { tr: "Izgara Hellim Peynirli Ton Balikli Salata", en: "Tuna Salad with Grilled Halloumi" }, description: { tr: "Ton baligi ve hellim ile", en: "With tuna and grilled halloumi" }, price: 200 },
  { id: "tavuklu-bowl", categoryId: "salads-bowls", title: { tr: "Tavuklu Bowl", en: "Chicken Bowl" }, description: { tr: "Thai soslu tavuk ve basmati", en: "Thai chicken with basmati" }, price: 200 },
  { id: "meyveli-bowl", categoryId: "salads-bowls", title: { tr: "Meyveli Bowl", en: "Fruit Bowl" }, description: { tr: "Orman meyveli granolali", en: "Forest fruits and granola" }, price: 180 },

  { id: "bolonez-eriste", categoryId: "pastas", title: { tr: "Bolonez Soslu Eriste", en: "Bolognese Noodles" }, description: { tr: "Bolonez sos ve yogurt", en: "Bolognese sauce with yogurt" }, price: 220 },
  { id: "manti", categoryId: "pastas", title: { tr: "Manti", en: "Turkish Dumplings" }, description: { tr: "Yogurt ve biber sos ile", en: "With yogurt and pepper butter" }, price: 250 },
  { id: "linguine-alfredo", categoryId: "pastas", title: { tr: "Linguine Alfredo Classico", en: "Linguine Alfredo Classico" }, description: { tr: "Tavuk, mantar, parmesan", en: "Chicken, mushroom, parmesan" }, price: 200 },
  { id: "tavuklu-noodl", categoryId: "pastas", title: { tr: "Tavuklu Sebzeli Noodl", en: "Chicken Vegetable Noodles" }, description: { tr: "Soya ve teriyaki soslu", en: "With soy and teriyaki sauce" }, price: 200 },

  { id: "cremore-kebap", categoryId: "mains", title: { tr: "Cremore Kebap", en: "Cremore Kebab" }, description: { tr: "Bonfile ve espanyol sos", en: "Tenderloin with espagnole sauce" }, price: 500 },
  { id: "cafe-de-paris-tavuk", categoryId: "mains", title: { tr: "Cafe de Paris Soslu Tavuk", en: "Chicken with Cafe de Paris Sauce" }, description: { tr: "Sebze ve patates esliginde", en: "Served with vegetables and potatoes" }, price: 300 },
  { id: "korili-tavuk", categoryId: "mains", title: { tr: "Korili Tavuk", en: "Curried Chicken" }, description: { tr: "Mantarlı kori soslu", en: "With mushroom curry sauce" }, price: 300 },
  { id: "tavuk-izgara-servis", categoryId: "mains", title: { tr: "Tavuk Izgara Servis", en: "Grilled Chicken Plate" }, description: { tr: "Pilav ve patates ile", en: "Served with rice and potatoes" }, price: 250 },
  { id: "tavuk-izgara-ekmek", categoryId: "mains", title: { tr: "Tavuk Izgara Ekmek Arasi", en: "Grilled Chicken Sandwich" }, description: { tr: "Ekmek arasi tavuk izgara", en: "Bread sandwich with grilled chicken" }, price: 210 },
  { id: "begendili-kofte", categoryId: "mains", title: { tr: "Begendili Kofte", en: "Meatballs with Eggplant Puree" }, description: { tr: "Koz patlican begendi ile", en: "With smoked eggplant puree" }, price: 360 },
  { id: "izgara-kofte", categoryId: "mains", title: { tr: "Izgara Kofte", en: "Grilled Meatballs" }, description: { tr: "Pilav ve patates ile", en: "Served with rice and potatoes" }, price: 320 },
  { id: "ekmek-arasi-kofte", categoryId: "mains", title: { tr: "Ekmek Arasi Kofte", en: "Meatball Sandwich" }, description: { tr: "Klasik kofte ekmek", en: "Classic meatball sandwich" }, price: 280 },

  { id: "cremore-tavuk-wrap", categoryId: "wraps", title: { tr: "Cremore Tavuklu Wrap", en: "Cremore Chicken Wrap" }, description: { tr: "Barbeku soslu tavuk wrap", en: "BBQ chicken wrap" }, price: 240 },
  { id: "cremore-antrikot-wrap", categoryId: "wraps", title: { tr: "Cremore Antrikot Wrap", en: "Cremore Steak Wrap" }, description: { tr: "Barbeku soslu antrikot wrap", en: "BBQ steak wrap" }, price: 350 },

  { id: "margarita-buyuk", categoryId: "pizzas", title: { tr: "Margarita Pizza Buyuk Boy", en: "Margherita Pizza Large" }, description: { tr: "Mozarella ve ozel sos", en: "Mozzarella with special sauce" }, price: 240 },
  { id: "margarita-orta", categoryId: "pizzas", title: { tr: "Margarita Pizza Orta Boy", en: "Margherita Pizza Medium" }, description: { tr: "Mozarella ve ozel sos", en: "Mozzarella with special sauce" }, price: 200 },
  { id: "cremore-pizza-buyuk", categoryId: "pizzas", title: { tr: "Cremore Pizza Buyuk Boy", en: "Cremore Pizza Large" }, description: { tr: "Karışik malzemeli", en: "Loaded mixed toppings" }, price: 320 },
  { id: "cremore-pizza-orta", categoryId: "pizzas", title: { tr: "Cremore Pizza Orta Boy", en: "Cremore Pizza Medium" }, description: { tr: "Karışik malzemeli", en: "Loaded mixed toppings" }, price: 280 },
  { id: "vejeteryan-buyuk", categoryId: "pizzas", title: { tr: "Vejeteryan Pizza Buyuk Boy", en: "Vegetarian Pizza Large" }, description: { tr: "Sebzeli ve hafif", en: "Fresh vegetables and light profile" }, price: 260 },
  { id: "vejeteryan-orta", categoryId: "pizzas", title: { tr: "Vejeteryan Pizza Orta Boy", en: "Vegetarian Pizza Medium" }, description: { tr: "Sebzeli ve hafif", en: "Fresh vegetables and light profile" }, price: 230 },

  { id: "cremore-burger", categoryId: "burgers", title: { tr: "Cremore Burger", en: "Cremore Burger" }, description: { tr: "Karamelize soganli ozel burger", en: "Signature burger with caramelized onions" }, price: 320 },
  { id: "citir-tavuk-burger", categoryId: "burgers", title: { tr: "Citir Tavuklu Burger", en: "Crispy Chicken Burger" }, description: { tr: "Citir tavuk burger", en: "Crispy chicken burger" }, price: 210 },
  { id: "klasik-burger", categoryId: "burgers", title: { tr: "Klasik Burger", en: "Classic Burger" }, description: { tr: "Dana kofte burger", en: "Classic beef burger" }, price: 260 },

  { id: "sutlac", categoryId: "desserts", title: { tr: "Sutlac", en: "Rice Pudding" }, description: { tr: "Firinlanmis sutlac", en: "Baked rice pudding" }, price: 90 },
  { id: "cheesecake", categoryId: "desserts", title: { tr: "Cheesecake", en: "Cheesecake" }, description: { tr: "Gunluk cheesecake", en: "Daily cheesecake slice" }, price: 170 },
  { id: "sufle", categoryId: "desserts", title: { tr: "Sufle", en: "Souffle" }, description: { tr: "Akiskan cikolatali", en: "Warm molten chocolate" }, price: 150 },
  { id: "mozaik-pasta", categoryId: "desserts", title: { tr: "Mozaik Pasta", en: "Mosaic Cake" }, description: { tr: "Klasik mozaik pasta", en: "Classic mosaic cake" }, price: 125 },
  { id: "brownie", categoryId: "desserts", title: { tr: "Brownie", en: "Brownie" }, description: { tr: "Yogun cikolata", en: "Rich chocolate brownie" }, price: 150 },
];

let runtimeCategories: Category[] = [];
let runtimeProducts: Product[] = [];

function localizeText(text: LocalizedText, locale: MenuLocale) {
  return text[locale];
}

function localizeTags(tags: LocalizedTags | undefined, locale: MenuLocale) {
  return tags ? tags[locale] : undefined;
}

export function localizeGroup(group: MenuGroup, locale: MenuLocale): LocalizedGroup {
  return {
    id: group.id,
    emoji: group.emoji,
    title: localizeText(group.title, locale),
    description: localizeText(group.description, locale),
  };
}

export function localizeCategory(category: Category, locale: MenuLocale): LocalizedCategory {
  return {
    id: category.id,
    groupId: category.groupId,
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
    imageUrl: product.imageUrl,
    tags: localizeTags(product.tags, locale),
  };
}

export function getGroupById(id: MenuGroupId) {
  return menuGroups.find((group) => group.id === id);
}

export function getCategoryById(id: string) {
  return runtimeCategories.find((category) => category.id === id);
}

export function getProductById(id: string) {
  return runtimeProducts.find((product) => product.id === id);
}

export function getCategoriesByGroup(groupId: MenuGroupId) {
  return runtimeCategories.filter((category) => category.groupId === groupId);
}

export function getProductsByCategory(categoryId: string) {
  return runtimeProducts.filter((product) => product.categoryId === categoryId);
}

export function getAllProducts() {
  return runtimeProducts;
}

export function setProducts(products: Product[]) {
  runtimeProducts = products;
}

export function resetProductsToFallback() {
  runtimeProducts = [];
}

export function getLocalizedGroups(locale: MenuLocale) {
  return menuGroups.map((group) => localizeGroup(group, locale));
}

export function getLocalizedGroupById(id: MenuGroupId, locale: MenuLocale) {
  const group = getGroupById(id);
  return group ? localizeGroup(group, locale) : undefined;
}

export function getLocalizedCategories(locale: MenuLocale) {
  return runtimeCategories.map((category) => localizeCategory(category, locale));
}

export function getLocalizedCategoriesByGroup(groupId: MenuGroupId, locale: MenuLocale) {
  return getCategoriesByGroup(groupId).map((category) => localizeCategory(category, locale));
}

export function setCategories(categories: Category[]) {
  runtimeCategories = categories;
}

export function resetCategoriesToFallback() {
  runtimeCategories = [];
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
