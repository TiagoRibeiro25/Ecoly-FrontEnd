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
			<div class="row" style="height: 200px">
				<div class="col-6 d-flex align-items-end">
					<div class="activity-dates" :class="isDark ? 'activity-dates-dark' : 'activity-dates-light'">
						<div>
							Data de início: <span class="text-muted">{{ initialDate }}</span>
						</div>
						<div>
							Data final: <span class="text-muted">{{ finalDate }}</span>
						</div>
					</div>
				</div>
				<div class="col-6 d-flex justify-content-end align-items-end flex-column pr-5">
					<div :class="canUserEdit ? '' : 'mb-2'">
						<span class="theme px-3 py-1">
							{{ theme }}
						</span>
					</div>
					<div v-if="canUserEdit">
						<button
							type="button"
							class="finish-btn btn btn-sm rounded-pill px-3 float-right mt-2"
							:class="isDark ? 'finish-btn-dark' : 'finish-btn-light'"
							@click="emit('finish', props.id)"
						>
							<img class="mr-1" v-lazy="{ src: '../assets/icons/finish.svg' }" alt="add" width="20" />
							<span> Finalizar </span>
						</button>
					</div>
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
$quinary-color: #18516f;

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

.activity-description {
	font-family: "Panton", sans-serif;
	font-size: 1rem;
	font-weight: 400;
	overflow: hidden;

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

.activity-dates {
	font-family: "Panton", sans-serif;
	font-size: 1rem;
	font-weight: 400;

	&-dark {
		color: $tertiary-color;
	}

	&-light {
		color: $primary-color;
	}
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

.theme {
	font-family: "Panton", sans-serif;
	font-size: 1.05rem;
	font-weight: 700;
	color: $primary-color;
	background-color: $quaternary-color;
	border-radius: 15px;
}

.finish-btn {
	font-family: "Panton", sans-serif;
	font-weight: 600;
	font-size: 14px;

	&-dark {
		background-color: $tertiary-color;
		color: $primary-color;
		& img {
			filter: invert(1);
		}

		&:hover {
			background-color: $quinary-color;
			color: $tertiary-color;

			& img {
				filter: invert(0);
			}
		}
	}

	&-light {
		background-color: $primary-color;
		color: $tertiary-color;

		&:hover {
			background-color: $quinary-color;
			color: $tertiary-color;
		}
	}
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
