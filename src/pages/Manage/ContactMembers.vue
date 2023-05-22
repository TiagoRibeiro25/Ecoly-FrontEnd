<script setup>
import { useDark } from "@vueuse/core";
import { onBeforeMount, ref } from "vue";
import { useUsersStore } from "../../stores/users";
import AddInput from "../../components/AddInput.vue";

const isDark = useDark();
const fetching = ref(true);
const fetchingMsg = ref("");

const options = ref([{ value: "all", text: "Todos os membros do conselho" }]);
const selected = ref("all");
const content = ref("");

const sending = ref(false);
const sendingMsg = ref("");

const contact = async () => {
	sending.value = true;
	sendingMsg.value = "";

	const users =
		selected.value === "all"
			? options.value.slice(1)
			: [options.value.find((o) => o.value === selected.value)];

	const destination = users.map((user) => {
		const name = user.text.split(" - ")[0];
		const email = user.text.split(" - ")[1];
		return { name, email };
	});

	const usersStore = useUsersStore();

	const response = await usersStore.contact(destination, content.value);

	if (!response.success) {
		sendingMsg.value = response.message;
		sending.value = false;
		return;
	}

	sending.value = false;
	sendingMsg.value = "Mensagem enviada com sucesso!";

	setTimeout(() => {
		sendingMsg.value = "";
	}, 3000);
};

onBeforeMount(async () => {
	fetching.value = true;
	fetchingMsg.value = "";
	const usersStore = useUsersStore();

	// Get users from school
	const usersResponse = await usersStore.getUsersFromSchool();
	if (!usersResponse.success) {
		fetchingMsg.value = usersResponse.message;
		fetching.value = false;
		return;
	}

	// Sort users by role and name
	const sortedUsers = usersResponse.data.slice().sort((a, b) => {
		const roleComparison = a.role.localeCompare(b.role);
		if (roleComparison !== 0) return roleComparison;
		return a.name.localeCompare(b.name);
	});

	for (const user of sortedUsers) {
		options.value.push({ value: user.id, text: `${user.name} - ${user.email} - ${user.role}` });
	}

	fetching.value = false;
});
</script>

<template>
	<div
		v-if="fetching || fetchingMsg !== ''"
		class="d-flex justify-content-center align-items-center flex-column"
	>
		<b-spinner variant="success" label="Carregando..."></b-spinner>
		<h2 class="error-title mt-3" :class="isDark ? 'error-title-dark' : 'error-title-light'">
			{{ fetchingMsg }}
		</h2>
	</div>

	<div v-else class="col-12 mt-4 px-0">
		<div class="col-12 px-0">
			<b-form-select
				class="mt-3 destination-select"
				:class="isDark ? 'destination-dark-mode' : 'destination-light-mode'"
				v-model="selected"
				:options="options"
			></b-form-select>
		</div>
		<div class="col-12 mt-3 px-0">
			<AddInput
				:text="content"
				placeholder="Conteúdo da mensagem (mínimo 100 caracteres)"
				type="textarea"
				:isDark="isDark"
				@update:text="content = $event"
			/>
		</div>

		<div class="col-12 my-3 d-flex justify-content-end px-0">
			<div
				class="d-flex justify-content-center align-items-center flex-column"
				style="width: 250px"
				v-if="sending || sendingMsg !== ''"
			>
				<b-spinner v-if="sending" variant="success" label="Enviando..."></b-spinner>
				<span class="send-msg mt-1 text-center" :class="isDark ? 'send-msg-dark' : 'send-msg-light'">
					{{ sendingMsg }}
				</span>
			</div>
		</div>

		<div class="col-12 d-flex justify-content-end px-0">
			<button
				class="btn contact-btn"
				:class="isDark ? 'contact-btn-dark' : 'contact-btn-light'"
				:disabled="content.trim().length < 100 || sending || sendingMsg === 'Mensagem enviada com sucesso!'"
				@click="contact"
			>
				Enviar
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #ffffff;
$tertiary-color: #18516f;
$fourth-color: #aedcc0;
$quinary-color: #3fc380;

.error-title {
	font-family: "Panton", sans-serif;
	font-weight: 600;
	font-size: 1.5rem;
	color: $primary-color;

	&-dark {
		color: $fourth-color;
	}

	&-light {
		color: $primary-color;
	}
}

.destination-select {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 400;

	background-color: transparent;
	outline: transparent;
	border: 2px solid $quinary-color;
	border-radius: 0.6rem;
	width: auto;
}

.destination-dark-mode {
	color: $fourth-color;

	&:focus {
		border: 2px solid $secondary-color;
		outline: transparent;
		box-shadow: none;
		color: $secondary-color;
		background-color: $primary-color;
	}
}

.destination-light-mode {
	color: $primary-color;

	&:focus {
		border: 2px solid $tertiary-color;
		outline: transparent;
		box-shadow: none;
	}
}

.contact-btn {
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

.send-msg {
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
