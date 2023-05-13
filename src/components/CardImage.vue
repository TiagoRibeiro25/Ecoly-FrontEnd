<script setup>
import { ref } from "vue";

const props = defineProps({
	image: { type: String, required: true },
});
const image = props.image;
const isNewItemHovered = ref(false);
</script>

<template>
	<div class="w-100 h-100" @mouseover="isNewItemHovered = true" @mouseleave="isNewItemHovered = false">
		<img class="img-fluid news-image w-100 h-100" v-lazy="{ src: image }" alt="Imagem de Destaque" />
		<img
			class="img-fluid overlay-image w-100 h-100 position-absolute"
			v-lazy="{ src: '../assets/icons/seeMore.svg' }"
			alt="Imagem de Destaque"
			:style="{ opacity: isNewItemHovered ? 1 : 0 }"
		/>
	</div>
</template>

<style lang="scss" scoped>
.news-image {
	border-radius: 20px 0 0 20px;
	object-fit: cover;
	max-height: 300px;
}

.overlay-image {
	border-radius: 20px 0 0 20px;
	background-color: rgba(255, 255, 255, 0.3);
	padding: 100px;
	transform: translateX(-100%);
	transition: opacity 0.5s;
	cursor: pointer;
}
</style>
