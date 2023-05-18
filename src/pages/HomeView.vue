<script setup>
import SearchBar from "../components/SearchBar.vue";
import Header from "../components/Header.vue";
import RecentNews from "../components/Home/RecentNews.vue";
import RecentActivities from "../components/Home/RecentActivities.vue";
import { useNewsStore } from "../stores/news";
import { onBeforeMount, ref } from "vue";
import { useActivitiesStore } from "../stores/activities";

// News Variables
const recentNews = ref([]);
const fetchingNews = ref(true);

// Activities Variables
const recentActivities = ref([]);
const fetchingActivities = ref(true);

/** @returns {Promise<void>} */
const fetchNews = async () => {
	const newsStore = useNewsStore();
	const response = await newsStore.getNews("recent");

	if (response.success) recentNews.value = response.data.news;
	fetchingNews.value = false;
};

/** @returns {Promise<void>} */
const fetchActivities = async () => {
	const activitiesStore = useActivitiesStore();
	const response = await activitiesStore.getRecentActivities();

	if (response.success) recentActivities.value = response.data;
	fetchingActivities.value = false;
};

onBeforeMount(() => {
	Promise.all([fetchNews(), fetchActivities()]);
});
</script>

<template>
	<div class="col-12 d-flex align-items-center mt-5">
		<SearchBar />
	</div>
	<div class="col-12">
		<Header title="DESTAQUES" />
	</div>
	<div class="col-12 my-4">
		<div class="mx-auto px-5" style="max-width: 1405px">
			<div class="col-12 px-0 mt-5">
				<RecentNews :news="recentNews" :fetching="fetchingNews" />
			</div>
			<div class="col-12 px-0 mt-5">
				<RecentActivities :activities="recentActivities" :fetching="fetchingActivities" />
			</div>
		</div>
	</div>
</template>
