<script setup>
import Header from "../components/Header.vue";
import { useDark } from "@vueuse/core";
import { useUsersStore } from "../stores/users";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

const isDark = useDark();
const router = useRouter();
const isLoaded = ref(false);

onBeforeMount(async () => {
	const usersStore = useUsersStore();
	const response = await usersStore.getLoggedInUser();

	if (!response.success || response.data.role !== "admin") {
		router.push({ name: "NotFound" });
		return;
	}

	isLoaded.value = true;
});
</script>

<template>
	<div v-if="!isLoaded" class="d-flex justify-content-center align-items-center" style="height: 100vh">
		<b-spinner variant="success" label="Carregando..."></b-spinner>
	</div>

	<div v-else>
		<div class="col-12 mt-5">
			<Header title="ÁREA DE ADMINISTRADOR" />
		</div>
	</div>
</template>
