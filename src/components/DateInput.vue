<script setup>
import { ref, watch } from "vue";

const emits = defineEmits(["update:date"]);
const props = defineProps({
	date: { type: String, required: true },
	placeholder: { type: String, required: false, default: "Data" },
	minDate: { type: String, required: false, default: "" },
	maxDate: { type: String, required: false, default: "" },
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
			locale="pt"
			:min="minDate"
			:max="maxDate"
		></b-form-datepicker>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #3fc380;
$secondary-color: #ffffff;

.date-picker {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 400;
	border-radius: 0.6rem;
	border: 2px solid $primary-color;
	background-color: transparent;
	outline: transparent;
	padding-top: 0.12rem !important;
	padding-bottom: 0.12rem !important;
}
</style>
