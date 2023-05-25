<script setup>
import SearchBar from "../../components/SearchBar.vue";
import Header from "../../components/Header.vue";
import ChangeViewButton from "../../components/ChangeViewButton.vue";
import { useDark } from "@vueuse/core";
import { ref, watch, watchEffect } from "vue";
import { useSchoolsStore } from "@/stores/schools";
import { useActivitiesStore } from "@/stores/activities";
import ActivityCard from "./ActivityCard.vue";
import DeleteModal from "../../components/Modals/DeleteModal.vue";
import FinishActivityModal from "../../components/Modals/FinishActivityModal.vue";
import { getLocalStorage, setLocalStorage } from "@/utils/localStorage";

const isDark = useDark();
const fetching = ref(false);
const activities = ref([]);
const schools = ref([{ value: "all", text: "Todas as escolas" }]);
// const schoolSelected = ref("all");
const schoolSelected = ref(+getLocalStorage("filterActivitiesSchool") || "all");
const isUserVerified = ref(false);

const fetchAgain = ref(false);

// delete modal variables
const showDeleteModal = ref(false);
const idToDelete = ref(null);

const showDelModal = (id) => {
	idToDelete.value = id;
	showDeleteModal.value = true;
};

// finish modal variables
const showFinishModal = ref(false);
const idToFinish = ref(null);

const showFinModal = (id) => {
	idToFinish.value = id;
	showFinishModal.value = true;
};

watch(schoolSelected, () => {
	setLocalStorage("filterActivitiesSchool", schoolSelected.value);
	fetchAgain.value = !fetchAgain.value;
});

watchEffect(async () => {
	if (!fetchAgain.value && activities.value.length !== 0) return;

	fetchAgain.value = false;
	fetching.value = true;
	activities.value = [];
	schools.value = [{ value: "all", text: "Todas as escolas" }];
	isUserVerified.value = false;

	const schoolsStore = useSchoolsStore();
	const schoolsResponse = await schoolsStore.getSchools();

	if (schoolsResponse.success) {
		schools.value = schools.value.concat(
			schoolsResponse.data.map((school) => {
				return { value: school.id, text: school.name };
			})
		);
	}

	const activitiesStore = useActivitiesStore();
	let activitiesResponse;

	// Get all activities
	if (schoolSelected.value === "all") {
		activitiesResponse = await activitiesStore.getAllUnfinishedActivities();
	}
	// Get activities from a specific school
	else {
		const schoolName = schools.value.find((school) => school.value === schoolSelected.value)?.text;
		if (!schoolName) {
			fetching.value = false;
			return;
		}
		activitiesResponse = await activitiesStore.getUnfinishedActivitiesFromSchool(schoolName);
	}

	if (activitiesResponse.success) {
		activities.value = activitiesResponse.data;
		isUserVerified.value = activitiesResponse.isUserVerified;
	}

	fetching.value = false;
});
</script>

<template>
	<div class="col-12 d-flex align-items-center mt-5">
		<SearchBar page="Activities" placeholder="Pesquise por atividades" />
	</div>
	<div class="col-12">
		<Header title="ATIVIDADES" />
	</div>
	<div class="col-12 mb-4">
		<div class="activities-container px-5 mx-auto d-flex flex-row">
			<div v-if="isUserVerified" class="col-6 px-0 d-flex align-items-end">
				<ChangeViewButton text="Adicionar atividade" to="ActivityCreate" iconImg="../assets/icons/add.svg" />
			</div>
			<div class="d-flex justify-content-end px-0" :class="isUserVerified ? 'col-6' : 'col-12'">
				<b-form-select
					class="mt-3 school-select"
					:class="isDark ? 'school-dark-mode' : 'school-light-mode'"
					v-model="schoolSelected"
					:options="schools"
				></b-form-select>
			</div>
		</div>
	</div>
	<div class="col-12 mt-5"></div>

	<!-- Activities -->
	<div class="col-12">
		<div class="activities-container px-5 mx-auto">
			<div
				v-if="fetching || activities.length === 0"
				class="d-flex flex-column align-items-center justify-content-center"
				style="height: 45vh"
			>
				<b-spinner v-if="fetching" variant="success" label="Carregando..."></b-spinner>
				<span v-else class="error-msg" :class="isDark ? 'error-msg-dark' : 'error-msg-light'">
					Nenhuma atividade encontrada
				</span>
			</div>

			<div v-else>
				<ActivityCard
					v-for="(activity, index) in activities"
					:key="activity.id"
					:index="index"
					:id="activity.id"
					:title="activity.title"
					:description="activity.description"
					:initialDate="activity.initial_date"
					:finalDate="activity.final_date"
					:theme="activity.theme"
					:image="activity.image"
					:canUserEdit="activity.canUserEdit"
					@delete="showDelModal"
					@finish="showFinModal"
				/>
			</div>
		</div>
	</div>

	<DeleteModal
		:id="idToDelete"
		type="activity"
		text="esta atividade"
		:show="showDeleteModal"
		@close="showDeleteModal = false"
		@delete="() => (fetchAgain = true)"
	/>

	<FinishActivityModal
		:id="idToFinish"
		:show="showFinishModal"
		@close="showFinishModal = false"
		@update="() => (fetchAgain = true)"
	/>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #ffffff;
$quaternary-color: #3fc380;
$quinary-color: #18516f;

.activities-container {
	max-width: 1400px;
}

.error-msg {
	font-family: "Panton", sans-serif;
	font-weight: 700;
	font-size: 1.7rem;
}

.error-msg-dark {
	color: $secondary-color;
}

.error-msg-light {
	color: $primary-color;
}

.school-select {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 400;

	background-color: transparent;
	outline: transparent;
	border: 2px solid $quaternary-color;
	border-radius: 0.6rem;
	width: auto;
}

.school-dark-mode {
	color: $secondary-color;

	&:focus {
		border: 2px solid $tertiary-color;
		outline: transparent;
		box-shadow: none;
		color: $tertiary-color;
		background-color: $primary-color;
	}
}

.school-light-mode {
	color: $primary-color;

	&:focus {
		border: 2px solid $quinary-color;
		outline: transparent;
		box-shadow: none;
	}
}
</style>
