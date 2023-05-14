import ActivitiesView from "@/pages/ActivitiesView.vue";
import AuthenticateView from "@/pages/AuthenticateView.vue";
import DashboardView from "@/pages/DashboardView.vue";
import HomeView from "@/pages/HomeView.vue";
import ManageView from "@/pages/ManageView.vue";
import NewsView from "@/pages/NewsView.vue";
import NotFoundView from "@/pages/NotFoundView.vue";
import ProfileView from "@/pages/ProfileView.vue";
import UnsubscribeView from "@/pages/UnsubscribeView.vue";

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
			component: NotFoundView,
		},
		{
			path: "/news",
			name: "News",
			component: NewsView,
		},
		{
			path: "/activities",
			name: "Activities",
			component: ActivitiesView,
		},
		{
			path: "/dashboard",
			name: "Dashboard",
			component: DashboardView,
		},
		{
			path: "/manage",
			name: "Manage",
			component: ManageView,
		},
		{
			path: "/profile/:id",
			name: "Profile",
			component: ProfileView,
		},
		{
			path: "/authenticate",
			name: "Authenticate",
			component: AuthenticateView,
			beforeEnter: (to, from, next) => {
				const usersStore = useUsersStore();
				if (usersStore.isUserLoggedIn) next({ name: "Profile", params: { id: "me" } });
				else next();
			},
		},
		{
			path: "/unsubscribe/:id",
			name: "Unsubscribe",
			component: UnsubscribeView,
		},
	],
});

export default router;
