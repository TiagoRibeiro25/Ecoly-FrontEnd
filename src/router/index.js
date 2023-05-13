import ActivitiesView from "@/pages/ActivitiesView.vue";
import AuthenticateView from "@/pages/AuthenticateView.vue";
import DashboardView from "@/pages/DashboardView.vue";
import HomeView from "@/pages/HomeView.vue";
import ManageView from "@/pages/ManageView.vue";
import NewsView from "@/pages/NewsView.vue";
import NotFoundView from "@/pages/NotFoundView.vue";
import ProfileView from "@/pages/ProfileView.vue";

import { createRouter, createWebHistory } from "vue-router";
import { useUsersStore } from "../stores/users";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),

	routes: [
		{
			path: "/",
			name: "Home",
			component: HomeView,
		},
		{
			path: "/:pathMatch(.*)*",
			name: "NotFound",
			// component: () => import("@/pages/NotFoundView.vue"),
			component: NotFoundView,
		},
		{
			path: "/news",
			name: "News",
			// component: () => import("@/pages/NewsView.vue"),
			component: NewsView,
		},
		{
			path: "/activities",
			name: "Activities",
			// component: () => import("@/pages/ActivitiesView.vue"),
			component: ActivitiesView,
		},
		{
			path: "/dashboard",
			name: "Dashboard",
			// component: () => import("@/pages/DashboardView.vue"),
			component: DashboardView,
		},
		{
			path: "/manage",
			name: "Manage",
			// component: () => import("@/pages/ManageView.vue"),
			component: ManageView,
		},
		{
			path: "/profile/:id",
			name: "Profile",
			// component: () => import("@/pages/ProfileView.vue"),
			component: ProfileView,
		},
		{
			path: "/authenticate",
			name: "Authenticate",
			// component: () => import("@/pages/AuthenticateView.vue"),
			component: AuthenticateView,
			beforeEnter: (to, from, next) => {
				const usersStore = useUsersStore();
				if (usersStore.isUserLoggedIn) next({ name: "Profile", params: { id: "me" } });
				else next();
			},
		},
	],
});

export default router;
