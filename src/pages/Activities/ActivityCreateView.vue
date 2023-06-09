<script setup>
import Header from "../../components/Header.vue";
import AddImages from "../../components/AddImages.vue";
import Input from "../../components/Input.vue";
import DateInput from "@/components/DateInput.vue";
import ComplexityInput from "@/components/ComplexityInput.vue";
import { useDark } from "@vueuse/core";
import { onBeforeMount, ref, watch } from "vue";
import { useUsersStore } from "@/stores/users";
import { useActivitiesStore } from "@/stores/activities";
import { useRouter } from "vue-router";

const isDark = useDark();
const router = useRouter();
const activity = ref({
	imgs: [],
	title: "",
	diagnostic: "",
	objective: "",
	participants: "",
	metas: "",
	resources: "",
	evaluationIndicators: "",
	evaluationMethod: "",
	complexity: 0,
	theme: "",
	initialDate: "",
	finalDate: "",
});
const themes = ref([]);
const themeSelected = ref(null);

const msg = ref("");
const creating = ref(false);
const loading = ref(true);
const errorMsg = ref("");

const validateForm = () => {
	if (!activity.value.imgs || activity.value.imgs.length === 0) return false;
	if (
		!activity.value.title ||
		activity.value.title.trim().length < 10 ||
		activity.value.title.trim().length > 100
	)
		return false;
	if (!activity.value.diagnostic || activity.value.diagnostic.trim().length < 100 || activity.value.diagnostic.trim().length > 300) return false;
	if (!activity.value.objective || activity.value.objective.trim().length < 100 || activity.value.objective.trim().length > 300) return false;
	if (!activity.value.participants || activity.value.participants.trim().length < 100 || activity.value.participants.trim().length > 300) return false;
	if (!activity.value.metas || activity.value.metas.trim().length < 100 || activity.value.metas.trim().length > 300) return false;
	if (!activity.value.resources || activity.value.resources.trim().length < 100 || activity.value.resources.trim().length > 300) return false;
	if (!activity.value.evaluationIndicators || activity.value.evaluationIndicators.trim().length < 100 || activity.value.evaluationIndicators.trim().length > 300)
		return false;
	if (!activity.value.evaluationMethod || activity.value.evaluationMethod.trim().length < 100 || activity.value.evaluationMethod.trim().length > 300) return false;
	if (!activity.value.complexity || activity.value.complexity < 1 || activity.value.complexity > 5)
		return false;
	if (activity.value.initialDate > activity.value.finalDate) return false;
	return activity.value.theme !== null;
};

watch(themeSelected, (value) => {
	activity.value.theme = value;
});

const addActivity = async () => {
	errorMsg.value = "";

	if (!validateForm()) {
		errorMsg.value = "Preencha todos os campos corretamente";
		return;
	}

	creating.value = true;
	const activitiesStore = useActivitiesStore();
	const response = await activitiesStore.addActivity({
		theme_id: activity.value.theme,
		title: activity.value.title,
		complexity: activity.value.complexity,
		initial_date: activity.value.initialDate,
		final_date: activity.value.finalDate,
		objective: activity.value.objective,
		diagnostic: activity.value.diagnostic,
		meta: activity.value.metas,
		resources: activity.value.resources,
		participants: activity.value.participants,
		evaluation_indicator: activity.value.evaluationIndicators,
		evaluation_method: activity.value.evaluationMethod,
		images: activity.value.imgs,
	});

	if (!response.success) {
		errorMsg.value = response.message;
	} else {
		errorMsg.value = "Atividade criada com sucesso";
	}

	creating.value = false;
};

onBeforeMount(async () => {
	const usersStore = useUsersStore();
	const userResponse = await usersStore.getLoggedInUser();

	if (!userResponse.success || userResponse.data.role === "unsigned") {
		await router.push({ name: "NotFound" });
		return;
	}

	const activitiesStore = useActivitiesStore();
	const themesResponse = await activitiesStore.getActiveThemes();

	if (!themesResponse.success) {
		msg.value = "Occoreu um erro ao carregar temas";
		return;
	}

	themes.value = themesResponse.data.map((theme) => {
		return { value: theme.id, text: theme.name };
	});

	themeSelected.value = themes.value[0].value;

	loading.value = false;
});
</script>

