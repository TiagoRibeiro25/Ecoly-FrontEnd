<script setup>
import { useDark } from "@vueuse/core";

const props = defineProps({ title: { type: String, required: true } });
const isDark = useDark();
</script>

<template>
	<header class="mt-4 mb-4 px-5 mx-auto" :class="{ 'text-light': isDark, 'text-dark': !isDark }">
		<h1 class="title text-left mt-3">{{ props.title }}</h1>
		<div class="border border-2 mt-3" :class="{ 'border-light': isDark, 'border-dark': !isDark }"></div>
	</header>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;

header {
	max-width: 1400px;
}

.title {
	font-family: "Alkes", sans-serif;
	font-weight: bold;
	font-size: 35px;
	text-transform: uppercase;
}

.text-light {
	color: $secondary-color !important;
}

.text-dark {
	color: $primary-color !important;
}

.border-light {
	border-color: $secondary-color !important;
}

.border-dark {
	border-color: $primary-color !important;
}
</style>
