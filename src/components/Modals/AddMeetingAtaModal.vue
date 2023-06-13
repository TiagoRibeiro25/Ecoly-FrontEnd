<script setup>
import { useMeetingsStore } from "../../stores/meetings";
import AddImages from "../AddImages.vue";
import { ref } from "vue";
import Input from "../Input.vue";

const emits = defineEmits(["close"]);
const props = defineProps({
	show: { type: Boolean, required: true },
	id: { type: Number, required: true },
});

const images = ref([]);
const text = ref("");
const adding = ref(false);
const errorMsg = ref("");

const verifyForm = () => {
	if (images.length === 0) return true;
	if (text.value.length < 100) return true;
	return !RegExp(/[a-z]/i).exec(text.value);
};

const addAta = async () => {
	adding.value = true;
	errorMsg.value = "";

	const data = {
		id: props.id,
		ata: text.value,
		images: images.value.map((image) => image),
	};

	const meetingsStore = useMeetingsStore();
	const response = await meetingsStore.addMeetingAta(data);

	if (response.success) {
		images.value = [];
		text.value = "";
		emits("close");
	} else {
		errorMsg.value = response.message;
	}

	adding.value = false;
};
</script>

<template>
	<b-modal v-model="props.show" size="lg" hide-footer @hidden="() => emits('close')">
		<div class="container">
			<h2 class="modal-warning mb-4">Depois de adicionar a ata, você <b>não</b> poderá mais editá-la.</h2>

			<div class="text-center">
				<AddImages :images="images" :maxImages="2" />
			</div>

			<div class="mt-5">
				<!-- Max rows -->
				<Input
					class="mb-5"
					:text="text"
					placeholder="Insira a ata da reunião (mínimo 100 caracteres)"
					type="textarea"
					@update:text="($event) => (text = $event)"
				/>
			</div>

			<div v-if="adding || errorMsg !== ''" class="w-100 text-center mb-4">
				<b-spinner v-if="adding" variant="success" label="Carregando..."></b-spinner>
				<span v-else class="error-msg">
					{{ errorMsg }}
				</span>
			</div>

			<div class="mb-2 d-flex justify-content-center">
				<button
					type="button"
					class="btn add-ata-btn text-center px-5"
					:disabled="verifyForm()"
					@click="addAta"
				>
					Adicionar Ata
				</button>
			</div>
		</div>
	</b-modal>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #ffffff;
$tertiary-color: #18516f;
$fourth-color: #aedcc0;

.modal-warning {
	font-family: "Panton", sans-serif;
	font-size: 1.5rem;
	font-weight: 500;
	color: $primary-color;
	text-align: center;
}

.error-msg {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 500;
	color: $primary-color;
}

.add-ata-btn {
	font-family: "Panton", sans-serif;
	font-size: 1.2rem;
	font-weight: 500;
	color: $secondary-color;
	background-color: $primary-color;
	border: none;
	border-radius: 0.6rem;
}
</style>
