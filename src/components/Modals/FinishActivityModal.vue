<script setup>
import { ref } from "vue";
import AddImages from "../AddImages.vue";
import Input from "../Input.vue";
import { useActivitiesStore } from "../../stores/activities";

const props = defineProps({
	id: { type: Number, required: true },
	show: { type: Boolean, required: true },
});

const emit = defineEmits(["close", "update"]);

const finishing = ref(false);
const msg = ref("");
const imgs = ref([]);
const report = ref("");

const handleCloseModal = () => {
	finishing.value = false;
	msg.value = "";
	imgs.value = [];
	report.value = "";

	emit("close");
};

const finishActivity = async () => {
	finishing.value = true;
	msg.value = "";

	const activitiesStore = useActivitiesStore();
	const response = await activitiesStore.finishActivity({
		id: props.id,
		report: report.value,
		images: imgs.value,
	});

	if (response.success) {
		emit("update");
		handleCloseModal();
	} else msg.value = response.message;

	finishing.value = false;
};
</script>

<template>
	<b-modal v-model="props.show" size="lg" hide-footer @hidden="handleCloseModal">
		<div class="container">
			<h4 class="modal-title text-center mt-1">Finalizar atividade</h4>

			<div class="col-12">
				<AddImages :images="imgs" />
			</div>

			<div class="col-12 mt-4">
				<Input
					:text="report"
					placeholder="Relatório da atividade (mínimo 100 caracteres)"
					type="textarea"
					@update:text="(val) => (report = val)"
				/>
			</div>

			<div class="col-12 mt-4">
				<div v-if="finishing" class="text-center">
					<b-spinner variant="success" label="Carregando..."></b-spinner>
				</div>
				<div v-if="msg !== ''" class="text-center">
					<span class="msg">{{ msg }}</span>
				</div>
			</div>

			<div class="col-12 mt-3 text-center">
				<b-button
					class="btn finish-btn px-5"
					:disabled="finishing || report.trim() === '' || imgs.length === 0"
					@click="finishActivity"
				>
					Finalizar
				</b-button>
			</div>
		</div>
	</b-modal>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #18516f;
$tertiary-color: #ffffff;

.modal-title {
	font-family: "Panton", sans-serif;
	font-size: 1.5rem;
	font-weight: 600;
	color: $primary-color;
}

.finish-btn {
	background-color: $primary-color;
	color: $tertiary-color;
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 600;

	&:hover {
		background-color: $secondary-color;
		color: $tertiary-color;
	}
}
</style>
