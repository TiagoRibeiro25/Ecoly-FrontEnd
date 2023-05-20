<script setup>
import { useDark } from "@vueuse/core";

const props = defineProps({
	title: { type: String, required: true },
	description: { type: String, required: true },
});

const isDark = useDark();
</script>

<template>
	<div
		class="row header w-100 mx-auto text-center mt-2 pt-4 pb-2 shadow"
		:class="isDark ? 'header-dark-theme' : 'header-light-theme'"
	>
		<div class="col-12 text-center">
			<h2 class="header-title mb-2">{{ props.title.toUpperCase() }}</h2>
		</div>
		<div class="col-12">
			<p class="header-description">{{ props.description }}</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #e4f0e8;
$tertiary-color: #ffffff;

.header {
	border-radius: 0.6rem;
}

.header-title {
	font-family: "Panton", sans-serif;
	font-size: 1.5rem;
	font-weight: 600;
}

.header-description {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 400;
}

.header-dark-theme {
	background-color: $primary-color;
	color: $tertiary-color;
}

.header-light-theme {
	background-color: $secondary-color;
	color: $primary-color;
}
</style>
