<script setup>
import DateInput from "../../components/DateInput.vue";
import TimeInput from "../../components/TimeInput.vue";
import Input from "../../components/Input.vue";
import { ref } from "vue";
import { useDark } from "@vueuse/core";
import { useMeetingsStore } from "@/stores/meetings";

const emits = ["update:showMeetings"];

const isDark = useDark();
const date = ref("");
const time = ref("");
const room = ref("");
const content = ref("");
const creating = ref(false);
const creatingMsg = ref("");

const createMeeting = async () => {
	creating.value = true;
	creatingMsg.value = "";

	const data = {
		date: `${date.value} ${time.value}`,
		description: content.value,
		room: room.value,
	};

	const meetingsStore = useMeetingsStore();
	const response = await meetingsStore.createMeeting(data);

	if (response.success) {
		creatingMsg.value = "Reunião criada com sucesso!";
		emits("update:showMeetings");
	} else {
		creatingMsg.value = "Erro ao criar reunião!";
	}

	creating.value = false;
};
</script>

<template>
	<div class="col-12 d-flex flex-row mt-3 px-0">
		<div class="col-7 px-0">
			<DateInput
				class="pr-xl-0 pl-xl-3 px-0"
				:date="date"
				placeholder="data da reunião"
				:minDate="new Date().toISOString().slice(0, 10)"
				:maxDate="new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10)"
				@update:date="date = $event"
			/>
		</div>
		<div class="col-3 px-0">
			<TimeInput class="px-3" :time="time" placeholder="..." @update:time="time = $event" />
		</div>
		<div class="col-2 px-0">
			<Input
				:text="room"
				placeholder="sala"
				type="input"
				:isDark="isDark"
				:alignText="true"
				@update:text="room = $event"
			/>
		</div>
	</div>

	<div class="col-12 pr-xl-0 pl-xl-3 px-0 mt-3">
		<Input
			:text="content"
			placeholder="Descrição da reunião"
			type="textarea"
			:isDark="isDark"
			@update:text="content = $event"
		/>
	</div>

	<div class="col-12 d-flex align-items-end flex-column px-0">
		<div class="col-12 my-3 d-flex justify-content-end px-0">
			<div
				class="d-flex justify-content-center align-items-center flex-column"
				style="width: 250px"
				v-if="creating || creatingMsg !== ''"
			>
				<b-spinner v-if="creating" variant="success" label="Enviando..."></b-spinner>
				<span
					class="creating-msg mt-1 text-center"
					:class="isDark ? 'creating-msg-dark' : 'creating-msg-light'"
				>
					{{ creatingMsg }}
				</span>
			</div>
		</div>

		<button
			class="btn create-meeting-btn"
			:class="isDark ? 'create-meeting-btn-dark' : 'create-meeting-btn-light'"
			:disabled="creating || !date || !time || !room || content.trim().length < 10"
			@click="createMeeting"
		>
			Criar Reunião
		</button>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #ffffff;
$tertiary-color: #18516f;
$fourth-color: #aedcc0;
$quinary-color: #3fc380;

.create-meeting-btn {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 400;

	background-color: transparent;
	outline: transparent;
	border: 2px solid $quinary-color;
	border-radius: 0.6rem;
	width: 250px;
	cursor: pointer;

	&:disabled {
		cursor: not-allowed;
	}

	&-dark {
		color: $fourth-color;

		&:hover {
			border-color: $secondary-color;
			color: $secondary-color;
		}
	}

	&-light {
		color: $primary-color;

		&:hover {
			border-color: $tertiary-color;
			color: $tertiary-color;
		}
	}
}

.creating-msg {
	font-family: "Panton", sans-serif;
	font-weight: 600;
	font-size: 1.1rem;
	color: $primary-color;

	&-dark {
		color: $fourth-color;
	}

	&-light {
		color: $primary-color;
	}
}
</style>
