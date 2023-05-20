<script setup>
import SearchBar from "../components/SearchBar.vue";
import Header from "../components/Header.vue";
import RecentNews from "../components/Home/RecentNews.vue";
import RecentActivities from "../components/Home/RecentActivities.vue";
import FAQ from "../utils/FAQcontent.js";
import Footer from "../components/Home/Footer.vue";
import { useNewsStore } from "../stores/news";
import { onBeforeMount, ref } from "vue";
import { useActivitiesStore } from "../stores/activities";
import { useDark } from "@vueuse/core";
import axios from "axios";

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

/** @returns {Promise<void>} */
const fetchRandomQuote = async () => {
	try {
		const response = await axios.get(import.meta.env.VITE_QUOTES_API_ROUTE);
		quote.value = response.data;
	} catch (err) {
		console.log("There was an error fetching the quote. Using default quote instead.\n Error: ", err);
		quote.value = {
			author: "Yan Arthus Bertrand",
			content:
				"A ecologia deve estar inscrita no ADN de tudo o que fazemos diariamente e ainda não entrou nos costumes.",
		};
	} finally {
		fetchingQuote.value = false;
	}
};

onBeforeMount(() => {
	Promise.all([fetchNews(), fetchActivities(), fetchRandomQuote()]);
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
		<div class="FAQ-section pt-4" :class="{ 'FAQ-bg-light': !isDark, 'FAQ-bg-dark': isDark }">
			<div class="faq my-5">
				<h2 class="title text-center" :class="{ 'title-text-light': !isDark, 'title-text-dark': isDark }">
					PERGUNTAS FREQUENTES
				</h2>
				<div class="accordion" role="tablist">
					<b-card v-for="question in FAQ" :key="question.id" no-body class="mb-1 card">
						<b-card-header header-tag="header" class="p-1" role="tab">
							<b-button
								block
								v-b-toggle="'collapse-' + question.id"
								variant="info"
								class="text-left question"
								>{{ question.question }}</b-button
							>
						</b-card-header>
						<b-collapse :id="'collapse-' + question.id" accordion="my-accordion" role="tabpanel">
							<b-card-body>
								<b-card-text class="text-left answer"> {{ question.answer }}</b-card-text>
							</b-card-body>
						</b-collapse>
					</b-card>
				</div>
			</div>
		</div>
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

.FAQ-section {
	background-repeat: no-repeat;
	background-position: center;
	background-position-y: -170px;
	min-height: 550px;

	& .faq {
		width: 65%;
		max-width: 905px;
		margin: 0 auto;
		min-height: 200px;
	}
}

.FAQ-bg-light {
	background-image: url("@/assets/images/illustrationFAQ.webp");
	background-color: $tertiary-color;
}

.FAQ-bg-dark {
	background-image: url("@/assets/images/illustrationFAQ-dark-theme.webp");
}

.title {
	font-family: "Alkes", sans-serif;
	font-weight: bold;
	font-size: 35px;
	margin-top: -20px;
	margin-bottom: 80px;
}

.title-text-light {
	color: $secondary-color;
}

.title-text-dark {
	color: $tertiary-color;
}

.accordion {
	background-color: $secondary-color;
	color: $tertiary-color;
	border-radius: 5px;
	padding: 10px;
	border: none;
}

.card {
	border: none;
}

.card-header {
	background-color: $secondary-color;
	color: $primary-color;
	border: none;
}

button {
	background-color: $secondary-color;
	color: $primary-color;
	border: none;
}

button:focus,
button:active,
button:hover {
	outline: none;
	box-shadow: none;
	background-color: $secondary-color;
}

.card-body {
	background-color: $secondary-color;
	color: $primary-color;
	border: none;
}

.card-text {
	color: $primary-color;
	font-size: 15px;
}

.question {
	font-family: "Panton", sans-serif;
	font-weight: bold;
	font-size: 20px;
}

.answer {
	font-family: "Panton", sans-serif;
	font-weight: normal;
	font-size: 18px;
}

.light-text {
	color: $secondary-color;
}

.dark-text {
	color: $primary-color;
}
</style>
