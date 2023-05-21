<script setup>
import { useDark } from "@vueuse/core";
import { useActivitiesStore } from "../../stores/activities";
import { watchEffect, ref } from "vue";
import DeleteModal from "../../components/Modals/DeleteModal.vue";

const isDark = useDark();
const activitiesStore = useActivitiesStore();
/** @type { Array<{id: number, name: string} } */
const themes = ref([]);
const isLoaded = ref(false);
/** @type {{id: number, name:string }} */
const themeToDelete = ref(null);
const showDeleteModal = ref(false);
const fetchAgain = ref(false);

const showModal = (theme) => {
	themeToDelete.value = theme;
	showDeleteModal.value = true;
};

watchEffect(async () => {
	if (!fetchAgain.value && themes.value.length !== 0) return;

	fetchAgain.value = false;
	themes.value = [];
	isLoaded.value = false;

	const response = await activitiesStore.getActiveThemes();
	if (response.success) themes.value = response.data;
	isLoaded.value = true;
});
</script>

<template>
	<div class="d-flex justify-content-center align-items-center">
		<div v-if="!isLoaded">
			<b-spinner variant="success" label="Carregando Temas..."></b-spinner>
		</div>
		<div v-else class="d-flex flex-wrap justify-content-center">
			<div v-if="themes.length === 0">
				<h2 class="error-title" :class="isDark ? 'error-title-dark' : 'error-title-light'">
					Ocorreu um erro ao carregar os temas.
				</h2>
			</div>
			<div v-for="theme in themes" :key="theme.id">
				<button
					class="btn theme-btn mx-2 my-2"
					:class="isDark ? 'theme-btn-dark' : 'theme-btn-light'"
					@click="showModal(theme)"
				>
					{{ theme.name }}
				</button>
			</div>
			<div>
				<button class="btn theme-btn add-btn mx-2 my-2" :class="isDark ? 'add-btn-dark' : 'add-btn-light'">
					Adicionar Tema
				</button>
			</div>
		</div>
	</div>

	<DeleteModal
		:id="themeToDelete?.id"
		:show="showDeleteModal"
		type="theme"
		:text="themeToDelete?.name"
		@close="showDeleteModal = false"
		@delete="fetchAgain = true"
	/>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #ffffff;
$tertiary-color: #18516f;
$quaternary-color: #aedcc0;
$quinary-color: #3fc380;
$senary-color: #8e0101;

.error-title {
	font-family: "Panton", sans-serif;
	font-weight: 600;
	font-size: 1.5rem;
	color: $primary-color;

	&-dark {
		color: $quaternary-color;
	}

	&-light {
		color: $primary-color;
	}
}

.theme-btn {
	font-family: "Panton", sans-serif;
	font-weight: 600;
	font-size: 1rem;
	width: 200px;

	&-dark {
		background-color: $quaternary-color;
		color: $primary-color;
	}

	&-light {
		background-color: $primary-color;
		color: $secondary-color;
	}

	&:hover {
		background-color: $senary-color;
		color: $secondary-color;
	}
}

.add-btn {
	&-dark {
		background-color: $quinary-color;
		color: $primary-color;

		&:hover {
			background-color: $tertiary-color;
			color: $secondary-color;
		}
	}

	&-light {
		background-color: $tertiary-color;
		color: $secondary-color;

		&:hover {
			background-color: $quinary-color;
			color: $secondary-color;
		}
	}
}
</style>
