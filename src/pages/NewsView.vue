<script setup>
import { useDark } from "@vueuse/core";
import { ref, watchEffect } from "vue";
import { useNewsStore } from "../stores/news";
import SearchBar from "../components/SearchBar.vue";
import Header from "../components/Header.vue";
import New from "../components/New.vue";
import DeleteModal from "../components/DeleteModal.vue";
import ChangeViewButton from "../components/ChangeViewButton.vue";

const isDark = useDark();
const fetching = ref(false);
const news = ref([]);
const isUserAdmin = ref(false);

// delete modal variables
const showDeleteModal = ref(false);
const idToDelete = ref(null);
const fetchAgain = ref(false);

const showModal = (id) => {
	idToDelete.value = id;
	showDeleteModal.value = true;
};

watchEffect(async () => {
	if (!fetchAgain.value && news.value.length !== 0) return;

	fetchAgain.value = false;
	fetching.value = true;
	news.value = [];

	const newsStore = useNewsStore();
	/** @type {{success: boolean, data: {isUserAdmin: boolean, news: Array<{id: string, creator_id: id, title: string, content: string, date_created: string, image: string}>}}} */
	const response = await newsStore.getNews();

	if (response.success) {
		news.value = response.data.news;
		isUserAdmin.value = response.data.isUserAdmin;
	}

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
	<div v-if="isUserAdmin" class="col-12 mb-4">
		<div class="news-container mx-auto px-5">
			<ChangeViewButton text="Adicionar notícia" to="NewCreate" iconImg="../assets/icons/add.svg" />
		</div>
	</div>
	<div class="col-12">
		<div class="news-container mx-auto px-5">
			<div
				v-if="fetching || news.length === 0"
				class="d-flex justify-content-center align-items-center"
				style="height: 50vh"
			>
				<b-spinner v-if="fetching" variant="success" label="Carregando..."></b-spinner>
				<span v-else class="error-msg" :class="isDark ? 'error-msg-dark' : 'error-msg-light'">
					Nenhuma notícia encontrada
				</span>
			</div>

			<div v-else>
				<New
					v-for="(item, index) in news"
					:key="item.id"
					:index="index"
					:id="item.id"
					:title="item.title"
					:content="item.content"
					:date_created="item.date_created"
					:image="item.image"
					:isUserAdmin="isUserAdmin"
					@delete="showModal"
				/>
			</div>
		</div>
	</div>

	<DeleteModal
		:id="idToDelete"
		type="new"
		:show="showDeleteModal"
		@close="showDeleteModal = false"
		@delete="() => (fetchAgain = true)"
	/>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;

.news-container {
	max-width: 1400px;
}

.error-msg {
	font-family: "Panton", sans-serif;
	font-weight: 700;
	font-size: 1.7rem;
}

.error-msg-dark {
	color: $secondary-color;
}

.error-msg-light {
	color: $primary-color;
}
</style>
