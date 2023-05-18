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
			class="form-control custom-scroll-bar"
			rows="5"
			:class="
				isDark ? 'dark-theme-input custom-scroll-bar-dark' : 'light-theme-input custom-scroll-bar-light'
			"
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
	max-height: 40rem;
	min-height: 3rem;
	overflow-y: auto;
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
		background: $tertiary-color;
	}
	&::-moz-scrollbar-thumb {
		background: $tertiary-color;
	}

	&.custom-scroll-bar-dark {
		&::-webkit-scrollbar-thumb:hover {
			background: $secondary-color;
		}
		&::-moz-scrollbar-thumb:hover {
			background: $secondary-color;
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
