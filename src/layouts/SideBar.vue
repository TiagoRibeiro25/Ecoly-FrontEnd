<script setup>
import { useDark, useToggle } from "@vueuse/core";
import { onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import logo from "../assets/logo/logo.webp";
import logo_dark from "../assets/logo/logo_dark.webp";
import logo_exp from "../assets/logo/logo_exp.webp";
import logo_exp_dark from "../assets/logo/logo_exp_dark.webp";
import { useActivitiesStore } from "../stores/activities";
import { useMeetingsStore } from "../stores/meetings";
import { useNewsStore } from "../stores/news";
import { useUsersStore } from "../stores/users";

const isDark = useDark();
const toggleDark = useToggle(isDark);
const userStore = useUsersStore();
const route = ref(useRoute().name);
const router = useRouter();

watch(useRoute(), (newRoute) => {
	route.value = newRoute.name;

	if (route.value === "Authenticate") {
		profilePicture.value = "../../../../../../assets/icons/profile.svg";
		isUserLogged.value = false;
	}
});

const showText = ref(false);
const openAnimation = ref(false);
const closeAnimation = ref(false);
const isExpanded = ref(false);

const isUserLogged = ref(userStore.isUserLoggedIn);
const profilePicture = ref("../../../../../../assets/icons/profile.svg");
const userLogged = ref(null);

function open() {
	if (isExpanded.value) return;

	openAnimation.value = true;
	setTimeout(() => {
		openAnimation.value = false;
		isExpanded.value = true;
		showText.value = true;
	}, 300);
}

function close() {
	if (!isExpanded.value) return;

	if (openAnimation.value) {
		setTimeout(() => {
			close();
		}, 300);
		return;
	}

	closeAnimation.value = true;
	showText.value = false;
	setTimeout(() => {
		closeAnimation.value = false;
		isExpanded.value = false;
		showText.value = false;
	}, 300);
}

async function signOut() {
	const newsStore = useNewsStore();
	const activitiesStore = useActivitiesStore();
	const meetingsStore = useMeetingsStore();

	userStore.signOut();
	isUserLogged.value = false;
	profilePicture.value = "../../../../../../assets/icons/profile.svg";
	newsStore.resetData();
	activitiesStore.resetData();
	meetingsStore.resetData();
	await router.push({ name: "Authenticate" });
}

onBeforeMount(async () => {
	if (isUserLogged.value) {
		const response = await userStore.getLoggedInUser();
		if (response.success) {
			profilePicture.value = response.data.photo;
			userLogged.value = response.data;
		} else {
			await signOut();
		}
	}
});
</script>

<template>
	<!-- Desktop Navigation -->
	<nav
		class="sidebar-desktop d-md-flex d-none flex-column justify-content-between shadow-lg"
		:class="{
			expanded: isExpanded,
			reduced: !isExpanded,
			openAnimation: openAnimation,
			closeAnimation: closeAnimation,
			'sidebar-desktop-dark': isDark,
			'sidebar-desktop-light': !isDark,
		}"
		aria-label="Desktop Navigation"
		@mouseover="open"
		@mouseleave="close"
	>
		<div class="top-logo">
			<router-link :to="{ name: 'Home' }">
				<img
					v-if="showText"
					v-lazy="{ src: !isDark ? logo_exp_dark : logo_exp }"
					alt="home"
					width="180"
					height="60"
					class="mt-2"
				/>
				<img
					v-else
					v-lazy="{ src: !isDark ? logo_dark : logo }"
					alt="home"
					width="50"
					height="80"
					class="mr-3"
					:class="isDark ? 'ml-0' : 'ml-1'"
				/>
			</router-link>
		</div>
		<div class="nav-links" :class="isDark ? 'nav-links-dark' : 'nav-links-light'">
			<router-link :to="{ name: 'News' }">
				<img
					src="../assets/icons/news.svg"
					alt="News"
					width="50"
					height="50"
					class="route-icon"
					:class="{
						'selected-icon': route === 'News',
						'selected-icon-dark': route === 'News' && isDark,
						'selected-icon-light': route === 'News' && !isDark,
					}"
				/>
				<span
					v-if="showText"
					class="route-text"
					:class="{
						'selected-link': route === 'News',
						'selected-link-dark': route === 'News' && isDark,
						'selected-link-light': route === 'News' && !isDark,
					}"
				>
					Notícias
				</span>
			</router-link>
			<router-link :to="{ name: 'Activities' }"
				><img
					src="../assets/icons/activities.svg"
					alt="Activities"
					width="50"
					height="50"
					class="route-icon"
					:class="{
						'selected-icon': route === 'Activities',
						'selected-icon-dark': route === 'Activities' && isDark,
						'selected-icon-light': route === 'Activities' && !isDark,
					}"
				/>
				<span
					v-if="showText"
					class="route-text"
					:class="{
						'selected-link': route === 'Activities',
						'selected-link-dark': route === 'Activities' && isDark,
						'selected-link-light': route === 'Activities' && !isDark,
					}"
				>
					Atividades
				</span>
			</router-link>
			<router-link :to="{ name: 'Manage' }"
				><img
					src="../assets/icons/manage.svg"
					alt="Manage"
					width="50"
					height="50"
					class="route-icon"
					:class="{
						'selected-icon': route === 'Manage',
						'selected-icon-dark': route === 'Manage' && isDark,
						'selected-icon-light': route === 'Manage' && !isDark,
					}"
				/>
				<span
					v-if="showText"
					class="route-text"
					:class="{
						'selected-link': route === 'Manage',
						'selected-link-dark': route === 'Manage' && isDark,
						'selected-link-light': route === 'Manage' && !isDark,
					}"
				>
					Gestão
				</span>
			</router-link>
			<router-link v-if="isUserLogged && userLogged?.role === 'admin'" :to="{ name: 'Admin' }"
				><img
					src="../assets/icons/admin.svg"
					alt="Admin"
					width="50"
					height="50"
					class="route-icon"
					:class="{
						'selected-icon': route === 'Admin',
						'selected-icon-dark': route === 'Admin' && isDark,
						'selected-icon-light': route === 'Admin' && !isDark,
					}"
				/>
				<span
					v-if="showText"
					class="route-text"
					:class="{
						'selected-link': route === 'Admin',
						'selected-link-dark': route === 'Admin' && isDark,
						'selected-link-light': route === 'Admin' && !isDark,
					}"
				>
					Admin
				</span>
			</router-link>
		</div>

		<div class="bottom-link">
			<span
				class="ml-3 mb-2 toggle-theme"
				:class="isDark ? 'toggle-theme-dark' : 'toggle-theme-light'"
				@click="() => toggleDark()"
			>
				<img
					v-if="isDark"
					src="../assets/icons/dark.svg"
					alt="Tema"
					width="50"
					height="50"
					class="route-icon"
				/>
				<img
					v-if="!isDark"
					src="../assets/icons/light.svg"
					alt="Tema"
					width="50"
					height="50"
					class="route-icon"
				/>
				<button v-if="showText" class="route-text" style="font-size: 1.5rem">Tema</button>
			</span>
			<router-link
				:to="{ name: isUserLogged ? 'Profile' : 'Authenticate', params: { id: isUserLogged ? 'me' : '' } }"
			>
				<img
					v-if="isUserLogged"
					v-lazy="{ src: profilePicture }"
					alt="Perfil"
					width="50"
					height="50"
					class="route-icon"
					:class="{
						'mt-2': showText,
						'selected-icon': (route === 'Profile' || route === 'Authenticate') && !isUserLogged,
					}"
				/>
				<img
					v-else
					src="../assets/icons/profile.svg"
					alt="Perfil"
					width="50"
					height="50"
					class="route-icon"
					:class="{
						'mt-2': showText,
						'selected-icon': (route === 'Profile' || route === 'Authenticate') && !isUserLogged,
						'selected-icon-dark': (route === 'Profile' || route === 'Authenticate') && isDark,
						'selected-icon-light': (route === 'Profile' || route === 'Authenticate') && !isDark,
						'authenticate-light-icon': !isDark,
					}"
				/>
				<span
					v-if="showText"
					class="route-text"
					:class="{
						'selected-link': currentRoute === '/profile/me',
						'selected-link-dark': currentRoute === '/profile/me' && isDark,
						'selected-link-light': currentRoute === '/profile/me' && !isDark,
					}"
				>
					{{ isUserLogged ? "Perfil" : "Entrar" }}
				</span>
			</router-link>
			<button v-if="showText && isUserLogged" class="sign-out-btn" @click="signOut">Sign Out</button>
		</div>
	</nav>

	<!-- Mobile Navigation -->
	<nav
		class="sidebar-mobile d-md-none shadow-lg pt-3 pb-2 d-flex justify-content-center align-items-center"
		:class="isDark ? 'sidebar-mobile-dark' : 'sidebar-mobile-light'"
		aria-label="Mobile Navigation"
	>
		<router-link :to="{ name: 'Home' }">
			<img :src="isDark ? logo : logo_dark" alt="Home" width="25" height="35" class="route-icon mx-2" />
		</router-link>
		<div :class="isDark ? 'nav-links-dark' : 'nav-links-light'">
			<router-link :to="{ name: 'News' }">
				<img
					src="../assets/icons/news.svg"
					alt="News"
					width="35"
					height="35"
					class="route-icon mx-2"
					:class="{
						'selected-icon': route === 'News',
						'selected-icon-dark': route === 'News' && isDark,
						'selected-icon-light': route === 'News' && !isDark,
					}"
				/>
			</router-link>
			<router-link :to="{ name: 'Activities' }">
				<img
					src="../assets/icons/activities.svg"
					alt="Activities"
					width="35"
					height="35"
					class="route-icon mx-2"
					:class="{
						'selected-icon': route === 'Activities',
						'selected-icon-dark': route === 'Activities' && isDark,
						'selected-icon-light': route === 'Activities' && !isDark,
					}"
				/>
			</router-link>
			<router-link :to="{ name: 'Manage' }">
				<img
					src="../assets/icons/manage.svg"
					alt="Manage"
					width="35"
					height="35"
					class="route-icon mx-2"
					:class="{
						'selected-icon': route === 'Manage',
						'selected-icon-dark': route === 'Manage' && isDark,
						'selected-icon-light': route === 'Manage' && !isDark,
					}"
				/>
			</router-link>
		</div>
		<div class="d-flex flex-row-reverse align-items-center">
			<router-link
				:to="{ name: isUserLogged ? 'Profile' : 'Authenticate', params: { id: isUserLogged ? 'me' : '' } }"
				class="pb-2"
			>
				<img
					v-if="isUserLogged"
					v-lazy="{ src: profilePicture }"
					alt="Perfil"
					width="35"
					height="35"
					class="route-icon mx-2"
					:class="{ 'selected-icon': (route === 'Profile' || route === 'Authenticate') && !isUserLogged }"
				/>
				<img
					v-else
					src="../assets/icons/profile.svg"
					alt="Perfil"
					width="35"
					height="35"
					class="route-icon mx-2"
					:class="{
						'mt-2': showText,
						'selected-icon': (route === 'Profile' || route === 'Authenticate') && !isUserLogged,
						'selected-icon-dark': (route === 'Profile' || route === 'Authenticate') && isDark,
						'selected-icon-light': (route === 'Profile' || route === 'Authenticate') && !isDark,
						'authenticate-light-icon': !isDark,
					}"
				/>
			</router-link>
			<span
				class="toggle-theme"
				:class="isDark ? 'toggle-theme-dark' : 'toggle-theme-light'"
				@click="() => toggleDark()"
			>
				<img
					v-if="isDark"
					src="../assets/icons/dark.svg"
					alt="Tema"
					width="35"
					height="35"
					class="route-icon mx-2"
				/>
				<img
					v-if="!isDark"
					src="../assets/icons/light.svg"
					alt="Tema"
					width="35"
					height="35"
					class="route-icon mx-2"
				/>
			</span>
		</div>
	</nav>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #e4f0e8;
