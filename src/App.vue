<script setup>
import { ref, watchEffect } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { useDark } from "@vueuse/core";
import SideBar from "./components/SideBar.vue";

const isDark = useDark();
const route = useRoute();
const router = useRouter();
const isLoading = ref(false);

router.beforeEach((to, from, next) => {
	isLoading.value = true;
	next();
});

router.afterEach(() => {
	setTimeout(() => {
		isLoading.value = false;
	}, 500);
});

watchEffect(() => {
	console.log("route changed -> ", route.name);
	window.scrollTo(0, 0);
});

watchEffect(() => {
	// Toggle theme
	document.body.classList.toggle("body-dark-theme", isDark.value);
	document.body.classList.toggle("body-light-theme", !isDark.value);
});
</script>

<template>
	<header>
		<SideBar />
	</header>
	<main style="margin-left: 80px">
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
</style>
