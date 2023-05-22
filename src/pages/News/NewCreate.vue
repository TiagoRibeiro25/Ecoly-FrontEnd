<script setup>
import Header from "../../components/Header.vue";
import AddImages from "../../components/AddImages.vue";
import AddInput from "../../components/AddInput.vue";
import { onBeforeMount, ref } from "vue";
import { useNewsStore } from "../../stores/news";
import { useUsersStore } from "../../stores/users";
import { useDark } from "@vueuse/core";
import { useRouter } from "vue-router";

const isDark = useDark();
const router = useRouter();
const newsStore = useNewsStore();
const images = ref([]);
const title = ref("");
const content = ref("");
const userLoggedName = ref("Autor");
const msg = ref("");
const creating = ref(false);
const loading = ref(true);

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
		msg.value = response.status === 413 ? "Tamanho das imagens excedido!" : "Erro ao adicionar notícia!";
	}

	creating.value = false;
};

onBeforeMount(async () => {
	const usersStore = useUsersStore();
	const response = await usersStore.getLoggedInUser();

	if (response.success && response.data.role === "admin") {
		loading.value = false;
		userLoggedName.value = response.data.name;
		return;
	}

	router.push({ name: "NotFound" });
});
</script>

<template>
	<div v-if="loading" class="col-12 d-flex justify-content-center align-items-center" style="height: 100vh">
		<b-spinner variant="success" label="Carregando"></b-spinner>
	</div>

	<div v-else>
		<div class="col-12 pt-3">
			<Header title="ADICIONAR NOTÍCIA" />
		</div>

		<div class="col-12 mb-4">
			<div class="mx-auto px-5" style="max-width: 1403px">
				<div class="col-12 pt-3">
					<AddImages :images="images" />
				</div>
				<div class="col-12 mt-5 px-0">
					<AddInput
						:text="title"
						placeholder="Título da notícia (mínimo 10 caracteres)"
						type="input"
						:isDark="isDark"
						@update:text="title = $event"
					/>
				</div>
				<div class="col-12 mt-3 mb-5 px-0">
					<AddInput
						:text="content"
						placeholder="Corpo da notícia (mínimo 100 caracteres) - HTML permitido"
						type="textarea"
						:isDark="isDark"
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
				<!-- Preview container -->
				<div class="col-12 mt-5 px-0">
					<h2
						class="preview-header-title"
						:class="isDark ? 'preview-header-title-dark' : 'preview-header-title-light'"
					>
						Pre visualização
					</h2>
					<div
						class="preview custom-scroll-bar mt-3"
						:class="isDark ? 'custom-scroll-bar-dark' : 'custom-scroll-bar-light'"
					>
						<header class="d-flex flex-row">
							<div class="col-9 px-0 d-flex align-items-center">
								<h2 class="preview-title" :class="isDark ? 'preview-title-dark' : 'preview-title-light'">
									{{ title.trim().length > 0 ? title : "Título da notícia" }}
								</h2>
							</div>
							<div class="col-3 px-0 d-flex flex-column align-items-end">
								<span class="preview-header-info text-muted">
									{{ new Date().toISOString().split("T")[0] }}
								</span>
								<span class="preview-header-info header-link text-muted"> {{ userLoggedName }} </span>
							</div>
						</header>
						<hr />
						<main>
							<p
								class="preview-main-text text-justify"
								:class="isDark ? 'preview-main-text-dark' : 'preview-main-text-light'"
								v-html="content.trim().length > 0 ? content : 'Corpo da notícia'"
							></p>
						</main>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #ffffff;
$fourth-color: #18516f;
$fifth-color: #3fc380;

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

.preview-header-title {
	font-family: "Panton", sans-serif;
	font-size: 2rem;
	font-weight: 600;

	&.preview-header-title-dark {
		color: $secondary-color;
	}

	&.preview-header-title-light {
		color: $primary-color;
	}
}

.preview {
	border: 2px solid $fifth-color;
	border-radius: 15px;
	padding: 1rem;
	max-height: 40rem;
	overflow-y: auto;
}

.custom-scroll-bar {
	&::-webkit-scrollbar {
		width: 10px;
	}
	&::-moz-scrollbar {
		width: 10px;
	}
	scrollbar-width: 10px;

	&::-webkit-scrollbar-track {
		background: transparent;
	}
	&::-moz-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background: $fifth-color;
	}
	&::-moz-scrollbar-thumb {
		background: $fifth-color;
	}

	&.custom-scroll-bar-dark {
		&::-webkit-scrollbar-thumb:hover {
			background: $secondary-color;
		}
		&::-moz-scrollbar-thumb:hover {
			background: $secondary-color;
		}
	}

	&.custom-scroll-bar-light {
		&::-webkit-scrollbar-thumb:hover {
			background: $fourth-color;
		}
		&::-moz-scrollbar-thumb:hover {
			background: $fourth-color;
		}
	}
}

.preview-title {
	font-family: "Panton", sans-serif;
	font-size: 1.8rem;
	font-weight: 600;

	&.preview-title-dark {
		color: $secondary-color;
	}

	&.preview-title-light {
		color: $primary-color;
	}
}

.preview-header-info {
	font-family: "Panton", sans-serif;
	font-size: 1rem;
	font-weight: 600;

	&.header-link {
		cursor: pointer;
	}
}

.preview-main-text {
	font-family: "Panton", sans-serif;
	font-size: 1.15rem;
	font-weight: 400;

	&.preview-main-text-dark {
		color: $tertiary-color;
	}

	&.preview-main-text-light {
		color: $primary-color;
	}
}
</style>
