<script setup>
import { RouterView } from "vue-router";
import { useDark } from "@vueuse/core";
import { watchEffect } from "vue";
import SideBar from "./components/SideBar.vue";

const isDark = useDark();

watchEffect(() => {
	window.scrollTo(0, 0);
});

watchEffect(() => {
	// Toggle theme
	if (isDark.value) {
		document.body.classList.add("body-dark-theme");
		document.body.classList.remove("body-light-theme");
	} else {
		document.body.classList.add("body-light-theme");
		document.body.classList.remove("body-dark-theme");
	}
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
