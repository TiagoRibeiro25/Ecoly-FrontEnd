<script setup>
import { useDark } from "@vueuse/core";
import { ref, watchEffect } from "vue";
import { useActivitiesStore } from "../../stores/activities";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";
import DetailImages from "../../components/DetailImages.vue";
import ActivityReportModal from "../../components/Modals/ActivityReportModal.vue";

const isDark = useDark();
const firstYear = 2022;

// get years from firstYear to current year
const years = new Array(new Date().getFullYear() - firstYear + 1)
	.fill(2022)
	.map((year, index) => ({ value: year + index, text: year + index }))
	.sort((a, b) => b.value - a.value);
const currentYear = ref(getLocalStorage("filterActivitiesYear") || years.at(-1).value);

const activities = ref([]);
const activitySelected = ref(null);
const showModal = ref(false);

const fetching = ref(false);
const errorMsg = ref("");

watchEffect(async () => {
	setLocalStorage("filterActivitiesYear", currentYear.value);
	fetching.value = true;
	errorMsg.value = "";

	const activitiesStore = useActivitiesStore();
	const response = await activitiesStore.getFinishedActivitiesByYear(currentYear.value);

	if (response.success) {
		activities.value = response.data;
		activitySelected.value = activities.value[0];
	} else {
		errorMsg.value = "Não foram encontradas atividades para o ano selecionado.";
	}

	fetching.value = false;
});
</script>

