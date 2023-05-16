<script setup>
import { useActivitiesStore } from "../stores/activities";
import { useNewsStore } from "../stores/news";
import { useDark } from "@vueuse/core";
import { ref, watchEffect } from "vue";

const isDark = useDark();
const props = defineProps({
	page: { type: String, required: false },
	placeholder: { type: String, required: false },
});

/** @type {"News" | "Activities" | "Home"} */
const currentPage = props.page || "Home";
const search = ref("");
/** @type {Array<{id: number, title: string, type: "atividade | notícia"}> */
const data = ref([]);
const showModal = ref(false);
const searching = ref(false);

watchEffect(async () => {
	const searchInput = search.value;
	data.value = [];

	if (search.value.length < 3) {
		showModal.value = false;
		return;
	}

	searching.value = true;
	showModal.value = true;

	setTimeout(async () => {
		if (searchInput !== search.value) return;

		data.value = [];
		if (searchInput.length < 3) {
			searching.value = false;
			showModal.value = false;
			return;
		}

		// Search for activities
		if (currentPage === "Activities" || currentPage === "Home") {
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
		if (currentPage === "News" || currentPage === "Home") {
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
					<img src="../assets/icons/search.svg" alt="search" width="20" />
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
	<div
		class="search-results px-5"
		:style="{
			visibility: showModal ? 'visible' : 'hidden',
			backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)',
		}"
	>
		<div v-if="searching">
			<div class="d-flex justify-content-center flex-row">
				<b-spinner class="mt-5 mx-1" variant="success" type="grow"></b-spinner>
				<b-spinner class="mt-5 mx-1" variant="success" type="grow"></b-spinner>
				<b-spinner class="mt-5 mx-1" variant="success" type="grow"></b-spinner>
			</div>
		</div>

		<div v-else class="mb-3">
			<div v-if="data.length === 0">
				<div class="d-flex justify-content-center flex-row error-container py-4 mx-auto">
					<h2 class="error-msg mt-2" :class="{ 'error-msg-dark': isDark, 'error-msg-light': !isDark }">
						Nenhum resultado encontrado
					</h2>
				</div>
			</div>

			<div v-else v-for="item in data" :key="item.id" class="d-flex flex-row result mx-auto">
				<div class="col-9">
					<router-link
						:to="{ name: item.type === 'notícia' ? 'NewDetail' : 'ActivityDetail', params: { id: item.id } }"
						class="go-to-item-link text-decoration-none"
					>
						{{ item.title }}
					</router-link>
				</div>
				<div class="col-3">
					<span class="result-text">
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

.searchbar {
	width: 50%;
	max-width: 1310px;
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

	overflow-y: scroll;

	&::-webkit-scrollbar {
		display: none;
	}

	.result {
		background-color: $primary-color;
		border-radius: 13px;
		padding: 10px;
		margin-bottom: 23px;
		max-width: 1310px;
	}

	.result-text {
		font-family: "Panton", sans-serif;
		font-weight: 600;
		font-size: 20px;
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
		color: $secondary-color;
	}

	.go-to-item-link:hover {
		color: $tertiary-color;
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
		color: $secondary-color;
	}
}

@media (max-width: 1100px) {
	.search-icon {
		display: none;
	}

	.searchbar-input {
		border-radius: 0;
	}
}
</style>
