<script setup>
import { onMounted, onUnmounted, ref, watchEffect } from "vue";

const props = defineProps({
	images: { type: Array, required: true },
	width: { type: Number, required: false, default: 268 },
	height: { type: Number, required: false, default: 170 },
});

const dataImages = ref([]);
const selectedImage = ref(null);
const modalRef = ref(null);

const openModal = (index) => {
	selectedImage.value = dataImages.value[index];
	modalRef.value.classList.add("show");
};

const closeModal = (event) => {
	if (event.target === modalRef.value) {
		modalRef.value.classList.remove("show");
	}
};

const handleKeyDown = (event) => {
	if (event.key === "Escape") {
		modalRef.value.classList.remove("show");
	}
};

onMounted(() => {
	window.addEventListener("click", closeModal);
	window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
	window.removeEventListener("click", closeModal);
	window.removeEventListener("keydown", handleKeyDown);
});

watchEffect(() => {
	if (props.images.length !== 0) {
		dataImages.value = [];
		let i = 0;
		const internal = setInterval(() => {
			if (i < props.images.length) {
				dataImages.value.push(props.images[i]);
				i++;
			} else {
				clearInterval(internal);
			}
		}, 200);
	}
});
</script>

<template>
	<div>
		<div
			v-if="dataImages.length !== 0"
			class="col-12 h-100 d-xl-block d-flex justify-content-center align-items-center"
		>
			<img
				v-for="(image, index) in dataImages"
				:key="index"
				:src="image"
				@click="openModal(index)"
				class="newDetailsImg img-fluid my-3 mx-3 rounded-lg shadow"
				alt="Imagem do Item"
				:width="props.width"
				:height="props.height"
				:style="'width: ' + props.width + 'px; height: ' + props.height + 'px;'"
			/>
		</div>
		<div v-else class="col-12 d-flex justify-content-center align-items-center" style="height: 190px">
			<b-spinner variant="success" label="Carregando..."></b-spinner>
		</div>

		<!-- Modal -->
		<div class="modal" tabindex="-1" ref="modalRef" @click="closeModal">
			<div class="modal-dialog modal-dialog-centered modal-xl">
				<div class="modal-content">
					<div class="modal-body d-flex justify-content-center align-items-center">
						<img :src="selectedImage" class="img-fluid" alt="Imagem ampliada" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.newDetailsImg {
	animation: slideIn 1s ease-in-out;
	cursor: pointer;
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

.modal {
	display: none;
	background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
	background-color: transparent !important;
	border: none !important;
}

.modal.show {
	display: block;
}
</style>
