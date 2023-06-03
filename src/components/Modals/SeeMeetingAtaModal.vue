<script setup>
import DetailImages from "../DetailImages.vue";
import { useMeetingsStore } from "../../stores/meetings";
import { ref, watchEffect } from "vue";

const emits = defineEmits(["close"]);
const props = defineProps({
	show: { type: Boolean, required: true },
	id: { type: Number, required: true },
});

const meeting = ref(null);
const fetching = ref(true);
const errorMsg = ref("");

watchEffect(async () => {
	if (!props.show) return;

	const id = props.id;
	fetching.value = true;
	errorMsg.value = "";
	meeting.value = null;

	const meetingsStore = useMeetingsStore();
	const response = await meetingsStore.getMeetingAta(id);

	if (response.success) {
		meeting.value = response.data;
	} else {
		errorMsg.value = response.message;
	}

	fetching.value = false;
});
</script>

<template>
	<b-modal v-model="props.show" size="lg" hide-footer @hidden="() => emits('close')">
		<div
			v-if="fetching || errorMsg !== ''"
			class="container d-flex justify-content-center align-items-center flex-column h-100"
		>
			<b-spinner v-if="fetching" variant="success" label="Carregando Ata..."></b-spinner>
			<span v-else class="error-msg">
				{{ errorMsg }}
			</span>
		</div>

		<div v-else class="container">
			<div class="text-center">
				<DetailImages :images="meeting.images" :hasAnimation="false" />
			</div>

			<div class="row mx-auto justify-content-end mt-4">
				<span class="modal-date">
					{{ meeting.date }}
				</span>
			</div>
			<div class="mt-2 mb-3">
				<p class="modal-description text-justify custom-scroll-bar px-3">
					{{ meeting.ata }}
				</p>
			</div>
		</div>
	</b-modal>
</template>

<style lang="scss" scoped>
$primary-color: #aedcc0;
$secondary-color: #3fc380;
$tertiary-color: #18516f;

.modal-date,
.error-msg,
.modal-description {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 500;
}

.error-msg {
	font-size: 1.4rem;
}

.modal-description {
	font-weight: 400;
	max-height: 20rem;
	overflow-y: auto;
}

.custom-scroll-bar {
	&::-webkit-scrollbar {
		width: 10px;
	}

	&::-moz-scrollbar {
		width: 10px;
	}

	scrollbar-width: 10px;

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-moz-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background: $secondary-color;
	}

	&::-moz-scrollbar-thumb {
		background: $secondary-color;
	}

	&.custom-scroll-bar-dark {
		&::-webkit-scrollbar-thumb:hover {
			background: $primary-color;
		}

		&::-moz-scrollbar-thumb:hover {
			background: $primary-color;
		}
	}

	&.custom-scroll-bar-light {
		&::-webkit-scrollbar-thumb:hover {
			background: $tertiary-color;
		}

		&::-moz-scrollbar-thumb:hover {
			background: $tertiary-color;
		}
	}
}
</style>
