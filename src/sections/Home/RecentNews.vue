<script setup>
import Arrow from "../../components/Arrow.vue";
import { useDark } from "@vueuse/core";
import { formatDate, formatText } from "../../utils/formatData";
import { ref } from "vue";

const isDark = useDark();
const props = defineProps({
	news: { type: Array, required: true },
	fetching: { type: Boolean, required: true },
});

const slide = ref(0);
</script>

<template>
	<div class="news-card shadow" :class="{ 'recent-new-bg-light': !isDark, 'recent-new-bg-dark': isDark }">
		<div v-if="props.news.length > 0" class="row">
			<div class="col-lg-1 col-2">
				<Arrow
					:options="{ direction: 'left', isDisabled: slide === 0 }"
					@click="slide--"
					:disabled="slide === 0"
				/>
			</div>
			<!-- Image -->
			<div class="col-lg-4 col-0 img-container d-none d-lg-block">
				<img v-lazy="{ src: props.news[slide].image }" alt="Imagem da Notícia em Destaque" />
			</div>
			<!-- Content -->
			<div class="col-8 col-lg-6">
				<div class="row-3">
					<h2
						class="mt-5 new-title"
						:class="{ 'recent-new-text-light': !isDark, 'recent-new-title-dark': isDark }"
					>
						{{ formatText(props.news[slide].title, 44).toUpperCase() }}
					</h2>
				</div>
				<div class="row-6" style="height: 136px">
					<p
						class="mt-3 text-left new-text"
						:class="{
							'recent-new-text-light': !isDark,
							'recent-new-text-dark': isDark,
						}"
					>
						{{ formatText(props.news[slide].content, 250) }}
					</p>
				</div>
				<div class="row-3">
					<div class="row">
						<div class="col-6 text-left mt-3">
							<p
								class="recent-new-date"
								:class="{
									'recent-new-text-light': !isDark,
									'recent-new-text-dark': isDark,
								}"
							>
								{{ formatDate(props.news[slide].date_created, "yyyy-mm-dd") }}
							</p>
						</div>
						<div class="col-6 text-right mt-3">
							<router-link
								class="see-details-btn py-2 px-3"
								:class="{
									'recent-new-btn-light': !isDark,
									'recent-new-btn-dark': isDark,
								}"
								:to="{ name: 'NewDetail', params: { id: props.news[slide].id } }"
							>
								Ver Mais
							</router-link>
						</div>
					</div>
				</div>
			</div>
			<div class="col-lg-1 col-2">
				<Arrow
					:options="{ direction: 'right', isDisabled: slide === props.news.length - 1 }"
					@click="slide++"
					:disabled="slide === props.news.length - 1"
				/>
			</div>
		</div>
		<div v-else class="row">
			<div class="col-12 pt-5">
				<div v-if="props.fetching" class="mt-5 pt-5 d-flex justify-content-center align-items-center">
					<b-spinner variant="success" label="Carregando Notícias..."></b-spinner>
				</div>
				<h2
					v-else
					class="mt-5 new-title text-center pt-5"
					style="font-size: 30px; font-weight: 400"
					:class="{
						'recent-new-text-light': !isDark,
						'recent-new-text-dark': isDark,
					}"
				>
					Não existem notícias para mostrar
				</h2>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #e4f0e8;
$tertiary-color: #ffffff;
$fourth-color: #18516f;
$fifth-color: #aedcc0;

.news-card {
	background-color: $secondary-color;
	max-width: 900px;
	width: 100%;
	height: 350px;
	margin: 0 auto;
	border-radius: 25px;
}

.img-container {
	img {
		width: 100%;
		height: 250px;
		object-fit: cover;
		border-radius: 15px;
		margin-top: 50px;
	}
}

.new-title {
	font-family: "Alkes", sans-serif;
	font-size: 23px;
	font-weight: 700;
	text-align: left;
	max-height: 55px;
	overflow: hidden;
}

.new-text {
	font-family: "Panton", sans-serif;
	font-size: 16px;
	font-weight: 400;
	max-height: 120px;
	overflow: hidden;
}

.recent-new-date {
	font-family: "Panton", sans-serif;
	font-size: 0.9rem;
	font-weight: 400;
	opacity: 0.7;
}

.see-details-btn {
	border-radius: 15px;
	border: none;
	width: 100px;
	height: 40px;
	font-family: "Panton", sans-serif;
	font-size: 16px;
	font-weight: 400;
	transition: background-color 0.2s ease-in-out;
}

.recent-new-bg-light {
	background-color: $secondary-color;
}

.recent-new-bg-dark {
	background-color: $primary-color;
}

.recent-new-text-light {
	color: $primary-color;
}

.recent-new-text-dark {
	color: $tertiary-color;
}

.recent-new-title-dark {
	color: $fifth-color;
}

.recent-new-btn-light {
	background-color: $primary-color;
	color: $tertiary-color;

	&:hover {
		background-color: $fourth-color;
		text-decoration: none;
	}
}

.recent-new-btn-dark {
	background-color: $tertiary-color;
	color: $primary-color;

	&:hover {
		background-color: $fourth-color;
		color: $tertiary-color;
		text-decoration: none;
	}
}
</style>
