<script setup>
import { useNewsStore } from "../../stores/news";
import { useActivitiesStore } from "../../stores/activities";
import { ref } from "vue";

const props = defineProps({
	id: { type: Number, required: true },
	type: { type: String, required: true }, // "new" | "activity" | "theme"
	text: { type: String, required: true },
	show: { type: Boolean, required: true },
});

const emit = defineEmits(["close", "delete"]);

const deleting = ref(false);
const msg = ref("");

const handleModalClose = () => {
	msg.value = "";
	deleting.value = false;
	emit("close");
};

const deleteNew = () => {
	const newsStore = useNewsStore();
	return newsStore.deleteNew(props.id);
};

const deleteActivity = () => {
	const activitiesStore = useActivitiesStore();
	return activitiesStore.deleteActivity(props.id);
};

const deleteTheme = () => {
	const activitiesStore = useActivitiesStore();
	return activitiesStore.deleteTheme(props.id);
};

const deleteItem = async () => {
	msg.value = "";
	deleting.value = true;

	let response = null;

	if (props.type === "new") {
		response = await deleteNew();
	} else if (props.type === "activity") {
		response = await deleteActivity();
	} else if (props.type === "theme") {
		response = await deleteTheme();
	} else {
		response = { success: false, message: "Tipo inválido" };
	}

	deleting.value = false;

	if (!response.success) {
		msg.value = response.message;
		return;
	}

	handleModalClose();
	emit("delete");
};
</script>

<template>
	<b-modal v-model="props.show" size="lg" hide-footer @hidden="handleModalClose">
		<div class="container">
			<h4 class="modal-title text-center mt-1">Tens a certeza que queres apagar {{ props.text }}?</h4>

			<div v-if="deleting" class="w-100 text-center mt-4">
				<b-spinner variant="danger" label="Removendo"></b-spinner>
			</div>

			<div class="text-center w-100 mt-3">
				<span class="error-msg">{{ msg }}</span>
			</div>

			<b-button
				type="button"
				class="btn btn-block modal-remove-btn w-50 mx-auto mt-4"
				:disabled="removing"
				@click="deleteItem"
			>
				Remover
			</b-button>
		</div>
	</b-modal>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #8e0101;
$tertiary-color: #b50202;

.modal-title {
	font-family: "Panton", sans-serif;
	font-size: 1.5rem;
	font-weight: 600;
	color: $primary-color;
}

.error-msg {
	font-family: "Panton", sans-serif;
	font-size: 1.2rem;
	font-weight: 600;
	color: $secondary-color;
}

.modal-remove-btn {
	font-family: "Panton", sans-serif;
	font-size: 1.2rem;
	font-weight: 600;
	background-color: $secondary-color;
	border: none;

	&:hover {
		background-color: $tertiary-color;
	}
}
</style>
