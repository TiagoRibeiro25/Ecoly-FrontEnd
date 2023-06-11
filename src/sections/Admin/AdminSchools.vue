<script setup>
import Input from "../../components/Input.vue";
import EditModal from "../../components/Modals/EditModal.vue";
import { useDark } from "@vueuse/core";
import { useSchoolsStore } from "../../stores/schools";
import { ref, watchEffect } from "vue";

const isDark = useDark();
const schoolsStore = useSchoolsStore();
/** @type {{id: number, name: string}[]} */
const schools = ref([]);
const schoolToEdit = ref(null);
const showEditSchoolModal = ref(false);
const isLoaded = ref(false);
const fetchAgain = ref(false);

// Add new school variables
const newSchoolName = ref("");
const adding = ref(false);
const addError = ref(false);

const openEditSchoolModal = (school) => {
	schoolToEdit.value = school;
	showEditSchoolModal.value = true;
};

const addSchool = async () => {
	addError.value = false;

	if (newSchoolName.value.trim() === "") {
		addError.value = true;
		return;
	}

	adding.value = true;
	const school = newSchoolName.value.trim();

	const response = await schoolsStore.addSchool(school);

	if (response.success) {
		fetchAgain.value = !fetchAgain.value;
		newSchoolName.value = "";
	} else {
		addError.value = true;
	}

	adding.value = false;
};

watchEffect(async () => {
	if (!fetchAgain.value && schools.value.length !== 0) return;

	fetchAgain.value = false;
	schools.value = [];
	isLoaded.value = false;

	const response = await schoolsStore.getSchools();

	if (response.success) schools.value = response.data;

	isLoaded.value = true;
});
</script>

<template>
	<div class="row h-100 px-0">
		<div v-if="!isLoaded || schools.length === 0" class="col-lg-5 col-12 py-2 pl-lg-3 px-3 h-100">
			<div
				class="schools w-100 h-100 shadow-sm d-flex justify-content-center align-items-center"
				:class="isDark ? 'schools-dark' : 'schools-light'"
			>
				<b-spinner v-if="!isLoaded" variant="success" label="Carregando..."></b-spinner>
				<h2 v-else class="error-title text-center" :class="isDark ? 'error-title-dark' : 'error-title-light'">
					Ocorreu um erro ao carregar as escolas
				</h2>
			</div>
		</div>

		<div v-else class="col-lg-5 col-12 py-2 pl-lg-3 px-3">
			<div
				class="schools w-100 h-100 shadow-sm custom-scroll-bar"
				:class="isDark ? 'schools-dark custom-scroll-bar-dark' : 'schools-light custom-scroll-bar-light'"
			>
				<div
					v-for="school in schools"
					:key="school.id"
					class="text-center school m-4 p-3 shadow-sm"
					:class="isDark ? 'school-dark' : 'school-light'"
					@click="openEditSchoolModal(school)"
				>
					{{ school.name }}
				</div>
			</div>
		</div>
		<div class="col-lg-7 col-12 py-2">
			<div
				class="add-school w-100 h-100 shadow-sm py-3"
				:class="isDark ? 'add-school-dark' : 'add-school-light'"
			>
				<div class="col-12">
					<h2
						class="add-school-title text-center"
						:class="isDark ? 'add-school-title-dark' : 'add-school-title-light'"
					>
						Adicionar Nova Escola
					</h2>
				</div>
				<div class="col-12">
					<p
						class="add-school-description text-center"
						:class="isDark ? 'add-school-description-dark' : 'add-school-description-light'"
					>
						As escolas são usadas para organizar os membros do conselho.
						<br />
						As escolas não podem ser apagados, apenas editadas.
					</p>
				</div>
				<div class="col-8 mx-auto mt-5 pt-5">
					<form>
						<Input
							:text="newSchoolName"
							placeholder="Nome da escola"
							type="input"
							:isDark="isDark"
							:alignText="true"
							@update:text="newSchoolName = $event"
						/>

						<div class="d-flex justify-content-center align-items-center" style="height: 210px">
							<b-spinner v-if="adding" variant="success" label="Carregando..."></b-spinner>
							<h2
								v-if="addError"
								class="error-title text-center"
								:class="isDark ? 'error-title-dark' : 'error-title-light'"
							>
								Ocorreu um erro ao adicionar o escola.
							</h2>
						</div>

						<div class="d-flex justify-content-center align-items-center">
							<button
								type="button"
								class="btn add-school-btn"
								:class="isDark ? 'add-school-btn-dark' : 'add-school-btn-light'"
								@click="addSchool"
								:disabled="adding"
							>
								Adicionar Escola
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

	<EditModal
		type="school"
		:item="schoolToEdit"
		:show="showEditSchoolModal"
		inputPlaceholder="Novo nome da escola"
		@close="showEditSchoolModal = false"
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
.schools {
	max-height: 565px;
}

.schools,
.add-school {
	border-radius: 15px;
	overflow-y: auto;

	&-light {
		border: 2px solid $primary-color;
	}

	&-dark {
		border: 2px solid $quinary-color;
	}
}

.school {
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

.add-school-title,
.add-school-description {
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

.add-school-description {
	font-size: 1.2rem;
}

.add-school-btn {
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

@media (max-width: 992px) {
	.schools {
		max-height: 400px;
	}
}
</style>