$tertiary-color: #3fc380;
$quaternary-color: #18516f;
$quinary-color: #aedcc0;

.sidebar-desktop {
	height: 100vh;
	height: 100dvh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1005;
	text-align: center;
	font-size: 1.7rem;
	font-weight: 300;

	&-dark {
		background-color: $primary-color;

		& a,
		.route-text,
		.sign-out-btn {
			color: $quinary-color;
		}
	}

	&-light {
		background-color: $secondary-color;

		& a,
		.route-text,
		.sign-out-btn {
			color: $primary-color;
		}
	}

	a {
		text-decoration: none;
		display: block;
		padding: 16px;
		transition: 0.3s;
	}
}

.sidebar-mobile {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 10px;
	box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
	z-index: 1005;

	&-dark {
		background-color: $primary-color;
	}

	&-light {
		background-color: $secondary-color;
	}
}

.expanded {
	width: 250px;
}

.reduced {
	width: 80px;
}

.top-logo {
	height: 10%;
}

.nav-links {
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 72.5%;

	&-dark {
		& a:hover {
			& span {
				color: $tertiary-color;
			}
		}
	}

	&-light {
		& img {
			filter: brightness(0.2);
		}

		& a:hover {
			& span {
				color: $quaternary-color;
			}
		}
	}
}

