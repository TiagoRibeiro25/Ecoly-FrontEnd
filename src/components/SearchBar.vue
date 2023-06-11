<script setup>
import { useActivitiesStore } from "@/stores/activities";
import { useNewsStore } from "@/stores/news";
import { useDark } from "@vueuse/core";
import { ref, watchEffect } from "vue";

const isDark = useDark();
const props = defineProps({
	page: { type: String, required: false, default: "Home" },
	placeholder: { type: String, required: false },
});

const search = ref("");
const data = ref([]);
const showModal = ref(false);
const searching = ref(false);

watchEffect(async () => {
	const searchInput = search.value;
	data.value = [];

	if (searchInput.trim().length < 3) {
		showModal.value = false;
		return;
	}

	searching.value = true;
	showModal.value = true;

	setTimeout(async () => {
		if (searchInput !== search.value) return;

		data.value = [];
		if (searchInput.trim().length < 3) {
			searching.value = false;
			showModal.value = false;
			return;
		}

		// Search for activities
		if (props.page === "Activities" || props.page === "Home") {
			const activitiesStore = useActivitiesStore();
			const activitiesResponse = await activitiesStore.search(searchInput);
			if (activitiesResponse.success) {
				const activities = activitiesResponse.data;
				activities.forEach((activity) => {
					data.value.push({ id: activity.id, title: activity.title, type: "atividade" });
				});
			}
		}

		// Search for news
		if (props.page === "News" || props.page === "Home") {
			const newsStore = useNewsStore();
			const newsResponse = await newsStore.search(searchInput);
			if (newsResponse.success) {
				const news = newsResponse.data.news;
				news.forEach((news) => {
					data.value.push({ id: news.id, title: news.title, type: "notícia" });
				});
			}
		}

		searching.value = false;
		if (data.value.length === 0) showModal.value = false;
	}, 1500);
});
</script>

<template>
	<div class="searchbar mx-auto">
		<b-input-group>
			<template #prepend>
				<b-input-group-text
					class="searchbar-input search-icon"
					:class="{ 'bg-light': !isDark, 'bg-dark': isDark }"
				>
					<img v-lazy="{ src: '../assets/icons/search.svg' }" alt="search" width="20" />
				</b-input-group-text>
			</template>
			<b-form-input
				class="searchbar-input"
				:class="{ 'bg-light': !isDark, 'bg-dark': isDark }"
				:placeholder="props.placeholder || 'Pesquisar'"
				type="search"
				v-model="search"
				style="width: 400px"
			></b-form-input>
		</b-input-group>
	</div>

	<!-- Search Results -->
	<div class="search-results px-5" :style="{ visibility: showModal ? 'visible' : 'hidden' }">
		<div v-if="searching">
			<div class="d-flex justify-content-center flex-row">
				<b-spinner class="mt-5 mx-1" variant="success" type="grow"></b-spinner>
				<b-spinner class="mt-5 mx-1" variant="success" type="grow"></b-spinner>
				<b-spinner class="mt-5 mx-1" variant="success" type="grow"></b-spinner>
			</div>
		</div>

		<div v-else class="mb-3 px-5">
			<div v-if="data.length === 0">
				<div
					class="d-flex justify-content-center flex-row error-container py-4 mx-auto"
					:class="isDark ? 'error-container-dark' : 'error-container-light'"
				>
					<h2 class="error-msg mt-2">Nenhum resultado encontrado</h2>
				</div>
			</div>

			<div
				v-else
				v-for="item in data"
				:key="item.id"
				class="d-flex flex-row result mx-auto"
				:class="isDark ? 'result-dark' : 'result-light'"
			>
				<div class="col-9">
					<router-link
						:to="{ name: item.type === 'notícia' ? 'NewDetail' : 'ActivityDetail', params: { id: item.id } }"
						class="go-to-item-link text-decoration-none"
						:class="isDark ? 'go-to-item-link-dark' : 'go-to-item-link-light'"
					>
						{{ item.title }}
					</router-link>
				</div>
				<div class="col-3 d-flex justify-content-end align-items-center">
					<span class="result-text" :class="isDark ? 'result-text-dark' : 'result-text-light'">
						{{ item.type }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #ffffff;
$quaternary-color: #e4f0e8;
$quinary-color: #18516f;

.searchbar {
	width: 85%;
	max-width: 700px;
	z-index: 1001;
}

.searchbar-input {
	border: none;
	border-radius: 13px;

	&:focus {
		box-shadow: none;
	}
}

.bg-light {
	background-color: $primary-color !important;
	color: $secondary-color !important;
}

.bg-dark {
	background-color: $tertiary-color !important;
	color: $primary-color !important;
}

.search-results {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
	padding-top: 180px;
	margin-left: 40px;
	background-color: rgba(0, 0, 0, 0.7);

	overflow-y: scroll;

	&::-webkit-scrollbar {
		display: none;
	}

	.result {
		border-radius: 13px;
		padding: 10px;
		margin-bottom: 23px;
		max-width: 1310px;

		&-dark {
			background-color: $primary-color;
		}

		&-light {
			background-color: $quaternary-color;
		}
	}

	.result-text {
		font-family: "Panton", sans-serif;
		font-weight: 600;
		font-size: 20px;

		&-dark {
			color: $secondary-color;
		}

		&-light {
			color: $primary-color;
		}
	}

	.col-9 {
		color: $secondary-color;
		font-family: "Panton", sans-serif;
		font-weight: 600;
		font-size: 20px;
	}

	.col-3 {
		color: $secondary-color;
		text-align: right;

		font-family: "Panton", sans-serif;
		font-weight: 600;
		font-size: 20px;
	}

	.go-to-item-link {
		&-dark {
			color: $secondary-color;

			&:hover {
				color: $tertiary-color;
			}
		}

		&-light {
			color: $primary-color;

			&:hover {
				color: $quinary-color;
			}
		}
	}
}

.error-container {
	background-color: $primary-color;
	border-radius: 15px;
	width: 40%;
	min-width: 400px;

	.error-msg {
		font-family: "Panton", sans-serif;
		font-weight: 600;
		font-size: 25px;
	}

	&-dark {
		background-color: $primary-color;

		.error-msg {
			color: $secondary-color;
		}
	}

	&-light {
		background-color: $quaternary-color;

		.error-msg {
			color: $primary-color;
		}
	}
}

@media (max-width: 768px) {
	.searchbar {
		width: 100%;
	}

	.search-results {
		margin-left: 0;
		padding-top: 150px;
	}
}

@media (max-width: 495px) {
	.search-icon {
		display: none;
	}

	.searchbar-input {
		border-radius: 0;
	}
}
</style>
