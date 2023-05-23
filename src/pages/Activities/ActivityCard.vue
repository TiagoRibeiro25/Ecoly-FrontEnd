<script setup>
import CardImage from "../../components/CardImage.vue";
import { useDark } from "@vueuse/core";
import { ref, onMounted } from "vue";

const props = defineProps({
	index: { type: Number, required: true },
	id: { type: Number, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	initialDate: { type: String, required: true },
	finalDate: { type: String, required: true },
	theme: { type: String, required: true },
	image: { type: String, required: true },
	canUserEdit: { type: Boolean, required: false, default: false },
});

const emit = defineEmits(["delete", "finish"]);

const isDark = useDark();
const loaded = ref(false);

onMounted(() => {
	setTimeout(() => {
		loaded.value = true;
	}, (props.index + 1) * 100);
});
</script>

<template>
	<div
		v-if="loaded"
		class="activity-card mb-5 shadow d-flex flex-row"
		:class="isDark ? 'activity-card-bg-dark' : 'activity-card-bg-light'"
	>
		<div class="col-4 px-0 d-lg-block d-none">
			<CardImage :image="props.image" type="activity" :id="props.id" />
		</div>
		<div class="col-lg-8 d-flex flex-column px-2 py-3" style="overflow: hidden">
			<div class="row">
				<div
					class="title-container text-lg-left text-center"
					:class="props.canUserEdit ? 'col-10' : 'col-12'"
				>
					<h2>
						<router-link
							:to="{ name: 'ActivityDetail', params: { id: props.id } }"
							class="activity-title"
							:class="isDark ? 'title-dark' : 'title-light'"
						>
							{{ props.title }}
						</router-link>
					</h2>
				</div>
				<div v-if="props.canUserEdit" class="col-2 text-center pt-2">
					<b-button
						size="sm"
						class="rounded-circle bg-transparent border-0"
						@click="emit('delete', props.id)"
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
				</div>
			</div>
			<div class="row mt-3">
				<div class="col-12">
					<p
						class="activity-description text-justify pr-1"
						:class="isDark ? 'activity-description-dark' : 'activity-description-light'"
						v-html="props.description.replace(/\n/g, '<br />')"
					></p>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #e4f0e8;
$tertiary-color: #ffffff;
$quaternary-color: #aedcc0;

.activity-card {
	border-radius: 20px;
	height: 300px;
	animation: slideIn 0.7s ease-in-out;
}

.activity-title {
	font-family: "Alkes", sans-serif;
	font-size: 1.35rem;
	font-weight: 700;

	&:hover {
		text-decoration: underline;
	}
}

.title-container {
	height: 70px;
	overflow: hidden;
}

.activity-description,
.activity-date {
	font-family: "Panton", sans-serif;
	font-size: 1rem;
	font-weight: 400;
	height: 80px;
	overflow: hidden;
}

.activity-description {
	&-dark {
		color: $tertiary-color;
	}

	&-light {
		color: $primary-color;
	}
}

.activity-date {
	font-size: 0.9rem;
}

.title-dark {
	color: $quaternary-color;
}

.title-light {
	color: $primary-color;
}

.activity-card-bg-dark {
	background-color: $primary-color;
}

.activity-card-bg-light {
	background-color: $secondary-color;
}

@keyframes slideIn {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(0);
	}
}
</style>
