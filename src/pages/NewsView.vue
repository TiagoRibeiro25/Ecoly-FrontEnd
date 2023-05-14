<script setup>
import { onBeforeMount, ref } from "vue";
import { useNewsStore } from "../stores/news";
import SearchBar from "../components/SearchBar.vue";
import Header from "../components/Header.vue";
import New from "../components/New.vue";

const fetching = ref(false);
const news = ref([]);

onBeforeMount(async () => {
	fetching.value = true;
	const newsStore = useNewsStore();

	const response = await newsStore.getNews();

	if (response.success) news.value = response.data;
	fetching.value = false;
});
</script>

<template>
	<div class="col-12 d-flex align-items-center mt-5">
		<SearchBar page="News" placeholder="Pesquise por notícias" />
	</div>
	<div class="col-12">
		<Header title="NOTÍCIAS" />
	</div>
	<div class="col-12">
		<div class="news-container mx-auto px-5">
			<div
				v-if="fetching || news.length === 0"
				class="d-flex justify-content-center align-items-center"
				style="height: 50vh"
			>
				<b-spinner v-if="fetching" variant="success" label="Carregando..."></b-spinner>
				<span v-else class="error-msg">Nenhuma notícia encontrada</span>
			</div>

			<New
				v-else
				v-for="(item, index) in news"
				:key="item.id"
				:index="index"
				:id="item.id"
				:title="item.title"
				:description="item.description"
				:image="item.image"
				:creation_date="item.creation_date"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;

.news-container {
	max-width: 1400px;
}

.error-msg {
	font-family: "Panton", sans-serif;
	font-weight: 700;
	color: $primary-color;
	font-size: 1.7rem;
}
</style>
