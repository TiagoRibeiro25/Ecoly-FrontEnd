<script setup>
import { useDark } from "@vueuse/core";
import Header from "../../components/Header.vue";
import { onBeforeMount, ref } from "vue";
import { useUsersStore } from "@/stores/users";
import { useRouter } from "vue-router";

const isDark = useDark();
const router = useRouter();
const activity = ref({
	imgs: [],
	title: "",
	diagnostic: "",
	objective: "",
	participants: "",
	metas: "",
	resources: "",
	evaluationIndicators: "",
	evaluationMethod: "",
	complexity: 0,
	theme: "",
	initialDate: "",
	finalDate: "",
});
const msg = ref("");
const creating = ref(false);
const loading = ref(true);

onBeforeMount(async () => {
	const usersStore = useUsersStore();
	const response = await usersStore.getLoggedInUser();

	if (response.success && response.data.role !== "unsigned") {
		loading.value = false;
		return;
	}

	await router.push({ name: "NotFound" });
});
</script>

<template>
	<div v-if="loading" class="col-12 d-flex justify-content-center align-items-center" style="height: 100vh">
		<b-spinner variant="success" label="Carregando"></b-spinner>
	</div>

	<div v-else class="col-12 mt-5">
		<Header title="Adicionar Atividade" />
	</div>
</template>
