<script setup>
import ChangeViewButton from "../../components/ChangeViewButton.vue";
import { useDark } from "@vueuse/core";

const isDark = useDark();
const props = defineProps({ isUserAdmin: { type: Boolean, required: false, default: false } });
</script>

<template>
	<div class="col-12 pt-3 pb-5 px-0 d-flex flex-xl-row flex-column">
		<div
			class="col-xl-3 col-12 px-0 d-flex justify-content-xl-start justify-content-center align-items-center"
		>
			<h2 class="fa-title my-auto" :class="isDark ? 'fa-title-dark' : 'fa-title-light'">AÇÕES RÁPIDAS</h2>
		</div>
		<div
			class="col-xl-3 col-12 px-0 d-flex justify-content-xl-start justify-content-center align-items-center mt-xl-0 mt-3"
		>
			<ChangeViewButton text="Adicionar Atividade" to="ActivityCreate" iconImg="../assets/icons/add.svg" />
		</div>
		<div class="col-xl-3 col-12 px-0 d-flex justify-content-center align-items-center mt-xl-0 mt-3">
			<ChangeViewButton
				text="Adicionar Notícia"
				to="NewCreate"
				iconImg="../assets/icons/add.svg"
				:disable="!isUserAdmin"
			/>
		</div>
		<div
			class="col-xl-3 col-12 px-0 d-flex justify-content-xl-end justify-content-center align-items-center mt-xl-0 mt-3"
		>
			<ChangeViewButton
				text="Administrador"
				to="Admin"
				iconImg="../assets/icons/admin.svg"
				:disable="!isUserAdmin"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;

.fa-title {
	font-family: "Panton", sans-serif;
	font-weight: 500;
	font-size: 1.7rem;
	color: $primary-color;

	&-dark {
		color: $secondary-color;
	}

	&-light {
		color: $primary-color;
	}
}
</style>
