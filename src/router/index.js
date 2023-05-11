import HomeView from "@/pages/HomeView.vue";
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
			component: () => import("@/pages/NotFoundView.vue"),
		},
		{
			path: "/news",
			name: "News",
			component: () => import("@/pages/NewsView.vue"),
		},
		{
			path: "/activities",
			name: "Activities",
			component: () => import("@/pages/ActivitiesView.vue"),
		},
		{
			path: "/dashboard",
			name: "Dashboard",
			component: () => import("@/pages/DashboardView.vue"),
		},
		{
			path: "/manage",
			name: "Manage",
			component: () => import("@/pages/ManageView.vue"),
		},
		{
			path: "/profile/:id",
			name: "Profile",
			component: () => import("@/pages/ProfileView.vue"),
		},
		{
			path: "/authenticate",
			name: "Authenticate",
			component: () => import("@/pages/AuthenticateView.vue"),
			beforeEnter: (to, from, next) => {
				const usersStore = useUsersStore();
				if (usersStore.isUserLoggedIn) next({ name: "Profile", params: { id: "me" } });
				else next();
			},
		},
	],
});

export default router;
