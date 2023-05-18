<script setup>
import Header from "../components/Header.vue";
import AddImages from "../components/AddImages.vue";
import AddInput from "../components/AddInput.vue";
import { ref } from "vue";
import { useNewsStore } from "../stores/news";
import { useDark } from "@vueuse/core";

const isDark = useDark();
const newsStore = useNewsStore();
const images = ref([]);
const title = ref("");
const content = ref("");
const creating = ref(false);
const msg = ref("");

const validateForm = () => {
	if (!title.value || title.value.trim().length < 10) return false;
	if (!content.value || content.value.trim().length < 100) return false;
	return !(!images.value || images.value.length === 0);
};

const addNew = async () => {
	creating.value = true;
	msg.value = "";

	const response = await newsStore.addNew({ title: title.value, content: content.value, imgs: images.value });

	if (response.success) {
		msg.value = "Notícia adicionada com sucesso!";
	} else {
		msg.value = "Erro ao adicionar notícia!";
	}

	creating.value = false;
};
</script>

<template>
	<div class="col-12 pt-3">
		<Header title="ADICIONAR NOTÍCIA" />
	</div>

	<div class="col-12 mb-4">
		<div class="mx-auto px-5" style="max-width: 1403px">
			<div class="col-12 pt-3">
				<AddImages :images="images" />
			</div>
			<div class="col-12 mt-5 px-0">
				<AddInput :text="title" placeholder="Título da notícia" type="input" @update:text="title = $event" />
			</div>
			<div class="col-12 mt-3 mb-5 px-0">
				<AddInput
					:text="content"
					placeholder="Corpo da notícia"
					type="textarea"
					@update:text="content = $event"
				/>
			</div>
			<div v-if="creating" class="col-12 mb-3 d-flex justify-content-center align-items-center">
				<b-spinner variant="success" label="Adicionando Notícia"></b-spinner>
			</div>
			<div v-if="msg" class="col-12 mb-3 d-flex justify-content-center align-items-center">
				<span class="msg" :class="isDark ? 'msg-dark' : 'msg-light'">
					{{ msg }}
				</span>
			</div>
			<div class="col-12 mt-4 d-flex justify-content-center align-items-center">
				<button
					type="submit"
					class="add-new-btn btn px-4"
					:class="isDark ? 'dark-btn' : 'light-btn'"
					:disabled="!validateForm() || creating"
					@click="addNew"
				>
					Adicionar Notícia
				</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #ffffff;
$fourth-color: #18516f;

.msg {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 600;

	&.msg-dark {
		color: $secondary-color;
	}

	&.msg-light {
		color: $primary-color;
	}
}

.add-new-btn {
	border: none;
	outline: transparent;
	border-radius: 15px;
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 600;

	&.dark-btn {
		background-color: $tertiary-color;
		color: $primary-color;

		&:hover {
			color: $tertiary-color;
			background-color: $fourth-color;
		}
	}

	&.light-btn {
		background-color: $primary-color;
		color: $tertiary-color;

		&:hover {
			background-color: $fourth-color;
		}
	}
}
</style>
