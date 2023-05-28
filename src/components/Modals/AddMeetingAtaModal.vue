<script setup>
import { useMeetingsStore } from "../../stores/meetings";
import AddImages from "../AddImages.vue";
import { ref } from "vue";

const emits = defineEmits(["close"]);
const props = defineProps({
	show: { type: Boolean, required: true },
	id: { type: Number, required: true },
});

const images = ref([]);
const text = ref("");
const adding = ref(false);
const errorMsg = ref("");

const verifyText = () => !RegExp(/[a-z]/i).exec(text.value);

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
				<AddImages :images="images" />
			</div>

			<div class="mt-5">
				<!-- Max rows -->
				<b-form-textarea
					class="ata-textarea mb-4"
					v-model="text"
					placeholder="Insira a ata da reunião..."
					rows="8"
				></b-form-textarea>
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
					:disabled="verifyText() || images.length === 0"
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

.ata-textarea {
	font-family: "Panton", sans-serif;
	font-size: 1.2rem;
	font-weight: 400;
	text-align: justify;
	color: $primary-color;
	background-color: transparent;
	border: 2px solid $fourth-color;
	border-radius: 0.6rem;
	max-height: 25rem;
	min-height: 6rem;

	&:focus {
		border-color: $tertiary-color;
		box-shadow: none;
		outline: transparent;
	}
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
