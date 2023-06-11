<script setup>
import { ref, watch } from "vue";

const emits = defineEmits(["update:complexity"]);
const props = defineProps({
	complexity: { type: Number, required: true },
	isDark: { type: Boolean, required: false, default: false },
	disabled: { type: Boolean, required: false, default: false },
});

const complexity = ref(props.complexity);

watch(complexity, () => {
	emits("update:complexity", complexity.value);
});
</script>

<template>
	<div>
		<b
			v-if="!disabled"
			class="mr-1 info-label"
			:class="props.isDark ? 'info-dark-theme' : 'info-light-theme'"
		>
			Complexidade
		</b>
		<b-form-rating
			class="complexity-info border-0"
			:class="props.isDark ? 'complexity-dark-theme' : 'complexity-light-theme'"
			inline
			v-model="complexity"
			:readonly="disabled"
		></b-form-rating>
	</div>
</template>

<style scoped lang="scss">
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #3fc380;
$fourth-color: #ffffff;

.info-label {
	font-family: "Panton", sans-serif;
	font-size: 1.5rem;
	font-weight: 600;
}

.complexity-info {
	font-size: 1.3rem;
	transform: translateY(2px);
	background-color: transparent;

	&:focus {
		outline: none;
		background-color: transparent;
		box-shadow: none;
	}
}

.info-light-theme,
.complexity-light-theme {
	color: $primary-color;
}

.info-dark-theme {
	color: $tertiary-color;
}

.complexity-dark-theme {
	color: $secondary-color;

	&:hover {
		color: $fourth-color;
	}
}
</style>