<template>
	<div
		v-if="loading || themes.length === 0"
		class="col-12 d-flex justify-content-center align-items-center"
		style="height: 100vh"
	>
		<b-spinner v-if="loading" variant="success" label="Carregando"></b-spinner>
		<span v-else class="error-msg" :class="isDark ? 'error-msg-dark' : 'error-msg-light'">
			Nenhuma notícia encontrada
		</span>
	</div>

	<div v-else class="col-12 mt-5">
		<Header title="Adicionar Atividade" />
	</div>

	<div class="col-12 mb-4">
		<div class="mx-auto px-5" style="max-width: 1403px">
			<div class="col-12 pt-3">
				<AddImages :images="activity.imgs" />
			</div>

			<div class="col-12 d-flex flex-lg-row flex-column mt-5 px-0">
				<div class="col-lg-6 col-12 px-0">
					<Input
						class="p-3"
						:text="activity.title"
						placeholder="Título (mínimo 10 caracteres)"
						type="textarea"
						:isDark="isDark"
						@update:text="(value) => (activity.title = value)"
					/>

					<Input
						class="p-3"
						:text="activity.objective"
						placeholder="Objetivo (mínimo 100 caracteres)"
						type="textarea"
						:isDark="isDark"
						@update:text="(value) => (activity.objective = value)"
					/>

					<Input
						class="p-3"
						:text="activity.metas"
						placeholder="Metas (mínimo 100 caracteres)"
						type="textarea"
						:isDark="isDark"
						@update:text="(value) => (activity.metas = value)"
					/>

					<Input
						class="p-3"
						:text="activity.resources"
						placeholder="Recursos (mínimo 100 caracteres)"
						type="textarea"
						:isDark="isDark"
						@update:text="(value) => (activity.resources = value)"
					/>
				</div>
				<div class="col-lg-6 col-12 px-0">
					<Input
						class="p-3"
						:text="activity.diagnostic"
						placeholder="Diagnóstico (mínimo 100 caracteres)"
						type="textarea"
						:isDark="isDark"
						@update:text="(value) => (activity.diagnostic = value)"
					/>

					<Input
						class="p-3"
						:text="activity.participants"
						placeholder="Participantes (mínimo 100 caracteres)"
						type="textarea"
						:isDark="isDark"
						@update:text="(value) => (activity.participants = value)"
					/>

					<Input
						class="p-3"
						:text="activity.evaluationIndicators"
						placeholder="Indicadores de avaliação (mínimo 100 caracteres)"
						type="textarea"
						:isDark="isDark"
						@update:text="(value) => (activity.evaluationIndicators = value)"
					/>

					<Input
						class="p-3"
						:text="activity.evaluationMethod"
						placeholder="Instrumentos de avaliação (mínimo 100 caracteres)"
						type="textarea"
						:isDark="isDark"
						@update:text="(value) => (activity.evaluationMethod = value)"
					/>
				</div>
			</div>

			<div class="col-12 d-flex flex-lg-row flex-column px-0">
				<div class="col-lg-6 col-12 px-0">
					<ComplexityInput
						class="p-3 text-center"
						complexity="activity.complexity"
						:isDark="isDark"
						@update:complexity="(value) => (activity.complexity = value)"
					/>

					<div class="col-12">
						<b-form-select
							class="theme-picker my-3"
							:class="isDark ? 'theme-picker-dark' : 'theme-picker-light'"
							v-model="themeSelected"
							:options="themes"
						></b-form-select>
					</div>
				</div>
				<div class="col-lg-6 col-12 px-0">
					<DateInput
						class="p-3"
						:date="activity.initialDate"
						placeholder="Data de início"
						:minDate="new Date()"
						:maxDate="new Date(new Date().setFullYear(new Date().getFullYear() + 1))"
						@update:date="(value) => (activity.initialDate = value)"
					/>

					<DateInput
						class="p-3"
						:date="activity.finalDate"
						placeholder="Data de término"
						:minDate="new Date()"
						:maxDate="new Date(new Date().setFullYear(new Date().getFullYear() + 1))"
						@update:date="(value) => (activity.finalDate = value)"
					/>
				</div>
			</div>

			<div class="col-12 d-flex justify-content-center align-items-center flex-column my-5">
				<b-spinner v-if="creating" class="mb-3" variant="success" label="Adicionando..." />
				<span
					v-if="errorMsg !== ''"
					class="error-msg pb-3"
					:class="isDark ? 'error-msg-dark' : 'error-msg-light'"
				>
					{{ errorMsg }}
				</span>

				<button
					class="add-activity-btn btn px-4"
					:class="isDark ? 'dark-btn' : 'light-btn'"
					:disabled="!validateForm() || creating"
					@click="addActivity"
				>
					Adicionar Atividade
				</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #3fc380;
$fourth-color: #ffffff;
$fifth-color: #18516f;

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

.theme-picker {
	font-family: "Panton", sans-serif;
	font-size: 1.25rem;
	margin-top: 0.55rem;
	border: 2px solid $tertiary-color;
	border-radius: 0.6rem;
	background-color: transparent !important;
	outline: transparent;

	&-dark {
		color: $secondary-color;
		transition: all 0.3s ease-in-out;

		&:focus {
			background-color: $primary-color !important;
			box-shadow: none;
			border-color: $fourth-color;
			color: $fourth-color;
		}
	}

	&-light {
		color: $primary-color;
		transition: all 0.3s ease-in-out;

		&:focus {
			box-shadow: none;
			border-color: $fifth-color;
			color: $fifth-color;
		}
	}
}

.add-activity-btn {
	border: none;
	outline: transparent;
	border-radius: 15px;
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 600;

	&.dark-btn {
		background-color: $fourth-color;
		color: $primary-color;
	}

	&.light-btn {
		background-color: $primary-color;
		color: $fourth-color;
	}

	&:hover {
		color: $fourth-color;
		background-color: $fifth-color;
	}
}
</style>
