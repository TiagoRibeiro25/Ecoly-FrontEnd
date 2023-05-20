<script setup>
import { useDark } from "@vueuse/core";

const props = defineProps({
	text: { type: String, required: true },
	to: { type: String, required: true },
	params: { type: Object, default: () => ({}) },
	disable: { type: Boolean, default: false },
	iconImg: { type: String, default: null },
	iconWidth: { type: Number, default: 20 },
	iconHeight: { type: Number, default: 20 },
});

const isDark = useDark();
</script>

<template>
	<router-link
		:to="{ name: disable ? '' : to, params }"
		class="text-decoration-none add-new-btn btn btn-sm rounded-pill d-flex align-items-center justify-content-start"
		:class="{ 'btn-light': !isDark, 'btn-dark': isDark, disabled: disable }"
	>
		<img v-lazy="{ src: iconImg }" :alt="text" :width="iconWidth" :height="iconHeight" />
		<span class="px-3 w-100"> {{ text }} </span>
	</router-link>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #ffffff;
$tertiary-color: #18516f;

.add-new-btn {
	font-family: "Panton", sans-serif;
	font-weight: 600;
	font-size: 1rem;
	width: 250px;
}

.disabled {
	pointer-events: none;
	opacity: 0.5;
}

.btn-light {
	background-color: $primary-color;
	color: $secondary-color;

	& img {
		filter: invert(1);
	}

	&:hover {
		background-color: $tertiary-color;
		color: $secondary-color;
	}

	&.disabled {
		background-color: $primary-color;
		color: $secondary-color;
	}
}

.btn-dark {
	background-color: $secondary-color;
	color: $primary-color;

	&:hover {
		background-color: $tertiary-color;
		color: $secondary-color;

		& img {
			filter: invert(1);
		}
	}

	&.disabled {
		background-color: $secondary-color;
		color: $primary-color;
	}
}
</style>
