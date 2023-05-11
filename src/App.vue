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
	document.querySelector("body").style.backgroundColor = isDark.value ? "#333333" : "#ffffff";
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
