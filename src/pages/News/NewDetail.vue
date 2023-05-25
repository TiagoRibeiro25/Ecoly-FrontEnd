<script setup>
import DetailImages from "../../components/DetailImages.vue";
import DeleteModal from "../../components/Modals/DeleteModal.vue";
import NewsLetterInfo from "../../components/NewsLetterInfo.vue";
import { useDark } from "@vueuse/core";
import { useNewsStore } from "@/stores/news";
import { useUsersStore } from "@/stores/users";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate } from "@/utils/formatData";

const isDark = useDark();
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const newsStore = useNewsStore();
const usersStore = useUsersStore();
/** @type {null | {isUserAdmin: boolean, id: number, title: string, content: string, date_created: string, creator: {id: number, name: string}, images: string[]}}*/
const newItem = ref(null);
const isLoaded = ref(false);
const isUserLogged = ref(false);
const showDeleteModal = ref(false);

const leavePage = () => router.push({ name: "News" });

onBeforeMount(async () => {
	isLoaded.value = false;
	const response = await newsStore.getNew(id);

	if (!response.success) {
		await router.push({ name: "NotFound" });
		return;
	}

	newItem.value = response.data;

	// check if the user is logged
	isUserLogged.value = usersStore.isUserLoggedIn;

	// finish loading the new
	isLoaded.value = true;
});
</script>

<template>
	<div v-if="!isLoaded" class="d-flex justify-content-center align-items-center" style="height: 100vh">
		<b-spinner variant="success" label="Carregando..."></b-spinner>
	</div>

	<div v-else class="mt-3 mx-auto" style="max-width: 1400px">
		<DetailImages :images="newItem.images" />

		<div class="mt-4 px-3">
			<header class="d-flex flex-row">
				<div class="col-9">
					<h1 class="new-title" :class="isDark ? 'new-title-dark' : 'new-title-light'">
						{{ newItem.title }}
					</h1>
				</div>
				<div class="col-3 d-flex flex-column align-items-end">
					<span class="header-info text-muted">
						{{ formatDate(newItem.date_created, "yyyy-mm-dd") }}
					</span>
					<router-link
						class="header-info header-link text-muted"
						:class="isDark ? 'header-link-dark' : 'header-link-light'"
						:to="{ name: 'Profile', params: { id: newItem.creator.id } }"
					>
						{{ newItem.creator.name }}
					</router-link>
					<b-button
						v-if="newItem.isUserAdmin"
						size="sm"
						class="delete-btn rounded-circle bg-transparent border-0 mt-2"
					>
						<img
							v-lazy="{
								src: isDark ? '../assets/icons/remove-dark.svg' : '../assets/icons/remove-light.svg',
							}"
							alt="Remover notícia"
							width="25"
							height="25"
							@click="showDeleteModal = true"
						/>
					</b-button>
				</div>
			</header>
			<main class="px-3 my-5">
				<p
					class="main-text text-justify"
					:class="isDark ? 'main-text-dark' : 'main-text-light'"
					v-html="newItem.content"
				></p>
			</main>

			<NewsLetterInfo v-if="isUserLogged" />
		</div>
	</div>

	<DeleteModal
		:id="+id"
		type="new"
		text="esta notícia"
		:show="showDeleteModal"
		@close="showDeleteModal = false"
		@delete="leavePage"
	/>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #18516f;
$fourth-color: #ffffff;

.new-title {
	font-family: "Panton", sans-serif;
	font-weight: 700;
	font-size: 1.8rem;

	&-dark {
		color: $secondary-color;
	}

	&-light {
		color: $primary-color;
	}
}

.header-info {
	font-family: "Panton", sans-serif;
	font-weight: 700;
	font-size: 1rem;
	color: $primary-color;

	&.header-link {
		font-size: 0.95rem;
		text-decoration: none;

		&-dark {
			&:hover {
				color: $fourth-color !important;
			}
		}

		&-light {
			&:hover {
				color: $tertiary-color !important;
			}
		}
	}
}

.main-text {
	font-family: "Panton", sans-serif;
	font-weight: 400;
	font-size: 1.15rem;
	color: $primary-color;

	&-dark {
		color: $fourth-color;
	}

	&-light {
		color: $primary-color;
	}
}
</style>
