<script setup>
import { ref } from "vue";
import AddInput from "../AddInput.vue";
import { useActivitiesStore } from "../../stores/activities";

const props = defineProps({
	type: { type: String, required: true }, // "theme" | "role" | "school"
	text: { type: String, required: true },
	show: { type: Boolean, required: true },
	inputPlaceholder: { type: String, required: false },
});

const emit = defineEmits(["close", "add"]);

const adding = ref(false);
const msg = ref("");
const newItem = ref("");

const handleModalClose = () => {
	msg.value = "";
	adding.value = false;
	emit("close");
};

const formatText = (text) => {
	return text
		.trim() // Remove extra spaces
		.toLowerCase() // Lowercase
		.replace(/\s+/g, " ") // Remove extra spaces
		.replace(/[^a-zA-Z ]/g, "") // Remove special characters and numbers
		.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
};

const addTheme = (theme) => {
	const activitiesStore = useActivitiesStore();
	return activitiesStore.addTheme(theme);
};

const addItem = async () => {
	const item = formatText(newItem.value);

	if (item === "") {
		msg.value = "Valor inválido!";
		return;
	}

	adding.value = true;
	msg.value = "";
	let response = null;

	if (props.type === "theme") {
		response = await addTheme(item);
	} else {
		response = { success: false, message: "Tipo inválido" };
	}

	adding.value = false;

	if (!response.success) {
		msg.value = response.message;
		return;
	}

	newItem.value = "";
	emit("add");
	emit("close");
};
</script>

<template>
	<b-modal v-model="props.show" size="lg" hide-footer @hidden="handleModalClose">
		<div class="container">
			<h4 class="modal-title text-center mt-1 mb-3">Adicionar {{ props.text }}</h4>

			<div class="w-75 mx-auto">
				<AddInput
					:text="newItem"
					:placeholder="props.inputPlaceholder || props.text"
					type="input"
					@update:text="newItem = $event"
				/>
			</div>

			<div v-if="adding" class="w-100 text-center mt-4">
				<b-spinner variant="success" label="Adicionando"></b-spinner>
			</div>

			<div class="text-center w-100 mt-3">
				<span class="error-msg">{{ msg }}</span>
			</div>

			<b-button
				type="button"
				class="btn btn-block modal-add-btn w-50 mx-auto mt-4"
				:disabled="adding || newItem.trim() === ''"
				@click="addItem"
			>
				Adicionar
			</b-button>
		</div>
	</b-modal>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #18516f;

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

.modal-add-btn {
	font-family: "Panton", sans-serif;
	font-size: 1.2rem;
	font-weight: 600;
	background-color: $primary-color;
	border: none;

	&:hover {
		background-color: $secondary-color;
	}
}
</style>
