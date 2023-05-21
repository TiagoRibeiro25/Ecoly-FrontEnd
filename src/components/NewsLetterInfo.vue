<script setup>
import { useDark } from "@vueuse/core";
import { useUsersStore } from "../stores/users";
import { onBeforeMount, ref } from "vue";
import { useNewsStore } from "../stores/news";

const isDark = useDark();
const usersStore = useUsersStore();
const newsStore = useNewsStore();
const subscribing = ref(false);
const msg = ref("");
const isUserSubscribed = ref(false);
const deleteKey = ref("");

const subscribe = async () => {
	msg.value = "";
	subscribing.value = true;

	const response = await usersStore.subscribeNewsLetter();
	if (!response.success) {
		msg.value = response.message;
		subscribing.value = false;
		return;
	}

	subscribing.value = false;
	isUserSubscribed.value = true;
};

onBeforeMount(async () => {
	const isSubscribed = await newsStore.isSubscribed();
	isUserSubscribed.value = isSubscribed.success;
	deleteKey.value = isSubscribed.deleteKey;
});
</script>

<template>
	<footer class="px-3 d-flex flex-column align-items-center">
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
			class="btn news-letter-btn mb-5"
			:class="isDark ? 'news-letter-btn-dark' : 'news-letter-btn-light'"
			:disabled="subscribing"
			@click="subscribe"
		>
			Subscrever
		</button>
		<router-link
			v-else
			class="btn news-letter-btn mb-5"
			:class="isDark ? 'news-letter-btn-dark' : 'news-letter-btn-light'"
			:to="{ name: 'Unsubscribe', params: { id: deleteKey } }"
		>
			Cancelar subscrição
		</router-link>
	</footer>
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

.news-letter-btn {
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
