<script setup>
import Header from "../../components/Header.vue";
import { useDark } from "@vueuse/core";
import { useUsersStore } from "../../stores/users";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import ChangeViewButton from "../../components/ChangeViewButton.vue";
import ManageHeader from "../../components/ManageHeader.vue";
import Themes from "./Themes.vue";
import FastActions from "./FastActions.vue";
import ContactMembers from "./ContactMembers.vue";

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
				<!-- Fast Actions -->
				<FastActions :isUserAdmin="isUserAdmin" />

				<!-- Themes -->
				<div class="col-12 mt-5 px-0">
					<ManageHeader title="Temas" description="adicionar temas para as atividades" />
					<div class="col-12 mt-5 px-0">
						<Themes />
					</div>
				</div>

				<!-- Contact -->
				<div class="col-12 mt-5 px-0 pt-4">
					<ManageHeader
						title="Contactar Membros"
						description="entre em contacto com outros membros do conselho"
					/>
					<div class="col-12 mt-5 px-0">
						<ContactMembers />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
