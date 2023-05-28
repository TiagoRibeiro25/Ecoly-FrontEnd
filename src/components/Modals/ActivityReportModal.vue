<script setup>
import { ref, watchEffect } from "vue";
import { useActivitiesStore } from "../../stores/activities";
import DetailImages from "../DetailImages.vue";

const emits = defineEmits(["close"]);
const props = defineProps({
	show: { type: Boolean, required: true },
	id: { type: String, required: true },
});

const activity = ref(null);
const fetching = ref(false);
const errorMsg = ref("");

watchEffect(async () => {
	if (!props.show) return;

	fetching.value = true;
	errorMsg.value = "";

	const activitiesStore = useActivitiesStore();
	const response = await activitiesStore.getActivityReport(props.id);

	if (response.success) {
		activity.value = response.data;
	} else {
		errorMsg.value = response.message;
	}

	fetching.value = false;
});
</script>

<template>
	<b-modal v-model="props.show" size="lg" hide-footer @hidden="() => emits('close')">
		<div v-if="fetching || errorMsg !== ''" class="d-flex justify-content-center align-items-center h-100">
			<b-spinner v-if="fetching" variant="success" label="Carregando Relatório..."></b-spinner>
			<span v-else class="error-msg text-center">{{ errorMsg }}</span>
		</div>

		<div v-else class="container">
			<div
				class="row mx-auto text-center d-flex justify-content-center align-items-center"
				style="transform: scale(0.9)"
			>
				<DetailImages :images="activity.images" />
			</div>
			<div class="row mx-auto mt-3">
				<p class="report-description text-justify">
					{{ activity.report }}
				</p>
			</div>
		</div>
	</b-modal>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;

.error-msg {
	font-family: "Panton", sans-serif;
	font-size: 1.2rem;
	font-weight: 600;
	color: $primary-color;
}
</style>
