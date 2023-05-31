<script setup>
import Header from "../../components/Header.vue";
import AdminUsers from "../../layouts/Admin/AdminUsers.vue";
import AdminSchools from "../../layouts/Admin/AdminSchools.vue";
import { useDark } from "@vueuse/core";
import { useUsersStore } from "../../stores/users";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import AdminRoles from "../../layouts/Admin/AdminRoles.vue";

const isDark = useDark();
const router = useRouter();
const isLoaded = ref(false);
const selectedTab = ref("users");

onBeforeMount(async () => {
	const usersStore = useUsersStore();
	const response = await usersStore.getLoggedInUser();

	if (!response.success || response.data.role !== "admin") {
		await router.push({ name: "NotFound" });
		return;
	}

	isLoaded.value = true;
});
</script>

<template>
	<div v-if="!isLoaded" class="d-flex justify-content-center align-items-center" style="height: 100vh">
		<b-spinner variant="success" label="Carregando..."></b-spinner>
	</div>

	<div v-else>
		<div class="col-12 mt-5">
			<Header title="ÁREA DE ADMINISTRADOR" />
		</div>
		<div class="col-12 mb-4">
			<div class="mx-auto px-5" style="max-width: 1403px">
				<div class="col-12 mt-5 px-0 d-flex flex-wrap">
					<button
						class="btn tab pr-4 pl-0"
						:class="{
							'tab-selected': selectedTab === 'users',
							'tab-dark': isDark,
							'tab-light': !isDark,
						}"
						@click="selectedTab = 'users'"
					>
						Utilizadores
					</button>
					<button
						class="btn tab pr-4 pl-0"
						:class="{
							'tab-selected': selectedTab === 'roles',
							'tab-dark': isDark,
							'tab-light': !isDark,
						}"
						@click="selectedTab = 'roles'"
					>
						Cargos
					</button>
					<button
						class="btn tab pr-4 pl-0"
						:class="{
							'tab-selected': selectedTab === 'schools',
							'tab-dark': isDark,
							'tab-light': !isDark,
						}"
						@click="selectedTab = 'schools'"
					>
						Escolas
					</button>
				</div>
				<div
					class="admin-container col-12 px-3 py-2 shadow custom-scroll-bar"
					:class="
						isDark
							? 'admin-container-dark custom-scroll-bar-dark'
							: 'admin-container-light custom-scroll-bar-light'
					"
				>
					<AdminUsers v-if="selectedTab === 'users'" />
					<AdminRoles v-else-if="selectedTab === 'roles'" />
					<AdminSchools v-else-if="selectedTab === 'schools'" />
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #ffffff;
$quaternary-color: #18516f;
$fifth-color: #3fc380;
$sixth-color: #e4f0e8;

.tab {
	font-family: "Panton", sans-serif;
	font-weight: bold;
	font-size: 1.5rem;
	text-transform: uppercase;
	color: $primary-color;
	background-color: transparent;
	border: none;
	opacity: 0.5;

	&:focus {
		outline: none !important;
		box-shadow: none !important;
	}

	&-dark {
		color: $secondary-color;

		&:hover {
			color: $tertiary-color;
			opacity: 1;
		}
	}

	&-light {
		color: $primary-color;

		&:hover {
			color: $quaternary-color;
			opacity: 1;
		}
	}
}

.tab-selected {
	opacity: 1;
}

.admin-container {
	overflow-y: auto;
	border-radius: 15px;
	height: 600px;

	&-dark {
		background-color: $primary-color;
		color: $tertiary-color;
	}

	&-light {
		background-color: $sixth-color;
		color: $primary-color;
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
		background: $fifth-color;
	}
	&::-moz-scrollbar-thumb {
		background: $fifth-color;
	}

	&.custom-scroll-bar-dark {
		&::-webkit-scrollbar-thumb:hover {
			background: $secondary-color;
		}
		&::-moz-scrollbar-thumb:hover {
			background: $secondary-color;
		}
	}

	&.custom-scroll-bar-light {
		&::-webkit-scrollbar-thumb:hover {
			background: $quaternary-color;
		}
		&::-moz-scrollbar-thumb:hover {
			background: $quaternary-color;
		}
	}
}
</style>
