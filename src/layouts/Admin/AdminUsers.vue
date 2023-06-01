<script setup>
import { useDark } from "@vueuse/core";
import { useUsersStore } from "../../stores/users";
import { computed, ref, watchEffect } from "vue";
import Input from "../../components/Input.vue";

const isDark = useDark();
const usersStore = useUsersStore();
const users = ref([]);
const roles = ref([]);
const tableRoles = ref([]);
const isLoaded = ref(false);
const fetchAgain = ref(false);

const filterName = ref("");
const filterEmail = ref("");
const filterRole = ref("Filtrar por cargo");

const filteredUsers = computed(() => {
	return users.value.filter((user) => {
		if (filterName.value !== "" && !user.name.toLowerCase().includes(filterName.value.toLowerCase()))
			return false;
		if (filterEmail.value !== "" && !user.email.toLowerCase().includes(filterEmail.value.toLowerCase()))
			return false;
		return !(filterRole.value !== "Filtrar por cargo" && user.role !== filterRole.value);
	});
});

const changeUserRole = async (userId, role) => {
	const roleId = roles.value.find((r) => r.title === role).id;

	const response = await usersStore.changeUserRole(userId, { id: roleId, title: role });

	if (!response.success) {
		fetchAgain.value = true;
		return;
	}

	const user = users.value.find((u) => u.id === userId);
	user.role = role;
};

watchEffect(async () => {
	if (!fetchAgain.value && users.value.length !== 0) return;

	fetchAgain.value = false;
	users.value = [];
	isLoaded.value = false;

	const response = await Promise.all([usersStore.getUsers(), usersStore.getRoles()]);

	if (!response[0].success || !response[1].success) {
		isLoaded.value = true;
		return;
	}

	users.value = response[0].data;
	tableRoles.value = response[1].data;
	roles.value = [
		{ id: 0, title: "Filtrar por cargo" },
		...response[1].data.map((role) => {
			return { id: role.id, title: role.title };
		}),
	];

	isLoaded.value = true;
});
</script>

<template>
	<div
		v-if="!isLoaded || users.length === 0 || roles.length === 0"
		class="d-flex justify-content-center align-items-center h-100"
	>
		<b-spinner v-if="!isLoaded" variant="success" label="Carregando..."></b-spinner>
		<h2 v-else class="error-title" :class="isDark ? 'error-title-dark' : 'error-title-light'">
			Ocorreu um erro ao carregar os {{ users.length === 0 ? "utilizadores" : "cargos" }}.
		</h2>
	</div>
	<div v-else>
		<!-- filter Users -->
		<header class="col-12 px-0 mt-3 d-flex flex-row">
			<div class="col-4 px-1">
				<Input
					:text="filterName"
					placeholder="Filtrar por nome"
					type="input"
					:isDark="isDark"
					@update:text="filterName = $event"
				/>
			</div>
			<div class="col-4 px-1">
				<Input
					:text="filterEmail"
					placeholder="Filtrar por email"
					type="input"
					:isDark="isDark"
					@update:text="filterEmail = $event"
				/>
			</div>
			<!-- filter by role -->
			<div class="col-4 px-1 d-flex justify-content-end align-items-center">
				<b-dropdown :text="filterRole" :variant="isDark ? 'dark' : 'light'" class="ml-2">
					<b-dropdown-item v-for="role in roles" :key="role.id" @click="filterRole = role.title">
						{{ role.title }}
					</b-dropdown-item>
				</b-dropdown>
			</div>
		</header>
		<main>
			<div class="col-12 px-0 mt-3">
				<table
					class="table table-hover table-striped table-responsive-sm"
					:class="isDark ? 'table-dark-theme' : 'table-light-theme'"
				>
					<caption class="text-center">
						Lista atualizada em
						{{
							new Date().toLocaleString("pt-PT")
						}}
					</caption>
					<thead>
						<tr class="text-center align-middle" style="font-size: 1.45rem">
							<th scope="col" :class="isDark ? 'table-dark-theme' : 'table-light-theme'">Nome</th>
							<th scope="col" :class="isDark ? 'table-dark-theme' : 'table-light-theme'">Email</th>
							<th scope="col" :class="isDark ? 'table-dark-theme' : 'table-light-theme'">Cargo</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="user in filteredUsers"
							:key="user.id"
							:id="user.id"
							:class="isDark ? 'table-dark-theme' : 'table-light-theme'"
						>
							<td class="text-center align-middle" :class="isDark ? 'table-dark-theme' : 'table-light-theme'">
								{{ user.name }}
							</td>
							<td class="text-center align-middle" :class="isDark ? 'table-dark-theme' : 'table-light-theme'">
								{{ user.email }}
							</td>
							<td class="text-center align-middle" :class="isDark ? 'table-dark-theme' : 'table-light-theme'">
								<b-form-select
									class="select-user-role-input col-12 text-center"
									:class="isDark ? 'table-dark-theme' : 'table-light-theme'"
									v-model="user.role"
									@change="changeUserRole(user.id, $event)"
								>
									<option v-for="role in tableRoles" :value="role.title" :key="role.id">
										{{ role.title }}
									</option>
								</b-form-select>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</main>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #ffffff;
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

.table {
	cursor: default;
	animation: showFromBottom 0.5s ease-in-out;

	&-dark-theme {
		background-color: $primary-color;
		color: $quaternary-color;

		thead th {
			background-color: $senary-color;
			color: $secondary-color;
		}

		& th,
		td {
			border: 2px solid rgba(63, 195, 128, 0.1);
		}
	}

	&-light-theme {
		background-color: $secondary-color;
		color: $primary-color;

		thead th {
			background-color: $septenary-color;
		}

		& th,
		td {
			border: 2px solid $primary-color;
		}
	}
}

tr {
	font-family: "Panton", sans-serif;
	font-weight: 700;
	font-size: 1.25rem;
}

.select-user-role-input {
	background-color: $primary-color;
	color: $secondary-color;
	border: 2px solid transparent;
	font-family: "Panton", sans-serif;
	font-weight: 700;
	font-size: 1.25rem;
	padding: 0 10px;
	cursor: pointer;
	transition: all 0.3s ease-in-out;

	&.table-dark-theme {
		background-color: $primary-color;
		color: $quaternary-color;
		border: 2px solid transparent;

		&:focus {
			border: 2px solid $quinary-color;
			outline: none;
			box-shadow: none;
		}
	}

	&.table-light-theme {
		background-color: $secondary-color;
		color: $primary-color;
		border: 2px solid transparent;

		&:focus {
			border: 2px solid $quinary-color;
			outline: none;
			box-shadow: none;
		}
	}
}

caption {
	color: $primary-color;
	font-family: "Panton", sans-serif;
	font-weight: 700;
	font-size: 17px;
}

@keyframes showFromBottom {
	0% {
		opacity: 0;
		transform: translateY(100%);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
