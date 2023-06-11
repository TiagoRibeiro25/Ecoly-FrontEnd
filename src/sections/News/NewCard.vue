<script setup>
import CardImage from "../../components/CardImage.vue";
import { useDark } from "@vueuse/core";
import { ref, onMounted } from "vue";
import { formatText, formatDate } from "../../utils/formatData";

const props = defineProps({
	index: { type: Number, required: true },
	id: { type: Number, required: true },
	title: { type: String, required: true },
	content: { type: String, required: true },
	dateCreated: { type: String, required: true },
	image: { type: String, required: true },
	isUserAdmin: { type: Boolean, required: true },
});

// emit that sends the id of the new to be deleted
const emit = defineEmits(["delete"]);

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
		class="new-card mb-5 shadow d-flex flex-row"
		:class="isDark ? 'new-card-bg-dark' : 'new-card-bg-light'"
	>
		<div class="col-4 px-0 d-lg-block d-none">
			<CardImage :image="props.image" type="new" :id="props.id" />
		</div>
		<div class="col-lg-8 d-flex flex-column px-2 py-3" style="overflow: hidden">
			<div class="row">
				<div
					class="title-container text-lg-left text-center"
					:class="props.isUserAdmin ? 'col-sm-10 col-9' : 'col-12'"
				>
					<h2>
						<router-link
							:to="{ name: 'NewDetail', params: { id: props.id } }"
							class="new-title"
							:class="isDark ? 'title-dark' : 'title-light'"
						>
							{{ props.title }}
						</router-link>
					</h2>
				</div>
				<div v-if="props.isUserAdmin" class="col-sm-2 col-3 text-center pt-2">
					<b-button
						size="sm"
						class="rounded-circle bg-transparent border-0 mt-sm-0 mt-2"
						@click="() => emit('delete', props.id)"
					>
						<img
							v-lazy="{
								src: isDark ? '../assets/icons/remove-dark.svg' : '../assets/icons/remove-light.svg',
							}"
							alt="Remover notícia"
							width="25"
							height="25"
						/>
					</b-button>
				</div>
			</div>
			<div class="row mt-3">
				<div class="col-12">
					<p class="new-description text-justify pr-1" :class="isDark ? 'text-light' : 'text-dark'">
						{{ formatText(props.content, 500) }}
					</p>
				</div>
			</div>
			<div class="row mt-3">
				<div class="col-12">
					<p
						class="new-date text-muted text-lg-left text-center"
						:class="isDark ? 'text-light' : 'text-dark'"
					>
						{{ formatDate(props.dateCreated, "yyyy-mm-dd") }}
					</p>
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

.new-card {
	border-radius: 20px;
	height: 300px;
	animation: slideIn 0.7s ease-in-out;
}

.new-title {
	font-family: "Alkes", sans-serif;
	font-size: 1.35rem;
	font-weight: 700;

	&:hover {
		text-decoration: underline;
	}
}

.title-container {
	height: 80px;
	overflow: hidden;
}

.new-description,
.new-date {
	font-family: "Panton", sans-serif;
	font-size: 1rem;
	font-weight: 400;
	height: 120px;
	overflow: hidden;
}

.new-date {
	font-size: 0.9rem;
}

.title-dark {
	color: $quaternary-color;
}

.title-light {
	color: $primary-color;
}

.new-card-bg-dark {
	background-color: $primary-color;
}

.new-card-bg-light {
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
