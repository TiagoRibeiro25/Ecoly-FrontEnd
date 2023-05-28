<script setup>
import { useDark } from "@vueuse/core";
import { ref, watchEffect } from "vue";
import { useMeetingsStore } from "../../stores/meetings";
import SeeMeetingDescriptionModal from "../../components/Modals/SeeMeetingDescriptionModal.vue";
import SeeMeetingAtaModal from "../../components/Modals/SeeMeetingAtaModal.vue";
import AddMeetingAtaModal from "../../components/Modals/AddMeetingAtaModal.vue";

const isDark = useDark();
const meetingsStore = useMeetingsStore();
const option = ref("past"); // past | future
const meetings = ref([]);
const meetingSelected = ref(null);
const seeDescriptionModal = ref(false);
const seeAtaModal = ref(false);
const seeAddAtaModal = ref(false);

const showDescriptionModal = (meeting) => {
	meetingSelected.value = meeting;
	seeDescriptionModal.value = true;
};

const showAtaModal = (meeting) => {
	meetingSelected.value = meeting;
	seeAtaModal.value = true;
};

const showAddAtaModal = (meeting) => {
	meetingSelected.value = meeting;
	seeAddAtaModal.value = true;
};

const fetching = ref(true);
const errorMsg = ref("");

watchEffect(async () => {
	if (option.value !== "past" && option.value !== "future") return;

	meetings.value = [];
	fetching.value = true;

	const response = await meetingsStore.getMeetings(option.value);

	if (response.success) {
		// order by date
		response.data.sort((a, b) => {
			const aDate = a.date.split("-");
			const bDate = b.date.split("-");

			return option.value === "past"
				? new Date(bDate[2], bDate[1] - 1, bDate[0]) - new Date(aDate[2], aDate[1] - 1, aDate[0]) // past
				: new Date(aDate[2], aDate[1] - 1, aDate[0]) - new Date(bDate[2], bDate[1] - 1, bDate[0]); // future
		});

		meetings.value = response.data;
	} else {
		errorMsg.value = response.message;
	}

	fetching.value = false;
});
</script>

<template>
	<div class="col-12 px-0">
		<span
			class="option mx-3"
			:class="{ 'option-selected': option === 'past', 'option-dark': isDark, 'option-light': !isDark }"
			@click="option = 'past'"
		>
			Realizadas
		</span>
		<span
			class="option mx-2"
			:class="{ 'option-selected': option === 'future', 'option-dark': isDark, 'option-light': !isDark }"
			@click="option = 'future'"
		>
			Futuras
		</span>
	</div>
	<div
		class="col-12 meetings custom-scroll-bar shadow p-3 pt-4"
		:class="isDark ? 'meetings-dark custom-scroll-bar-dark' : 'meetings-light custom-scroll-bar-light'"
	>
		<div
			v-if="fetching || errorMsg.length > 0"
			class="col-12 h-100 d-flex justify-content-center align-items-center"
		>
			<b-spinner variant="success" label="Carregando Reuniões"></b-spinner>
			<span class="ml-2" v-if="errorMsg.length > 0">{{ errorMsg }}</span>
		</div>

		<div
			v-else
			v-for="meeting in meetings"
			:key="meeting.id"
			class="col-12 d-flex flex-row mb-4 justify-content-center"
		>
			<span
				class="date px-3 py-1 text-center d-flex justify-content-center align-items-center"
				:class="isDark ? 'date-dark' : 'date-light'"
			>
				{{ meeting.date }}
			</span>
			<button
				class="btn mx-2 action-btn"
				:class="isDark ? 'action-btn-dark' : 'action-btn-light'"
				@click="showDescriptionModal(meeting)"
			>
				Ver Descrição
			</button>
			<button
				v-if="option === 'past'"
				class="btn action-btn"
				:class="isDark ? 'action-btn-dark' : 'action-btn-light'"
				@click="meeting.hasAta ? showAtaModal(meeting) : showAddAtaModal(meeting)"
			>
				{{ meeting.hasAta ? "Ver Ata" : "Adicionar Ata" }}
			</button>
		</div>
	</div>

	<div v-if="meetingSelected">
		<SeeMeetingDescriptionModal
			:show="seeDescriptionModal"
			:date="meetingSelected.date"
			:creator="meetingSelected.creator"
			:room="meetingSelected.room"
			:description="meetingSelected.description"
			@close="seeDescriptionModal = false"
		/>

		<SeeMeetingAtaModal :show="seeAtaModal" :id="meetingSelected.id" @close="seeAtaModal = false" />

		<AddMeetingAtaModal :show="seeAddAtaModal" :id="meetingSelected.id" @close="seeAddAtaModal = false" />
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #ffffff;
$quaternary-color: #3fc380;
$quinary-color: #e4f0e8;
$senary-color: #18516f;

.option {
	font-family: "Panton", sans-serif;
	font-size: 1.5rem;
	font-weight: 500;
	letter-spacing: 0.05rem;
	line-height: 1.5rem;
	opacity: 0.5;
	cursor: pointer;

	&-selected {
		opacity: 1;
	}

	&-dark {
		color: $secondary-color;

		&:hover {
			color: $tertiary-color;
		}
	}

	&-light {
		color: $primary-color;

		&:hover {
			color: $senary-color;
		}
	}
}

.meetings {
	height: 275px;
	border-radius: 15px;
	overflow-x: hidden;
	overflow-y: auto;

	&-dark {
		background-color: $primary-color;
	}

	&-light {
		background-color: $quinary-color;
	}
}

.date {
	font-family: "Panton", sans-serif;
	font-size: 1rem;
	font-weight: 500;
	border-radius: 15px;
	width: 140px;

	&-dark {
		background-color: $secondary-color;
		color: $primary-color;
	}

	&-light {
		background-color: $primary-color;
		color: $tertiary-color;
	}
}

.action-btn {
	font-family: "Panton", sans-serif;
	font-size: 1rem;
	font-weight: 500;
	border-radius: 15px;
	outline: none;
	background-color: transparent;
	width: 138px;

	&-dark {
		color: $secondary-color;
		border: 2px solid $secondary-color;

		&:hover {
			color: $tertiary-color;
			border-color: $tertiary-color;
		}
	}

	&-light {
		color: $primary-color;
		border: 2px solid $primary-color;

		&:hover {
			color: $senary-color;
			border-color: $senary-color;
		}
	}
}

.custom-scroll-bar {
	&::-webkit-scrollbar {
		width: 10px;
	}

	&::-moz-scrollbar {
		width: 10px;
	}

	scrollbar-width: 10px;

	&-dark {
		&::-webkit-scrollbar-track {
			background: $primary-color;
		}

		&::-moz-scrollbar-track {
			background: $primary-color;
		}

		&::-webkit-scrollbar-thumb {
			background: $quaternary-color;
		}

		&::-moz-scrollbar-thumb {
			background: $quaternary-color;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: $secondary-color;
		}

		&::-moz-scrollbar-thumb:hover {
			background: $secondary-color;
		}
	}

	&-light {
		&::-webkit-scrollbar-track {
			background: $quinary-color;
		}

		&::-moz-scrollbar-track {
			background: $quinary-color;
		}

		&::-webkit-scrollbar-thumb {
			background: $quaternary-color;
		}

		&::-moz-scrollbar-thumb {
			background: $quaternary-color;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: $senary-color;
		}

		&::-moz-scrollbar-thumb:hover {
			background: $senary-color;
		}
	}
}
</style>
