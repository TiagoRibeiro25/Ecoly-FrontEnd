<script setup>
import { ref } from "vue";

const props = defineProps({
	images: { type: Array, required: true },
});

const dataImages = ref([]);

let i = 0;
const internal = setInterval(() => {
	if (i < props.images.length) {
		dataImages.value.push(props.images[i]);
		i++;
	} else clearInterval(internal);
}, 200);
</script>

<template>
	<div
		v-if="dataImages.length !== 0"
		class="col-12 h-100 d-xl-block d-flex justify-content-center align-items-center"
	>
		<img
			v-for="(image, index) in dataImages"
			:key="index"
			v-lazy="image"
			class="newDetailsImg img-fluid my-3 mx-3 rounded-lg shadow"
			alt="Imagem do Item"
		/>
	</div>
	<div v-else class="col-12" style="height: 190px">
		<div class="col-12 d-flex justify-content-center align-items-center">
			<b-spinner variant="success" label="Carregando..."></b-spinner>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.newDetailsImg {
	width: 268px;
	height: 170px;
	animation: slideIn 1s ease-in-out;
}

@keyframes slideIn {
	0% {
		transform: translateX(200%) scale(0.5);
		opacity: 0;
	}
	100% {
		transform: translateX(0) scale(1);
		opacity: 1;
	}
}
</style>
