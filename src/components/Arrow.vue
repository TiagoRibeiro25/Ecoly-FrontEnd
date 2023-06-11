<script setup>
import { useDark } from "@vueuse/core";

const isDark = useDark();
const props = defineProps({
	options: { type: Object, required: true },
});
const emit = defineEmits(["toggleTheme"]);

function handleClick() {
	if (props.options.isDisabled) return;
	emit("click");
}
</script>
<template>
	<div v-if="options.direction === 'right'" @click="handleClick" class="mr-3 d-flex justify-content-end">
		<img v-if="!isDark" src="@/assets/icons/rightLightThemeArrow.svg" alt="Seta para a direita" />
		<img v-else src="@/assets/icons/rightDarkThemeArrow.svg" alt="Seta para a direita" />
	</div>
	<div v-else @click="handleClick" class="ml-3">
		<img v-if="!isDark" src="@/assets/icons/leftLightThemeArrow.svg" alt="Seta para a direita" />
		<img v-else src="@/assets/icons/leftDarkThemeArrow.svg" alt="Seta para a direita" />
	</div>
</template>

<style lang="scss" scoped>
div {
	margin-top: 145px;
	cursor: pointer;
	transition: 0.3s;

	&:hover {
		scale: 1.05;
	}

	&[disabled] {
		opacity: 0.5;
		cursor: default;
	}
}

@media (max-width: 768px) {
	div {
		scale: 0.8;

		&:hover {
			scale: 0.9;
		}
	}
}
</style>
