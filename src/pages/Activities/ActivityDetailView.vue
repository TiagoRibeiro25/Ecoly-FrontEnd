<script setup>
import { useRoute, useRouter } from "vue-router";
import { useDark } from "@vueuse/core";
import { useActivitiesStore } from "@/stores/activities";
import { onBeforeMount, ref } from "vue";
import DetailImages from "@/components/DetailImages.vue";
import ComplexityInput from "@/components/ComplexityInput.vue";
import DeleteModal from "../../components/Modals/DeleteModal.vue";
import FinishActivityModal from "../../components/Modals/FinishActivityModal.vue";
import Plant from "@/assets/images/activityDetail-illustration.webp";
import ActivityDetailContent from "../../sections/Activities/ActivityDetailContent.vue";

const isDark = useDark();
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const activity = ref(null);
const isLoaded = ref(false);
const canUserEdit = ref(false);

// delete modal variables
const showDeleteModal = ref(false);

// finish modal variables
const showFinishModal = ref(false);

const leavePage = () => router.push({ name: "Activities" });

onBeforeMount(async () => {
	isLoaded.value = false;

	const activitiesStore = useActivitiesStore();
	const response = await activitiesStore.getActivity(id);

	if (!response.success) {
		await router.push({ name: "NotFound" });
		return;
	}

	activity.value = response.data;
	canUserEdit.value = response.canUserEdit;
	isLoaded.value = true;
});
</script>

<template>
	<div v-if="!isLoaded" class="d-flex justify-content-center align-items-center" style="height: 100vh">
		<b-spinner variant="success" label="Carregando..."></b-spinner>
	</div>

	<div v-else class="mt-3 mx-auto" style="max-width: 1400px">
		<DetailImages :images="activity.images" />

		<div class="mt-4 px-md-3">
			<header class="d-flex flex-md-row flex-column">
				<div class="col-md-9">
					<h1 class="activity-title" :class="isDark ? 'activity-title-dark' : 'activity-title-light'">
						{{ activity.title }}
					</h1>
					<div class="col-12 px-0 d-flex flex-row align-items-center">
						<span class="theme px-4 text-center">
							{{ activity.theme }}
						</span>
						<span class="dates px-3 text-center" :class="isDark ? 'dates-dark' : 'dates-light'">
							{{ activity.initial_date }} 🌳 {{ activity.final_date }}
						</span>
					</div>
				</div>
				<div class="col-md-3 d-flex flex-md-column mt-md-0 mt-3 px-0">
					<ComplexityInput
						class="d-flex justify-content-end"
						:complexity="activity.complexity"
						:isDark="isDark"
						:disabled="true"
					/>

					<span
						class="text-right px-1 pt-1 created-by d-md-block d-flex align-items-center"
						:class="isDark ? 'created-by-dark' : 'created-by-light'"
					>
						Criado por:
						<router-link
							class="header-info header-link text-muted pl-md-0 pl-1"
							:class="isDark ? 'header-link-dark' : 'header-link-light'"
							:to="{ name: 'Profile', params: { id: activity.creator.id } }"
						>
							{{ activity.creator.name }}
						</router-link>
					</span>

					<!-- move this div to the end -->
					<div v-if="canUserEdit" class="d-flex justify-content-end flex-row px-2">
						<b-button
							size="sm"
							class="delete-btn rounded-circle bg-transparent border-0 mt-2"
							@click="showDeleteModal = true"
						>
							<img
								v-lazy="{
									src: isDark ? '../assets/icons/remove-dark.svg' : '../assets/icons/remove-light.svg',
								}"
								alt="Remover atividade"
								width="25"
								height="25"
							/>
						</b-button>

						<b-button
							size="sm"
							class="delete-btn rounded-circle bg-transparent border-0 mt-2"
							@click="showFinishModal = true"
						>
							<img
								v-lazy="{
									src: isDark ? '../assets/icons/finish-dark.svg' : '../assets/icons/finish-light.svg',
								}"
								alt="Remover atividade"
								width="25"
								height="25"
							/>
						</b-button>
					</div>
				</div>
			</header>
			<main class="d-flex flex-lg-row flex-column" style="overflow: hidden">
				<div class="col-lg-4 col-12 left-content px-0 pt-5">
					<ActivityDetailContent side="left" />
					<ActivityDetailContent side="left" title="Diagnóstico" :content="activity.diagnostic" />
					<ActivityDetailContent side="left" />
					<ActivityDetailContent side="left" title="Recursos" :content="activity.resources" :pad="true" />
					<ActivityDetailContent side="left" />
					<ActivityDetailContent
						side="left"
						title="Indicadores de avaliação"
						:content="activity.evaluation_indicator"
						:pad="true"
					/>
					<ActivityDetailContent side="left" />
				</div>
				<div class="col-lg-4 col-0 d-lg-block d-none plant">
					<img class="img-fluid plant-img h-100 w-100" v-lazy="{ src: Plant }" alt="planta" />
				</div>
				<div class="col-lg-4 col-12 right-content px-0 pt-lg-5 mb-md-0 pb-md-0 mb-5 pb-5">
					<ActivityDetailContent side="right" title="Objetivos" :content="activity.objective" />
					<ActivityDetailContent side="right" />
					<ActivityDetailContent side="right" title="Metas" :content="activity.meta" />
					<ActivityDetailContent side="right" />
					<ActivityDetailContent
						side="right"
						title="Participantes"
						:content="activity.participants"
						:pad="true"
					/>
					<ActivityDetailContent side="right" />
					<ActivityDetailContent
						side="right"
						title="Instrumentos de avaliação"
						:content="activity.evaluation_method"
						:pad="true"
					/>
					<ActivityDetailContent side="right" />
				</div>
			</main>
		</div>

		<DeleteModal
			:id="activity.id"
			type="activity"
			text="esta atividade"
			:show="showDeleteModal"
			@close="showDeleteModal = false"
			@delete="leavePage"
		/>

		<FinishActivityModal
			:id="activity.id"
			:show="showFinishModal"
			@close="showFinishModal = false"
			@update="leavePage"
		/>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #18516f;
