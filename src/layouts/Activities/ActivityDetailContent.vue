<script setup>
import { useDark } from "@vueuse/core";

const isDark = useDark();
const props = defineProps({
	side: { type: String, required: true },
	title: { type: String, required: false },
	content: { type: String, required: false },
	pad: { type: Boolean, required: false },
});
</script>

<template>
	<div
		v-if="props.title && props.content"
		class="content-container custom-scroll-bar mx-0"
		:class="{
			'text-right': props.side === 'left',
			'text-left': props.side === 'right',
			'pt-4': props.pad,
			'custom-scroll-bar-dark': isDark,
			'custom-scroll-bar-light': !isDark,
		}"
	>
		<h2 class="title" :class="isDark ? 'title-dark-theme' : 'title-light-theme'">
			{{ props.title }}
		</h2>
		<p class="content" :class="isDark ? 'content-dark-theme' : 'content-light-theme'">
			{{ props.content }}
		</p>
	</div>
	<div v-else class="content-container"></div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #ffffff;
$tertiary-color: #aedcc0;
$fourth-color: #3fc380;
$fifth-color: #18516f;

.content-container {
	height: 150px;
	overflow-y: auto;
}

.title {
	font-family: "Panton", sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
	color: $primary-color;
}

.content {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 400;
	color: $primary-color;
}

.title-light-theme {
	color: $primary-color;
}

.title-dark-theme {
	color: $tertiary-color;
}

.content-light-theme {
	color: $primary-color;
}

.content-dark-theme {
	color: $secondary-color;
}

.custom-scroll-bar {
	&::-webkit-scrollbar {
		width: 10px;
	}

	&::-moz-scrollbar {
		width: 10px;
	}

	scrollbar-width: 10px;

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-moz-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background: $fourth-color;
	}

	&::-moz-scrollbar-thumb {
		background: $fourth-color;
	}

	&.custom-scroll-bar-dark {
		&::-webkit-scrollbar-thumb:hover {
			background: $tertiary-color;
		}

		&::-moz-scrollbar-thumb:hover {
			background: $tertiary-color;
		}
	}

	&.custom-scroll-bar-light {
		&::-webkit-scrollbar-thumb:hover {
			background: $fifth-color;
		}

		&::-moz-scrollbar-thumb:hover {
			background: $fifth-color;
		}
	}
}
</style>
