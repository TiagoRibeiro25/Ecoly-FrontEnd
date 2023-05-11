<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUsersStore } from "@/stores/users";

const userStore = useUsersStore();
const route = ref(useRoute().name);
const router = useRouter();

watch(useRoute(), (newRoute) => {
	route.value = newRoute.name;
});

const showText = ref(false);
const openAnimation = ref(false);
const closeAnimation = ref(false);
const isExpanded = ref(false);

const isUserLogged = ref(userStore.isUserLoggedIn);
const profilePicture = ref("../assets/icons/profile.svg");

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

function signOut() {
	userStore.signOut();
	isUserLogged.value = false;
	profilePicture.value = "../assets/icons/profile.svg";
	router.push({ name: "Authenticate" });
}

onBeforeMount(async () => {
	if (isUserLogged.value) {
		const response = await userStore.getLoggedInUser();
		if (response.success) profilePicture.value = response.data.photo;
		else signOut();
	}
});
</script>

<template>
	<nav
		class="sidebar d-flex flex-column justify-content-between"
		:class="{
			expanded: isExpanded,
			reduced: !isExpanded,
			openAnimation: openAnimation,
			closeAnimation: closeAnimation,
		}"
		@mouseover="open"
		@mouseleave="close"
	>
		<div class="top-logo">
			<router-link :to="{ name: 'Home' }">
				<!-- if (isExpanded === true) show -->
				<img
					v-if="showText"
					src="../assets/logo/logo_exp.webp"
					alt="home"
					width="180"
					height="60"
					class="mt-2"
				/>
				<!-- else show -->
				<img v-else src="../assets/logo/logo.webp" alt="home" width="50" height="80" class="mr-3" />
			</router-link>
		</div>
		<div class="nav-links">
			<router-link :to="{ name: 'News' }">
				<img
					src="../assets/icons/news.svg"
					alt="News"
					width="50"
					height="50"
					class="route-icon"
					:class="{ 'selected-icon': route === 'News' }"
				/>
				<span v-if="showText" :class="{ 'selected-link': route === 'News' }"> Notícias </span>
			</router-link>
			<router-link :to="{ name: 'Activities' }"
				><img
					src="../assets/icons/activities.svg"
					alt="Activities"
					width="50"
					height="50"
					class="route-icon"
					:class="{ 'selected-icon': route === 'Activities' }"
				/>
				<span v-if="showText" :class="{ 'selected-link': route === 'Activities' }"> Atividades </span>
			</router-link>
			<router-link :to="{ name: 'Dashboard' }"
				><img
					src="../assets/icons/dashboard.svg"
					alt="Dashboard"
					width="50"
					height="50"
					class="route-icon"
					:class="{ 'selected-icon': route === 'Dashboard' }"
				/>
				<span v-if="showText" :class="{ 'selected-link': route === 'Dashboard' }"> Dashboard </span>
			</router-link>
			<router-link :to="{ name: 'Manage' }"
				><img
					src="../assets/icons/manage.svg"
					alt="Manage"
					width="50"
					height="50"
					class="route-icon"
					:class="{ 'selected-icon': route === 'Manage' }"
				/>
				<span v-if="showText" :class="{ 'selected-link': route === 'Manage' }"> Gestão </span>
			</router-link>
		</div>

		<div class="bottom-link">
			<!-- if the user is logged pass the param "/me" -->
			<router-link
				:to="{
					name: isUserLogged ? 'Profile' : 'Authenticate',
					params: { id: isUserLogged ? 'me' : '' },
				}"
			>
				<img
					:src="isUserLogged ? profilePicture : '../assets/icons/profile.svg'"
					alt="Profile"
					width="50"
					height="50"
					:class="{
						'route-icon': true,
						'mt-2': showText,
						'selected-icon': (route === 'Profile' || route === 'Authenticate') && !isUserLogged,
					}"
					:style="{
						marginTop: !showText && isUserLogged ? '-23px' : '0',
						marginTop: !showText && !isUserLogged ? '-10px' : '-10px',
					}"
				/>
				<span v-if="showText" :class="{ 'selected-link': currentRoute === '/profile/me' }">
					{{ isUserLogged ? "Perfil" : "Entrar" }}
				</span>
			</router-link>
			<button
				v-if="showText && isUserLogged"
				class="sign-out-btn"
				@click="signOut"
				:style="{ visibility: showText ? 'visible' : 'hidden' }"
			>
				Sign Out
			</button>
		</div>
	</nav>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #3fc380;

.sidebar {
	background-color: $primary-color;
	color: $secondary-color;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1005;
	text-align: center;
	font-size: 1.7rem;
	font-weight: 300;

	a {
		text-decoration: none;
		color: $secondary-color;
		display: block;
		padding: 16px;
		transition: 0.3s;
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
	height: 80%;

	& a:hover {
		& span {
			color: $tertiary-color;
		}
	}
}

.bottom-link {
	height: 10%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.route-icon {
	margin-right: 10px;
	float: left;
}

.selected-link {
	color: $tertiary-color;
	transition: color 0.1s ease-in-out;
}

.selected-icon {
	filter: invert(0.5) sepia(1) saturate(3) hue-rotate(100deg);
}

.sign-out-btn {
	background-color: transparent;
	color: $secondary-color;
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
