<script setup>
import { useDark } from "@vueuse/core";
import { useActivitiesStore } from "../../stores/activities";
import { onBeforeMount, ref } from "vue";

const isDark = useDark();
const activitiesStore = useActivitiesStore();
/** @type { Array<{id: number, name: string} } */
const themes = ref([]);
const isLoaded = ref(false);

onBeforeMount(async () => {
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
				<button class="btn theme-btn mx-2 my-2" :class="isDark ? 'theme-btn-dark' : 'theme-btn-light'">
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
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #ffffff;
$tertiary-color: #18516f;
$quaternary-color: #aedcc0;
$quinary-color: #e4f0e8;
$senary-color: #3fc380;

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
		background-color: $tertiary-color;
		color: $secondary-color;
	}
}

.add-btn {
	&-dark {
		background-color: $senary-color;
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
			background-color: $senary-color;
			color: $primary-color;
		}
	}
}
</style>
