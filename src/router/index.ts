import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CategoriesView from "../views/CategoriesView.vue";
import GroupCategoriesView from "../views/GroupCategoriesView.vue";
import ProductsView from "../views/ProductsView.vue";
import ProductDetailView from "../views/ProductDetailView.vue";
import AdminView from "../views/AdminView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/categories", name: "groups", component: CategoriesView },
    { path: "/categories/:groupId", name: "categories", component: GroupCategoriesView, props: true },
    {
      path: "/categories/:groupId/:categoryId",
      name: "products",
      component: ProductsView,
      props: true,
    },
    { path: "/product/:productId", name: "productDetail", component: ProductDetailView, props: true },
    { path: "/admin", name: "admin", component: AdminView },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
