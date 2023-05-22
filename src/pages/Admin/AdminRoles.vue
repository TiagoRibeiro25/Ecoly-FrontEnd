<script setup>
import Input from "../../components/Input.vue";
import EditRoleModal from "../../components/Modals/EditRoleModal.vue";
import { useDark } from "@vueuse/core";
import { ref, watchEffect } from "vue";
import { useUsersStore } from "../../stores/users";

const isDark = useDark();
const usersStore = useUsersStore();
/** @type {{id: number, title: string}[]} */
const roles = ref([]);
const roleToEdit = ref(null);
const showEditRoleModal = ref(false);
const isLoaded = ref(false);
const fetchAgain = ref(false);

// Add new role variables
const newRoleTitle = ref("");
const adding = ref(false);
const addError = ref(false);

const openEditRoleModal = (role) => {
	roleToEdit.value = role;
	showEditRoleModal.value = true;
};

const addRole = async () => {
	addError.value = false;

	if (newRoleTitle.value.trim() === "") {
		addError.value = true;
		return;
	}

	adding.value = true;
	const role = newRoleTitle.value.trim().toLowerCase();

	const response = await usersStore.addRole(role);

	if (response.success) {
		fetchAgain.value = !fetchAgain.value;
		newRoleTitle.value = "";
	} else {
		addError.value = true;
	}

	adding.value = false;
};

watchEffect(async () => {
	if (!fetchAgain.value && roles.value.length !== 0) return;

	fetchAgain.value = false;
	roles.value = [];
	isLoaded.value = false;

	const response = await usersStore.getRoles();

	if (response.success) {
		roles.value = response.data
			.filter((role) => role.title !== "unsigned" && role.title !== "admin") // prevent from changing the role of the admin and unsigned
			.map((role) => {
				return { id: role.id, title: role.title.charAt(0).toUpperCase() + role.title.slice(1) };
			});

		isLoaded.value = true;
	}

	fetchAgain.value = false;
});
</script>

<template>
	<div
		v-if="!isLoaded || roles.length === 0"
		class="col-12 d-flex justify-content-center align-items-center h-100"
	>
		<b-spinner v-if="!isLoaded" variant="success" label="Carregando..."></b-spinner>
		<h2 v-else class="error-title text-center" :class="isDark ? 'error-title-dark' : 'error-title-light'">
			Ocorreu um erro ao carregar os cargos.
		</h2>
	</div>

	<div v-else class="row d-flex justify-row h-100 px-0">
		<div class="col-lg-5 col-12 py-2 pl-lg-3 px-3">
			<div
				class="roles w-100 h-100 shadow-sm custom-scroll-bar"
				:class="isDark ? 'roles-dark custom-scroll-bar-dark' : 'roles-light custom-scroll-bar-light'"
			>
				<div
					v-for="role in roles"
					:key="role.id"
					class="text-center role m-4 p-3 shadow-sm"
					:class="isDark ? 'role-dark' : 'role-light'"
					@click="openEditRoleModal(role)"
				>
					{{ role.title }}
				</div>
			</div>
		</div>
		<div class="col-lg-7 col-12 py-2">
			<div class="add-role w-100 h-100 shadow-sm py-3" :class="isDark ? 'add-role-dark' : 'add-role-light'">
				<div class="col-12">
					<h2
						class="add-role-title text-center"
						:class="isDark ? 'add-role-title-dark' : 'add-role-title-light'"
					>
						Adicionar Novo Cargo
					</h2>
				</div>
				<div class="col-12">
					<p
						class="add-role-description text-center"
						:class="isDark ? 'add-role-description-dark' : 'add-role-description-light'"
					>
						Os cargos são utilizados para identificar as funções dos utilizadores no sistema.
						<br />
						Os cargos não podem ser apagados, apenas editados.
					</p>
				</div>
				<div class="col-8 mx-auto mt-5 pt-5">
					<form>
						<Input
							:text="newRoleTitle"
							placeholder="Nome do cargo"
							type="input"
							:isDark="isDark"
							:alignText="true"
							@update:text="newRoleTitle = $event"
						/>

						<div class="d-flex justify-content-center align-items-center" style="height: 210px">
							<b-spinner v-if="adding" variant="success" label="Carregando..."></b-spinner>
							<h2
								v-if="addError"
								class="error-title text-center"
								:class="isDark ? 'error-title-dark' : 'error-title-light'"
							>
								Ocorreu um erro ao adicionar o cargo.
							</h2>
						</div>

						<div class="d-flex justify-content-center align-items-center">
							<button
								type="button"
								class="btn add-role-btn"
								:class="isDark ? 'add-role-btn-dark' : 'add-role-btn-light'"
								@click="addRole"
								:disabled="adding"
							>
								Adicionar Cargo
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

	<EditRoleModal
		type="role"
		:item="roleToEdit"
		:show="showEditRoleModal"
		inputPlaceholder="Novo nome do cargo"
		@close="showEditRoleModal = false"
		@update="fetchAgain = !fetchAgain"
	/>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #ffffff;
$tertiary-color: #18516f;
$quaternary-color: #aedcc0;
$quinary-color: #3fc380;
$senary-color: #333333;
$septenary-color: #e2e1e1;

.error-title {
	font-family: "Panton", sans-serif;
	font-weight: 600;
	font-size: 1.8rem;
	color: $primary-color;

	&-dark {
		color: $quaternary-color;
	}

	&-light {
		color: $primary-color;
	}
}

.roles,
.add-role {
	border-radius: 15px;
	overflow-y: auto;
	max-height: 565px;

	&-light {
		border: 2px solid $primary-color;
	}

	&-dark {
		border: 2px solid $quinary-color;
	}
}

.role {
	font-family: "Panton", sans-serif;
	font-weight: 700;
	font-size: 1.2rem;
	border-radius: 15px;
	cursor: pointer;

	&-dark {
		border: 2px solid $quaternary-color;
		color: $quaternary-color;

		&:hover {
			color: $secondary-color;
			border-color: $secondary-color;
		}
	}

	&-light {
		border: 2px solid $primary-color;
		color: $primary-color;
		background-color: $secondary-color;

		&:hover {
			color: $tertiary-color;
			border-color: $tertiary-color;
		}
	}
}

.add-role-title,
.add-role-description {
	font-family: "Panton", sans-serif;
	font-weight: 700;
	font-size: 2rem;

	&-light {
		color: $primary-color;
	}

	&-dark {
		color: $quaternary-color;
	}
}

.add-role-description {
	font-size: 1.2rem;
}

.add-role-btn {
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
		color: $quaternary-color;

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
		background: $quinary-color;
	}
	&::-moz-scrollbar-thumb {
		background: $quinary-color;
	}

	&.custom-scroll-bar-dark {
		&::-webkit-scrollbar-thumb:hover {
			background: $quaternary-color;
		}
		&::-moz-scrollbar-thumb:hover {
			background: $quaternary-color;
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
