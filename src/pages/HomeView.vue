<script setup>
import SearchBar from "../components/SearchBar.vue";
import Header from "../components/Header.vue";
import { useDark } from "@vueuse/core";
import { useNewsStore } from "../stores/news";
import { onBeforeMount, ref } from "vue";
import RecentNews from "../components/RecentNews.vue";

const isDark = useDark();
const recentNews = ref([]);
const fetchingNews = ref(true);

onBeforeMount(async () => {
	const newsStore = useNewsStore();
	const response = await newsStore.getNews("recent");

	if (response.success) recentNews.value = response.data.news;
	fetchingNews.value = false;
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
		</div>
	</div>
</template>