.bottom-link {
	height: 17.2%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.authenticate-light-icon {
	filter: brightness(0.2);
}

.toggle-theme {
	&-dark {
		& button {
			color: $secondary-color;

			&:hover {
				color: $tertiary-color;
			}
		}

		&:hover {
			color: $tertiary-color;
			cursor: pointer;
		}
	}

	&-light {
		& button {
			color: $primary-color;

			&:hover {
				color: $quaternary-color;
			}
		}

		&:hover {
			color: $quaternary-color;
			cursor: pointer;
		}
	}

	& button {
		background-color: transparent;
		border: none;
		font-size: 1.8rem;
		padding-right: 24px;
	}
}

.route-text {
	font-family: "Panton", sans-serif;
	font-weight: 400;
	font-size: 1.5rem;
}

.route-icon {
	margin-right: 10px;
	float: left;
}

.selected-link {
	transition: color 0.1s ease-in-out;

	&-dark {
		color: $tertiary-color;
	}

	&-light {
		color: $quaternary-color;
	}
}

.selected-icon {
	&-dark {
		filter: invert(0.5) sepia(1) saturate(3) hue-rotate(100deg);
	}

	&-light {
		filter: invert(0.7) sepia(1) saturate(4) hue-rotate(150deg) !important;
	}
}

.sign-out-btn {
	background-color: transparent;
	opacity: 40%;
	border: none;
	font-size: 1.2rem;
	top: -40px;
	position: relative;
	align-self: flex-end;
	margin-right: 53px;

	&:hover {
		opacity: 70%;
	}

	transition: color 0.5s ease-in-out;
}

.openAnimation {
	animation: slideRight 0.3s ease-in-out;
}

.closeAnimation {
	animation: slideLeft 0.3s ease-in-out;
	width: 80px;
}

@keyframes slideLeft {
	0% {
		width: 250px;
	}

	100% {
		width: 80px;
	}
}

@keyframes slideRight {
	0% {
		width: 80px;
	}

	100% {
		width: 250px;
	}
}
</style>
