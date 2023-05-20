<script setup>
import DetailImages from "../components/DetailImages.vue";
import DeleteModal from "../components/DeleteModal.vue";
import { useDark } from "@vueuse/core";
import { useNewsStore } from "../stores/news";
import { useUsersStore } from "../stores/users";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate } from "../utils/formatData";

const isDark = useDark();
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const newsStore = useNewsStore();
const usersStore = useUsersStore();
/** @type {{isUserAdmin: boolean, id: number, title: string, content: string, date_created: string, creator: {id: number, name: string}, images: string[]}}*/
const newItem = ref(null);
const isLoaded = ref(false);
const isUserLogged = ref(false);
const isUserSubscribed = ref(false);
const subscribing = ref(false);
const msg = ref("");
const showDeleteModal = ref(false);

const leavePage = () => router.push({ name: "News" });

const subscribe = async () => {
	msg.value = "";
	subscribing.value = true;

	const response = await usersStore.subscribeNewsLetter();
	if (!response.success) {
		msg.value = response.message;
		subscribing.value = false;
		return;
	}

	isUserSubscribed.value = true;
	subscribing.value = false;
};

onBeforeMount(async () => {
	isLoaded.value = false;
	const response = await newsStore.getNew(id);

	if (!response.success) {
		router.push({ name: "NotFound" });
		return;
	}

	newItem.value = response.data;

	// check if the user is logged
	isUserLogged.value = usersStore.isUserLoggedIn;

	// finish loading the new
	isLoaded.value = true;

	// check if the user is subscribed to the newsletter
	if (isUserLogged.value) {
		const isSubscribed = await newsStore.isSubscribed();
		isUserSubscribed.value = isSubscribed.success;
	}
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
						{{ formatDate(newItem.date_created) }}
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
						class="delete-btn rounded-circle bg-transparent border-0"
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

			<!-- subscribe to the newsletter -->
			<footer v-if="isUserLogged" class="px-3 d-flex flex-column align-items-center">
				<h2 class="new-title text-center pt-5 pb-3" :class="isDark ? 'new-title-dark' : 'new-title-light'">
					{{ isUserSubscribed ? "Já estás inscrito na newsletter" : "Subscreve-te à newsletter" }}
				</h2>
				<div
					v-if="subscribing || msg.length > 0"
					class="col-12 my-4 d-flex justify-content-center align-items-center"
				>
					<div v-if="subscribing">
						<b-spinner variant="success" label="Carregando..."></b-spinner>
					</div>
					<div v-else>
						<span class="msg" :class="{ 'text-dark-theme': isDark, 'text-light-theme': !isDark }">
							{{ msg }}
						</span>
					</div>
				</div>
				<button
					v-if="!isUserSubscribed"
					class="btn cancel-btn mb-5"
					:class="isDark ? 'cancel-btn-dark' : 'cancel-btn-light'"
					:disabled="subscribing"
					@click="subscribe"
				>
					Subscrever
				</button>
			</footer>
		</div>
	</div>

	<DeleteModal
		:id="id"
		type="new"
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
$fifth-color: #333;

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

.cancel-btn {
	font-family: "Panton", sans-serif;
	font-weight: 500;
	font-size: 1.1rem;

	display: inline-block;
	padding: 0.5rem 1rem;
	border-radius: 0.25rem;
	text-decoration: none;
	transition: all 0.3s;

	&-light {
		border: 1px solid $primary-color;
		color: $primary-color;
		background-color: $fourth-color;

		&:hover {
			background-color: $primary-color;
			color: $fourth-color;
		}
	}

	&-dark {
		border: 1px solid $secondary-color;
		color: $secondary-color;
		background-color: $fifth-color;

		&:hover {
			border: 1px solid $tertiary-color;
			background-color: $tertiary-color;
			color: $fourth-color;
		}
	}
}

.msg {
	font-family: "Panton", sans-serif;
	font-weight: 500;
	font-size: 1.1rem;

	&.text-dark-theme {
		color: $fourth-color;
	}

	&.text-light-theme {
		color: $primary-color;
	}
}
</style>
