<script setup>
import { RouterView, useRoute } from "vue-router";
import { useDark } from "@vueuse/core";
import { watchEffect } from "vue";
import SideBar from "./components/SideBar.vue";

const isDark = useDark();
const route = useRoute();

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
		<RouterView />
	</main>
</template>
