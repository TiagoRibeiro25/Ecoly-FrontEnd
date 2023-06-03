<script setup>
const props = defineProps({
	images: { type: Array, required: true },
	maxImages: { type: Number, required: false, default: 4 },
});

const addImage = () => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*";
	input.onchange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			props.images.push(reader.result);
		};
	};
	input.click();
};

const removeImage = (index) => props.images.splice(index, 1);
</script>

<template>
	<div class="col-12 d-flex justify-content-center align-items-center px-0">
		<img
			v-for="(image, index) in images"
			:key="index"
			v-lazy="{ src: image }"
			class="add-new-img placeholder img-fluid my-3 mx-3 rounded-lg shadow"
			alt="Imagem adicionada"
			@click="removeImage(index)"
		/>

		<img
			v-if="images.length < maxImages"
			v-lazy="{ src: '../assets/images/addImage.webp' }"
			class="add-new-img img-fluid my-3 mx-3 rounded-lg shadow"
			alt="Adicionar imagem"
			@click="addImage"
		/>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #ffffff;
$tertiary-color-color: #18516f;

.add-new-img {
	width: 220px;
	height: 150px;
	transform: scale (1);
	transition: transform 0.3s ease-in-out;

	&:hover {
		cursor: pointer;
		transform: scale(1.05);
	}
}

.placeholder:hover {
	border: 1px solid red;
	opacity: 0.6;
}
</style>
