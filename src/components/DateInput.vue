<script setup>
import { useDark } from "@vueuse/core";
import { watch, ref } from "vue";

const isDark = useDark();
const emits = defineEmits(["update:data"]);
const props = defineProps({
	date: { type: String, required: true },
	placeholder: { type: String, required: false, default: "Data" },
	minDate: { type: String, required: false, default: "" },
	maxDate: { type: String, required: false, default: "" },
	isDark: { type: Boolean, required: false, default: false },
});

const date = ref(props.date);

watch(date, () => {
	emits("update:date", date.value);
});
</script>

<template>
	<div class="d-flex flex-row justify-content-between align-items-center w-100 px-3">
		<b-form-datepicker
			v-model="date"
			class="date-picker w-100"
			:placeholder="placeholder"
			:min="minDate"
			:max="maxDate"
			:is-dark="isDark"
		></b-form-datepicker>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #3fc380;

.date-picker {
	font-family: "Panton", sans-serif;
	font-size: 1.2rem;
	font-weight: 400;
	border-radius: 0.6rem;
	border: 2px solid $primary-color;
	background-color: transparent;
	outline: transparent;
}
</style>
