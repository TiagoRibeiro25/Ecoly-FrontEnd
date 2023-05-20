<script setup>
import { useDark } from "@vueuse/core";
import { formatText } from "../../utils/formatData";

const isDark = useDark();
const props = defineProps({
	activities: { type: Array, required: true },
	fetching: { type: Boolean, required: true },
});
</script>

<template>
	<div
		class="activities mx-auto d-flex flex-row justify-content-center align-items-center"
		:class="{ 'background-dark': isDark, 'background-light': !isDark }"
	>
		<div v-if="props.activities.length === 0" class="mx-4">
			<div v-if="props.fetching" class="d-flex justify-content-center align-items-center">
				<b-spinner variant="success" label="Carregando Atividades..."></b-spinner>
			</div>

			<div
				v-else
				class="error-container d-flex justify-content-center align-items-center shadow-lg"
				:class="isDark ? 'error-container-dark' : 'error-container-light'"
			>
				<h5 class="text-center">Não existem atividades recentes.</h5>
			</div>
		</div>

		<div v-else class="mx-4" v-for="activity in props.activities" :key="activity.id">
			<div class="activity-card shadow" :class="{ 'dark-bg': isDark, 'light-bg': !isDark }">
				<header>
					<img
						class="img-fluid header-img"
						loading="lazy"
						v-lazy="{ src: activity.images }"
						alt="Atividade Recente"
						:style="{ 'border-radius': '20px 20px 0 0' }"
					/>
				</header>
				<main class="px-3 mt-2">
					<div class="title-theme">
						<h5>{{ formatText(activity.title, 30) }}</h5>
						<span>{{ activity.theme }}</span>
					</div>
					<div class="dates d-flex align-items-center justify-content-center flex-column">
						<h6>Calendarização</h6>
						<div class="text-center">
							<span class="d-block">{{ activity.initial_date }}</span>
							<span class="d-block">{{ activity.final_date }}</span>
						</div>
					</div>
					<div class="text-center mt-1">
						<router-link
							class="see-more-btn py-1 px-3"
							:to="{ name: 'ActivityDetail', params: { id: activity.id } }"
						>
							Ver Mais
						</router-link>
					</div>
				</main>
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

.activities {
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	background-size: 100% 100%;
	min-height: 500px;
	max-width: 900px;
}

.background-light {
	background-image: url("@/assets/images/illustration.webp");
}

.background-dark {
	background-image: url("@/assets/images/illustration-dark-theme.webp");
}

.header-img {
	height: 170px;
}

.activity-card {
	border-radius: 20px;
	height: 400px;
	width: 250px;

	& header img {
		width: 100%;
	}
}

.title-theme {
	height: 85px;

	& h5 {
		font-family: "Alkes", sans-serif;
		font-weight: 700;
		font-size: 1.3rem;
		margin-bottom: 0.1rem;
	}

	& span {
		border-radius: 15px;
		padding: 3px 7px;

		font-family: "Panton", sans-serif;
		font-weight: 600;
		font-size: 0.8rem;
	}
}

.dates {
	height: 90px;

	& h6 {
		font-family: "Panton", sans-serif;
		font-weight: 700;
		font-size: 1rem;
		margin-bottom: 0.1rem;
	}

	& div span {
		font-family: "Panton", sans-serif;
		font-weight: 600;
		font-size: 0.8rem;
	}
}

.see-more-btn {
	border-radius: 15px;
	font-family: "Panton", sans-serif;
	font-weight: 600;
	font-size: 0.9rem;
	text-decoration: none;
	transition: all 0.3s ease-in-out;
}

.dark-bg {
	// background-color: $primary-color;
	background-color: rgba(52, 62, 61, 0.8);
	color: $secondary-color;
	transition: background-color 0.3s ease-in-out;

	&:hover {
		background-color: $primary-color;
	}

	& .title-theme h5 {
		color: $fifth-color;
	}

	& .title-theme span {
		background-color: $fifth-color;
		color: $primary-color;
	}

	& .dates h6 {
		color: $secondary-color;
	}

	& .dates div span {
		color: $secondary-color;
	}

	& .see-more-btn {
		background-color: $tertiary-color;
		color: $primary-color;

		&:hover {
			background-color: $fourth-color;
			color: $secondary-color;
		}
	}
}

.light-bg {
	// background-color: $secondary-color;
	background-color: rgba(228, 240, 232, 0.8);
	color: $primary-color;
	transition: background-color 0.3s ease-in-out;

	&:hover {
		background-color: $secondary-color;
	}

	& .title-theme h5 {
		color: $primary-color;
	}

	& .title-theme span {
		background-color: $primary-color;
		color: $secondary-color;
	}

	& .dates h6 {
		color: $primary-color;
	}

	& .dates div span {
		color: $primary-color;
	}

	& .see-more-btn {
		background-color: $primary-color;
		color: $secondary-color;

		&:hover {
			background-color: $fourth-color;
			color: $secondary-color;
		}
	}
}

.error-container {
	width: 900px;
	height: 350px;
	border-radius: 25px;

	& h5 {
		font-family: "Alkes", sans-serif;
		font-weight: 400;
		font-size: 30px;
	}
}

.error-container-dark {
	background-color: $primary-color;
	color: $tertiary-color;
}

.error-container-light {
	background-color: $secondary-color;
	color: $primary-color;
}
</style>
