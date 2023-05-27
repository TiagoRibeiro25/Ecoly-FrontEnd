<script setup>
import Header from "../../components/Header.vue";
import { useUsersStore } from "../../stores/users";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import ManageHeader from "../../components/ManageHeader.vue";
import Themes from "./Themes.vue";
import FastActions from "./FastActions.vue";
import ContactMembers from "./ContactMembers.vue";
import CreateMeeting from "./CreateMeeting.vue";

const router = useRouter();
const isLoaded = ref(false);
const isUserAdmin = ref(false);

onBeforeMount(async () => {
	const usersStore = useUsersStore();
	const response = await usersStore.getLoggedInUser();

	if (!response.success || response.data.role === "unsigned") {
		await router.push({ name: "NotFound" });
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

				<!-- Meetings -->
				<div class="col-12 mt-5 px-0 pt-4">
					<ManageHeader
						title="Reuniões"
						description="crie reuniões ou registe as reuniões do conselho adicionando a respetiva ata"
					/>
					<div class="col-12 mt-5 px-0 d-flex flex-xl-row flex-column">
						<div class="col-xl-6 col-12 px-0"></div>
						<div class="col-xl-6 col-12 px-0 mt-xl-0 mt-4">
							<CreateMeeting />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
