<script setup>
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

const openEditRoleModal = (role) => {
	roleToEdit.value = role;
	showEditRoleModal.value = true;
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
		<h2 v-else class="error-title" :class="isDark ? 'error-title-dark' : 'error-title-light'">
			Ocorreu um erro ao carregar os cargos.
		</h2>
	</div>

	<div v-else class="col-12 d-flex justify-row h-100 px-0">
		<div class="col-5 px-2 py-3">
			<div class="roles w-100 h-100 shadow-sm" :class="isDark ? 'roles-dark' : 'roles-light'">
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
		<div class="col-7"></div>
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

.roles {
	border-radius: 15px;
	overflow-y: auto;

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
</style>
