import ActivitiesView from "../pages/Activities/ActivitiesView.vue";
import ActivityCreateView from "../pages/Activities/ActivityCreateView.vue";
import ActivityDetailView from "../pages/Activities/ActivityDetail.vue";
import AdminView from "../pages/Admin/AdminView.vue";
import AuthenticateView from "../pages/Authenticate/AuthenticateView.vue";
import DashboardView from "../pages/Dashboard/DashboardView.vue";
import HomeView from "../pages/Home/HomeView.vue";
import ManageView from "../pages/Manage/ManageView.vue";
import NewCreateView from "../pages/News/NewCreate.vue";
import NewDetailView from "../pages/News/NewDetail.vue";
import NewsView from "../pages/News/NewsView.vue";
import NotFoundView from "../pages/NotFoundView.vue";
import ProfileView from "../pages/Profile/ProfileView.vue";
import UnsubscribeView from "../pages/UnsubscribeView.vue";

import { createRouter, createWebHistory } from "vue-router";
import { useUsersStore } from "../stores/users";

function isUserLoggedIn(next) {
	const usersStore = useUsersStore();
	if (usersStore.isUserLoggedIn) next({ name: "Authenticate" });
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
			component: NotFoundView,
		},
		{
			path: "/news",
			name: "News",
			component: NewsView,
		},
		{
			path: "/news/:id",
			name: "NewDetail",
			component: NewDetailView,
		},
		{
			path: "/news/create",
			name: "NewCreate",
			component: NewCreateView,
			beforeEnter: (to, from, next) => {
				isUserLoggedIn(next);
			},
		},
		{
			path: "/activities",
			name: "Activities",
			component: ActivitiesView,
		},
		{
			path: "/activities/:id",
			name: "ActivityDetail",
			component: ActivityDetailView,
		},
		{
			path: "/activities/create",
			name: "ActivityCreate",
			component: ActivityCreateView,
			beforeEnter: (to, from, next) => {
				isUserLoggedIn(next);
			},
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
			beforeEnter: (to, from, next) => {
				isUserLoggedIn(next);
			},
		},
		{
			path: "/manage/admin",
			name: "Admin",
			component: AdminView,
			beforeEnter: (to, from, next) => {
				isUserLoggedIn(next);
			},
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
				isUserLoggedIn(next);
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
