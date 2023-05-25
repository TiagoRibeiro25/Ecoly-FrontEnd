<script setup>
import { useDark } from "@vueuse/core";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useUsersStore } from "@/stores/users";

const isDark = useDark();
const route = useRoute();
const delete_key = route.params.id;
const canceling = ref(false);
const msg = ref("");

const cancelSubscription = async () => {
	msg.value = "";
	canceling.value = true;
	const usersStore = useUsersStore();
	const response = await usersStore.cancelNewsLetter(delete_key);
	msg.value = response.success ? "Subscrição cancelada com sucesso!" : "Erro ao cancelar subscrição!";
	canceling.value = false;
};
</script>

<template>
	<div class="cancel-page d-flex flex-column align-items-center justify-content-center">
		<div class="text-center">
			<img
				class="cancel-logo"
				v-lazy="{
					src: !isDark
						? '../../../../../../assets/logo/logo_exp_dark.webp'
						: '../../../../../../assets/logo/logo_exp.webp',
				}"
				alt="Ecoly"
			/>
			<h2 class="cancel-subtitle" :class="{ 'text-dark-theme': isDark, 'text-light-theme': !isDark }">
				Cancelar News Letter
			</h2>
			<p
				class="cancel-description"
				:class="{ 'description-dark-theme': isDark, 'description-light-theme': !isDark }"
			>
				Tem a certeza que pretende cancelar a subscrição da nossa News Letter?
			</p>

			<div class="col-12 my-4">
				<div v-if="canceling">
					<b-spinner variant="success" label="Carregando..."></b-spinner>
				</div>
				<div v-else>
					<span class="msg" :class="{ 'text-dark-theme': isDark, 'text-light-theme': !isDark }">
						{{ msg }}
					</span>
				</div>
			</div>

			<div class="col-12">
				<button
					class="cancel-btn"
					:class="{ 'button-dark-theme': isDark, 'button-light-theme': !isDark }"
					@click="cancelSubscription"
					:disabled="canceling"
				>
					Cancelar subscrição
				</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$fourth-color: #ffffff;
$fifth-color: #333;
$sixth-color: #18516f;

.cancel-page {
	height: 100vh;
}

.cancel-logo {
	width: 300px;
	height: auto;
}

.cancel-subtitle {
	font-family: "Alkes", sans-serif;
	font-size: 1.9rem;
	font-weight: bold;
	color: #333;
	width: 60%;
	margin: 10px auto;
}

.cancel-description {
	font-family: "Panton", sans-serif;
	font-weight: 600;
	font-size: 1.3rem;
	color: rgba(52, 62, 61, 0.8);
	margin: 0 auto;
}

.cancel-tree {
	width: 200px;
	height: auto;
	display: block;
	margin: 0 auto;
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
}

.msg {
	font-family: "Panton", sans-serif;
	font-weight: 500;
	font-size: 1.1rem;
}

.text-dark-theme {
	color: $secondary-color;
}

.text-light-theme {
	color: $fifth-color;
}

.description-dark-theme {
	color: rgba(134, 181, 157, 0.8);
}

.description-light-theme {
	color: rgba(52, 62, 61, 0.8);
}

.button-light-theme {
	border: 1px solid $primary-color;
	color: $primary-color;
	background-color: $fourth-color;

	&:hover {
		background-color: $primary-color;
		color: $fourth-color;
	}
}

.button-dark-theme {
	border: 1px solid $secondary-color;
	color: $secondary-color;
	background-color: $fifth-color;

	&:hover {
		border: 1px solid $sixth-color;
		background-color: $sixth-color;
		color: $fourth-color;
	}
}

@media (max-width: 768px) {
	.cancel-subtitle {
		font-size: 1.5rem;
		width: 80%;
	}

	.cancel-description {
		font-size: 1.1rem;
		width: 70%;
	}

	.cancel-btn {
		font-size: 1rem;
	}
}

@media (max-width: 576px) {
	.cancel-subtitle {
		font-size: 1.3rem;
		width: 90%;
	}

	.cancel-description {
		font-size: 1rem;
		width: 80%;
	}

	.cancel-btn {
		font-size: 0.9rem;
	}
}

@media (max-width: 375px) {
	.cancel-subtitle {
		font-size: 1.1rem;
		width: 100%;
	}

	.cancel-description {
		font-size: 0.9rem;
		width: 90%;
	}

	.cancel-btn {
		font-size: 0.8rem;
	}
}
</style>
