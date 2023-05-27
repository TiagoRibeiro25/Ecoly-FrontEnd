<script setup>
import { ref, watch } from "vue";

const emits = defineEmits(["update:time"]);
const props = defineProps({
	time: { type: String, required: true },
	placeholder: { type: String, required: false, default: "" }
});

const time = ref(props.time);

watch(time, () => {
	emits("update:time", time.value);
});
</script>

<template>
	<div class="d-flex flex-row justify-content-between align-items-center w-100 px-3">
		<b-form-timepicker
			v-model="time"
			class="time-picker w-100"
			:placeholder="placeholder"
			locale="pt"
		></b-form-timepicker>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #3fc380;
$secondary-color: #ffffff;

.time-picker {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 400;
	border-radius: 0.6rem;
	border: 2px solid $primary-color;
	background-color: transparent;
	outline: transparent;
	padding-top: 0.17rem !important;
	padding-bottom: 0.17rem !important;
}
</style>
