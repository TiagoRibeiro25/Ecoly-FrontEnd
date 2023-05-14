<script setup>
import CardImage from "../components/CardImage.vue";
import { useDark } from "@vueuse/core";
import { ref, onMounted } from "vue";

const props = defineProps({
	index: { type: Number, required: true },
	id: { type: Number, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	image: { type: String, required: true },
	creation_date: { type: String, required: true },
});

const isDark = useDark();
const loaded = ref(false);

onMounted(() => {
	setTimeout(() => {
		loaded.value = true;
	}, (props.index + 1) * 100);
});
</script>

<template>
	<div v-if="loaded" class="new-card mb-5 shadow" :class="isDark ? 'new-card-bg-dark' : 'new-card-bg-light'">
		<div class="col-4 px-0 d-lg-block d-none">
			<CardImage :image="image" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #e4f0e8;

.new-card {
	border-radius: 20px;
	height: 300px;
	animation: slideIn 0.7s ease-in-out;
}

.new-card-bg-dark {
	background-color: $primary-color;
}

.new-card-bg-light {
	background-color: $secondary-color;
}

@keyframes slideIn {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(0);
	}
}
</style>
