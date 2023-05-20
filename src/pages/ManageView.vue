<script setup>
import Header from "../components/Header.vue";
import { useDark } from "@vueuse/core";
import { useUsersStore } from "../stores/users";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import ChangeViewButton from "../components/ChangeViewButton.vue";
import ManageHeader from "../components/ManageHeader.vue";

const isDark = useDark();
const router = useRouter();
const isLoaded = ref(false);
const isUserAdmin = ref(false);

onBeforeMount(async () => {
	const usersStore = useUsersStore();
	const response = await usersStore.getLoggedInUser();

	if (!response.success || response.data.role === "unsigned") {
		router.push({ name: "NotFound" });
		return;
	}

	isUserAdmin.value = response.data.role === "admin";
	isLoaded.value = true;
});
</script>

<template>
	<div v-if="!isLoaded" class="d-flex justify-content-center align-items-center" style="height: 100vh">
		<b-spinner variant="success" label="Carregando..."></b-spinner>
	</div>

	<div v-else>
		<div class="col-12 mt-5">
			<Header title="GESTÃO" />
		</div>
		<div class="col-12 mb-4">
			<div class="mx-auto px-5" style="max-width: 1403px">
				<div class="col-12 pt-3 pb-4 px-0 d-flex flex-xl-row flex-column">
					<div
						class="col-xl-3 col-12 px-0 d-flex justify-content-xl-start justify-content-center align-items-center"
					>
						<h2 class="fa-title my-auto" :class="isDark ? 'fa-title-dark' : 'fa-title-light'">
							AÇÕES RÁPIDAS
						</h2>
					</div>
					<div
						class="col-xl-3 col-12 px-0 d-flex justify-content-xl-start justify-content-center align-items-center mt-xl-0 mt-3"
					>
						<ChangeViewButton
							text="Adicionar Atividade"
							to="ActivityCreate"
							iconImg="../assets/icons/add.svg"
						/>
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

				<div class="col-12 mt-5 px-0">
					<ManageHeader title="Temas" description="adicionar temas para as atividades" />
				</div>
			</div>
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
