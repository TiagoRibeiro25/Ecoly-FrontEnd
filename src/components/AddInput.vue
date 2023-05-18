<script setup>
import { useDark } from "@vueuse/core";
import { ref, watch } from "vue";

const isDark = useDark();
const emits = defineEmits(["update:text"]);
const props = defineProps({
	text: { type: String, required: true },
	placeholder: { type: String, required: true },
	type: { type: String, required: false, default: "input" }, // 'input' | 'textarea'
});

const data = ref(props.text);

watch(data, () => {
	emits("update:text", data.value);
});
</script>

<template>
	<div v-if="type === 'input'">
		<input
			v-model="data"
			:placeholder="placeholder"
			class="form-control"
			:class="isDark ? 'dark-theme-input' : 'light-theme-input'"
		/>
	</div>
	<div v-else>
		<textarea
			v-model="data"
			:placeholder="placeholder"
			class="form-control"
			rows="5"
			:class="isDark ? 'dark-theme-input' : 'light-theme-input'"
		></textarea>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #3fc380;
$fourth-color: #ffffff;
$fifth-color: #18516f;

.form-control {
	font-family: "Panton", sans-serif;
	font-size: 1.2rem;
	font-weight: 400;
	background-color: transparent;
	border-radius: 0.6rem;
	max-height: 15rem;
	min-height: 3rem;
}

.light-theme-input {
	border: 2px solid $tertiary-color;
	color: $primary-color;

	&:focus {
		outline: transparent;
		box-shadow: none;
		border-color: $fifth-color;
		background-color: transparent;
	}
}

.dark-theme-input {
	border: 2px solid $tertiary-color;
	color: $secondary-color;

	&:focus {
		background-color: transparent;
		outline: transparent;
		box-shadow: none;
		border-color: $fourth-color;
		color: $fourth-color;
	}
}
</style>
