<script setup>
import { onBeforeMount } from "vue";
import Header from "../../components/Header.vue";
import { useRouter } from "vue-router";

onBeforeMount(async () => {
	const router = useRouter();
	await router.push({ name: "NotFound" });
});
</script>

<template>
	<div class="col-12 mt-5">
		<Header title="DASHBOARD" />
	</div>

	<div class="d-flex flex-column align-items-center justify-content-center" style="height: 70vh">
		<b-spinner variant="success" label="Carregando..."></b-spinner>
	</div>
</template>
