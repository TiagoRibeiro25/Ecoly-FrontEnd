<script setup>
import { ref } from "vue";
import { RouterView, useRouter } from "vue-router";
import SideBar from "./layouts/SideBar.vue";
import { useUsersStore } from "./stores/users";
import { setLocalStorage } from "./utils/localStorage";

const router = useRouter();
const isLoading = ref(false);

router.beforeEach((to, from, next) => {
	isLoading.value = true;
	next();
});

router.afterEach(() => {
	window.scrollTo(0, 0);
	setTimeout(() => {
		isLoading.value = false;
	}, 500);
});

// when the user closes the browser add a flag to localStorage
window.addEventListener("beforeunload", () => {
	const usersStore = useUsersStore();
	setLocalStorage("auth_key", usersStore.token);
});
</script>

<template>
	<header>
		<SideBar />
	</header>
	<main>
		<div v-if="isLoading" class="loading-bar"></div>
		<RouterView />
	</main>
</template>

<style lang="scss" scoped>
$primary-color: #3fc380;

.loading-bar {
	position: fixed;
	top: 0;
	left: 0;
	height: 2px;
	width: 0;
	background-color: $primary-color;
	z-index: 9999;
	animation: loading 0.5s ease-in-out;
}

@keyframes loading {
	0% {
		width: 0%;
	}
	100% {
		width: 100%;
	}
}

@media (min-width: 768px) {
	main {
		margin-left: 80px;
	}
}
</style>