<template>
	<div class="col-12 px-0">
		<b-form-select
			class="mt-3 year-select px-4"
			:class="isDark ? 'year-select-dark' : 'year-select-light'"
			v-model="currentYear"
			:options="years"
		></b-form-select>
	</div>
	<div class="col-12 px-0 mt-4">
		<div
			v-if="fetching || errorMsg !== ''"
			class="d-flex justify-content-center align-items-center py-5 mb-5"
		>
			<b-spinner v-if="fetching" variant="success" label="Loading..."></b-spinner>
			<span v-else class="error-msg text-center" :class="isDark ? 'error-msg-dark' : 'error-msg-light'">
				{{ errorMsg }}
			</span>
		</div>
		<div v-else class="col-12 px-0 d-flex flex-xl-row flex-column">
			<div class="col-xl-6 pl-0 pr-xl-3 px-0">
				<div class="mb-xl-0 mb-5" style="max-height: 600px; overflow-y: auto; overflow-x: hidden">
					<div v-for="activity in activities" :key="activity.id">
						<div class="col-12 px-0 mb-4 d-flex flex-row">
							<div class="col-9 pl-0 d-flex flex-column justify-content-center align-items-center">
								<button
									class="btn w-100 activity-btn py-2 text-center"
									:class="isDark ? 'activity-btn-dark' : 'activity-btn-light'"
									:disabled="activity === activitySelected"
									@click="activitySelected = activity"
								>
									{{ activity.title }}
								</button>
							</div>
							<div class="col-3 d-flex flex-column justify-content-center align-items-center">
								<span class="date-title text-center" :class="isDark ? 'date-title-dark' : 'date-title-light'">
									Data de Início
								</span>
								<span class="date-info text-center" :class="isDark ? 'date-info-dark' : 'date-info-light'">
									{{ activity.initial_date }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xl-6 pr-0 pl-xl-3 px-0">
				<div
					class="activity-container shadow px-4 d-flex flex-column"
					:class="isDark ? 'activity-container-dark' : 'activity-container-light'"
				>
					<div class="col-12 flex-column px-0 pt-4">
						<h2 class="activity-title w-100" :class="isDark ? 'activity-title-dark' : 'activity-title-light'">
							{{ activitySelected.title }}
						</h2>
						<span class="theme text-center px-3" :class="isDark ? 'theme-dark' : 'theme-light'">
							{{ activitySelected.theme }}
						</span>
					</div>
					<div class="col-12 px-0 d-flex justify-content-center align-items-center text-center my-4">
						<DetailImages class="images" :images="activitySelected.image" :width="200" :height="150" />
					</div>
					<div class="col-12 d-flex flex-column justify-content-center align-items-center mb-5">
						<button
							type="button"
							class="btn see-report-btn py-1 px-4"
							:class="isDark ? 'see-report-btn-dark' : 'see-report-btn-light'"
							@click="showModal = true"
						>
							Ver Relatório
						</button>
					</div>
					<div class="col-12 px-0 pb-3" :class="isDark ? 'report-info-dark' : 'report-info-light'">
						<div class="col-12 px-0 pb-3">
							<h3>Participantes</h3>
							<p>{{ activitySelected.participants }}</p>
						</div>
						<div class="col-12 px-0 pb-3">
							<h3>Diagnóstico</h3>
							<p>{{ activitySelected.diagnostic }}</p>
						</div>
						<div class="col-12 px-0 pb-3">
							<h3>Objetivos</h3>
							<p>{{ activitySelected.objective }}</p>
						</div>
						<div class="col-12 px-0 pb-3">
							<h3>Metas</h3>
							<p>{{ activitySelected.meta }}</p>
						</div>
						<div class="col-12 px-0 pb-3">
							<h3>Recursos</h3>
							<p>{{ activitySelected.resources }}</p>
						</div>
						<div class="col-12 px-0 pb-3">
							<h3 class="text-center">AVALIAÇÃO</h3>
							<div class="col-12 d-flex flex-row px-0">
								<div class="col-6 pl-0 pr-4">
									<h3 class="text-left">Indicadores</h3>
									<p class="text-left">{{ activitySelected.evaluation_indicator }}</p>
								</div>
								<div class="col-6 pl-4 pr-0">
									<h3 class="text-right">Instrumentos</h3>
									<p class="text-right">{{ activitySelected.evaluation_method }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ActivityReportModal :id="activitySelected.id" :show="showModal" @close="showModal = false" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #ffffff;
$tertiary-color: #18516f;
$fourth-color: #aedcc0;
$quinary-color: #3fc380;
$sixth-color: #e4f0e8;

.year-select {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 400;

	background-color: transparent;
	outline: transparent;
	border: 2px solid $quinary-color;
	border-radius: 0.6rem;
	width: auto;

	&-dark {
		color: $fourth-color;

		&:focus {
			border: 2px solid $secondary-color;
			outline: transparent;
			box-shadow: none;
			color: $secondary-color;
			background-color: $primary-color;
		}
	}

	&-light {
		color: $primary-color;

		&:focus {
			border: 2px solid $tertiary-color;
			outline: transparent;
			box-shadow: none;
		}
	}
}

.error-msg {
	font-family: "Panton", sans-serif;
	font-size: 1.4rem;
	font-weight: 400;

	&-dark {
		color: $fourth-color;
	}

	&-light {
		color: $primary-color;
	}
}

.activity-btn {
	font-family: "Panton", sans-serif;
	font-size: 1.15rem;
	font-weight: 400;
	background-color: transparent;
	border: 2px solid $quinary-color;
	border-radius: 0.6rem;
	cursor: pointer;

	&:focus {
		outline: transparent;
		box-shadow: none;
	}

	&-dark {
		color: $fourth-color;

		&:hover {
			border-color: $secondary-color;
			color: $secondary-color;
		}

		&:disabled {
			border-color: $secondary-color;
			color: $secondary-color;
			opacity: 1;
		}
	}

	&-light {
		color: $primary-color;

		&:hover {
			border-color: $tertiary-color;
			color: $tertiary-color;
		}

		&:disabled {
			color: $tertiary-color;
			border-color: $tertiary-color;
			opacity: 1;
		}
	}
}

.date-title,
.date-info {
	font-family: "Panton", sans-serif;
	font-size: 1.15rem;
	font-weight: 600;
	line-height: 1.2;

	&-dark {
		color: $fourth-color;
	}

	&-light {
		color: $primary-color;
	}
}

.date-info {
	font-size: 1.05rem;
	font-weight: 400;
}

.activity-container {
	min-height: 600px;
	border-radius: 0.8rem;

	&-dark {
		background-color: $primary-color;
	}

	&-light {
		background-color: $sixth-color;
	}
}

.activity-title {
	font-family: "Panton", sans-serif;
	font-size: 1.6rem;
	font-weight: 600;

	&-dark {
		color: $fourth-color;
	}

	&-light {
		color: $primary-color;
	}
}

.theme {
	font-family: "Panton", sans-serif;
	font-weight: 600;
	font-size: 1.1rem;
	border-radius: 10px;
	padding-top: 0.15rem;
	padding-bottom: 0.15rem;

	&-dark {
		color: $primary-color;
		background-color: $fourth-color;
	}

	&-light {
		color: $secondary-color;
		background-color: $primary-color;
	}
}

.see-report-btn {
	border-radius: 0.6rem;
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 600;

	&-dark {
		background-color: $fourth-color;
		color: $primary-color;

		&:hover {
			background-color: $secondary-color;
		}
	}

	&-light {
		background-color: $primary-color;
		color: $secondary-color;

		&:hover {
			background-color: $tertiary-color;
		}
	}
}

.report-info {
	&-dark {
		color: $fourth-color;

		p {
			color: $secondary-color;
		}
	}

	&-light {
		color: $primary-color;
	}
}

h3,
p {
	font-family: "Panton", sans-serif;
	font-size: 1.4rem;
	font-weight: 600;
	line-height: 1.2;
}

p {
	font-size: 1.1rem;
	font-weight: 400;
}
</style>