$fourth-color: #ffffff;

.activity-title {
	font-family: "Panton", sans-serif;
	font-weight: 700;
	font-size: 1.8rem;

	&-dark {
		color: $secondary-color;
	}

	&-light {
		color: $primary-color;
	}
}

.theme {
	font-family: "Panton", sans-serif;
	font-weight: 700;
	font-size: 1.2rem;
	color: $primary-color;
	background-color: $secondary-color;
	border-radius: 15px;
}

.dates {
	font-family: "Panton", sans-serif;
	font-weight: 400;
	font-size: 1rem;

	&-dark {
		color: $secondary-color;
	}

	&-light {
		color: $primary-color;
	}
}

.created-by {
	font-family: "Panton", sans-serif;
	font-weight: 400;
	font-size: 1rem;

	&-dark {
		color: $secondary-color;
	}

	&-light {
		color: $primary-color;
	}
}

.header-info {
	font-family: "Panton", sans-serif;
	font-weight: 700;
	font-size: 1rem;
	color: $primary-color;

	&.header-link {
		font-size: 0.95rem;
		text-decoration: none;

		&-dark {
			&:hover {
				color: $fourth-color !important;
			}
		}

		&-light {
			&:hover {
				color: $tertiary-color !important;
			}
		}
	}
}

.plant {
	min-height: 800px;
	animation: plant 1s ease-in-out;
}

.plant-img {
	object-fit: cover;
}

.left-content {
	animation: left-content 1.5s ease-in-out;
}

.right-content {
	animation: right-content 1.5s ease-in-out;
}

@keyframes plant {
	0% {
		transform: translateY(100vh);
		opacity: 0;
	}
	100% {
		transform: translateY(0);
		opacity: 1;
	}
}

@keyframes left-content {
	0% {
		transform: translateX(-100vw);
		opacity: 0;
	}
	100% {
		transform: translateX(0);
		opacity: 1;
	}
}

@keyframes right-content {
	0% {
		transform: translateX(100vw);
		opacity: 0;
	}
	100% {
		transform: translateX(0);
		opacity: 1;
	}
}
</style>
