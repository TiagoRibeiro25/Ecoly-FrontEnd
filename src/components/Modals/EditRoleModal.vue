<script setup>
import { ref } from "vue";
import Input from "../Input.vue";
import { useUsersStore } from "../../stores/users";

const props = defineProps({
	type: { type: String, required: true }, // "role" | "theme"
	item: { type: Object, required: true },
	show: { type: Boolean, required: true },
	inputPlaceholder: { type: String, required: false },
});

const emit = defineEmits(["close", "update"]);

const updating = ref(false);
const msg = ref("");
const newItem = ref("");

const handleModalClose = () => {
	msg.value = "";
	updating.value = false;
	emit("close");
};

const formatText = (text) => {
	return text
		.trim() // Remove extra spaces
		.toLowerCase() // Lowercase
		.replace(/\s+/g, " ") // Remove extra spaces
		.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
};

const updateItem = async () => {
	updating.value = true;
	msg.value = "";

	const newItemValue = props.type === "role" ? formatText(newItem.value) : newItem.value;
	const usersStore = useUsersStore();
	let response = null;

	if (props.type === "role") {
		response = await usersStore.editRole(props.item.id, newItemValue);
	} else {
		response = { success: false, msg: "Tipo inválido" };
	}

	if (!response.success) {
		msg.value = response.message;
		updating.value = false;
		return;
	}

	updating.value = false;
	newItem.value = "";
	emit("update");
	emit("close");
};
</script>

<template>
	<b-modal v-model="props.show" size="lg" hide-footer @hidden="handleModalClose">
		<div class="container">
			<h4 class="modal-title text-center mt-1 mb-3">Mudar {{ props.item.title }} para</h4>

			<div class="w-75 mx-auto">
				<Input
					:text="newItem"
					:placeholder="props.inputPlaceholder || props.item.title"
					type="input"
					@update:text="newItem = $event"
				/>
			</div>

			<div v-if="updating" class="w-100 text-center mt-4">
				<b-spinner variant="success" label="Adicionando"></b-spinner>
			</div>

			<div class="text-center w-100 mt-3">
				<span class="error-msg">{{ msg }}</span>
			</div>

			<b-button
				type="button"
				class="btn btn-block modal-edit-btn w-50 mx-auto mt-4"
				:disabled="updating || newItem.trim() === ''"
				@click="updateItem"
			>
				Aplicar
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

.modal-edit-btn {
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
