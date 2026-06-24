import { createRouter, createWebHashHistory } from "vue-router";
const HomeView = () => import("../views/HomeView.vue");
const CategoriesView = () => import("../views/CategoriesView.vue");
const GroupCategoriesView = () => import("../views/GroupCategoriesView.vue");
const ProductsView = () => import("../views/ProductsView.vue");
const ProductDetailView = () => import("../views/ProductDetailView.vue");
const AdminView = () => import("../views/AdminView.vue");
const TvHtmlView = () => import("../views/TvHtmlView.vue");
const TvEditView = () => import("../views/TvEditView.vue");

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
    { path: "/tv/items", name: "tvItems", component: TvHtmlView, props: { slug: "items" } },
    { path: "/tv/icecekler", name: "tvDrinks", component: TvHtmlView, props: { slug: "icecekler" } },
    { path: "/tv/yiyecekler", name: "tvFoods", component: TvHtmlView, props: { slug: "yiyecekler" } },
    { path: "/tv/edit", name: "tvEdit", component: TvEditView },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
