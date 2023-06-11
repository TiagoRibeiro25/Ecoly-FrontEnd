<script setup>
import SearchBar from "../../components/SearchBar.vue";
import Header from "../../components/Header.vue";
import RecentNews from "../../sections/Home/RecentNews.vue";
import RecentActivities from "../../sections/Home/RecentActivities.vue";
import Footer from "../../sections/Home/Footer.vue";
import FAQ from "../../sections/Home/FAQ.vue";
import { useNewsStore } from "@/stores/news";
import { onBeforeMount, ref } from "vue";
import { useActivitiesStore } from "@/stores/activities";
import { useQuotesStore } from "@/stores/quotes";
import { useDark } from "@vueuse/core";

const isDark = useDark();

// News Variables
const recentNews = ref([]);
const fetchingNews = ref(true);

// Activities Variables
const recentActivities = ref([]);
const fetchingActivities = ref(true);

// Quotes Variables
const quote = ref({});
const fetchingQuote = ref(true);

const fetchNews = async () => {
	const newsStore = useNewsStore();
	const response = await newsStore.getNews("recent");

	if (response.success) recentNews.value = response.data.news;
	fetchingNews.value = false;
};

const fetchActivities = async () => {
	const activitiesStore = useActivitiesStore();
	const response = await activitiesStore.getRecentActivities();

	if (response.success) recentActivities.value = response.data;
	fetchingActivities.value = false;
};

const fetchRandomQuote = async () => {
	const quotesStore = useQuotesStore();
	quote.value = await quotesStore.getRandomQuote();
	fetchingQuote.value = false;
};

onBeforeMount(async () => {
	await Promise.all([fetchNews(), fetchActivities(), fetchRandomQuote()]);
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
		<div class="mx-auto px-md-5" style="max-width: 1405px">
			<div class="col-12 px-0 mt-5">
				<RecentNews :news="recentNews" :fetching="fetchingNews" />
			</div>
			<div class="col-12 px-0 mt-5 py-5">
				<RecentActivities :activities="recentActivities" :fetching="fetchingActivities" />
			</div>
			<div class="col-12 px-0 mt-5 pb-3">
				<div class="d-flex flex-column align-items-center justify-content-center mb-5 w-75 mx-auto pt-5">
					<div
						v-if="quote.author && quote.content"
						class="text-center"
						:class="isDark ? 'dark-text' : 'light-text'"
					>
						<p class="content mb-0">{{ quote.content }}</p>
						<span class="author mt-0">{{ quote.author }}</span>
					</div>
					<div v-else>
						<b-spinner variant="success" label="Carregando..."></b-spinner>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-12 px-0 mt-5">
		<FAQ />
	</div>
	<div class="col-12 px-0">
		<Footer />
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #f8f9fa;
$secondary-color: #343e3d;
$tertiary-color: #aedcc0;

.content {
	font-family: "Panton", sans-serif;
	font-size: 1.7rem;
	font-weight: 700;
}

.author {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 500;
	opacity: 0.7;
}

.light-text {
	color: $secondary-color;
}

.dark-text {
	color: $primary-color;
}
</style>
