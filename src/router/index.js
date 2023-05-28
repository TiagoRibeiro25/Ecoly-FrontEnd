import HomeView from "../pages/Home/HomeView.vue";

import { useUsersStore } from "@/stores/users";
import { createRouter, createWebHistory } from "vue-router";

function isUserLoggedIn(next) {
	const usersStore = useUsersStore();
	if (!usersStore.isUserLoggedIn) next({ name: "Authenticate" });
	else next();
}

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
			component: () => import("../pages/NotFoundView.vue"),
		},
		{
			path: "/news",
			name: "News",
			component: () => import("../pages/News/NewsView.vue"),
		},
		{
			path: "/news/:id",
			name: "NewDetail",
			component: () => import("../pages/News/NewDetail.vue"),
		},
		{
			path: "/news/create",
			name: "NewCreate",
			component: () => import("../pages/News/NewCreate.vue"),
			beforeEnter: (to, from, next) => {
				isUserLoggedIn(next);
			},
		},
		{
			path: "/activities",
			name: "Activities",
			component: () => import("../pages/Activities/ActivitiesView.vue"),
		},
		{
			path: "/activities/:id",
			name: "ActivityDetail",
			component: () => import("../pages/Activities/ActivityDetail.vue"),
		},
		{
			path: "/activities/create",
			name: "ActivityCreate",
			component: () => import("../pages/Activities/ActivityCreateView.vue"),
			beforeEnter: (to, from, next) => {
				isUserLoggedIn(next);
			},
		},
		{
			path: "/dashboard",
			name: "Dashboard",
			component: () => import("../pages/Dashboard/DashboardView.vue"),
		},
		{
			path: "/manage",
			name: "Manage",
			component: () => import("../pages/Manage/ManageView.vue"),
			beforeEnter: (to, from, next) => {
				isUserLoggedIn(next);
			},
		},
		{
			path: "/manage/admin",
			name: "Admin",
			component: () => import("../pages/Admin/AdminView.vue"),
			beforeEnter: (to, from, next) => {
				isUserLoggedIn(next);
			},
		},
		{
			path: "/profile/:id",
			name: "Profile",
			component: () => import("../pages/Profile/ProfileView.vue"),
		},
		{
			path: "/authenticate",
			name: "Authenticate",
			component: () => import("../pages/Authenticate/AuthenticateView.vue"),
			beforeEnter: (to, from, next) => {
				const usersStore = useUsersStore();
				if (usersStore.isUserLoggedIn) next({ name: "Profile", params: { id: "me" } });
				else next();
			},
		},
		{
			path: "/unsubscribe/:id",
			name: "Unsubscribe",
			component: () => import("../pages/UnsubscribeView.vue"),
		},
	],
});

export default router;
