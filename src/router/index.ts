import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CategoriesView from "../views/CategoriesView.vue";
import ProductsView from "../views/ProductsView.vue";
import ProductDetailView from "../views/ProductDetailView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/categories", name: "categories", component: CategoriesView },
    { path: "/categories/:categoryId", name: "products", component: ProductsView, props: true },
    { path: "/product/:productId", name: "productDetail", component: ProductDetailView, props: true },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
