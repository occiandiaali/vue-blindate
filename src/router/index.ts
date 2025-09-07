import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    alias: "/members",
    name: "/members",
    component: () => import("../components/Home.vue"),
  },
  {
    path: "/about",
    name: "/about",
    component: () => import("../components/About.vue"),
  },
  {
    path: "/experiences",
    name: "/experiences",
    component: () => import("../components/Experiences.vue"),
  },
  // {
  //   path: "/history/:id",
  //   name: "/history/:id",
  //   component: () => import("../components/Meeting.vue"),
  // },
  {
    path: "/account",
    name: "/account",
    component: () => import("../components/Account.vue"),
  },
  {
    path: "/settings",
    name: "/settings",
    component: () => import("../components/Settings.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
