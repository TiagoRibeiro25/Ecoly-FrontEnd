<script setup>
import { useDark } from "@vueuse/core";

const isDark = useDark();
</script>

<template>
	<div class="error-page d-flex flex-column align-items-center justify-content-center">
		<div class="text-center">
			<img
				class="error-logo"
				v-lazy="{
					src: !isDark
						? '../../../../../../assets/logo/logo_exp_dark.webp'
						: '../../../../../../assets/logo/logo_exp.webp',
				}"
				alt="Ecoly"
			/>
			<h2 class="error-subtitle" :class="{ 'title-dark-theme': isDark, 'title-light-theme': !isDark }">
				Ups, a menos que você tenha uma máquina do tempo, esse conteúdo não está disponível.
			</h2>
			<p
				class="error-description"
				:class="{ 'description-dark-theme': isDark, 'description-light-theme': !isDark }"
			>
				Mas não se preocupe, há muitas outras maneiras de se envolver na comunidade ecológica e ajudar a
				proteger o planeta.
			</p>

			<img
				class="error-tree mt-2 img-fluid"
				v-lazy="{ src: '../../../../../../assets/images/tree.gif' }"
				alt="animated tree"
			/>

			<router-link
				class="error-link"
				:to="{ name: 'Home' }"
				:class="{ 'button-dark-theme': isDark, 'button-light-theme': !isDark }"
			>
				Voltar para a página inicial
			</router-link>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$fourth-color: #ffffff;
$fifth-color: #333;
$sixth-color: #18516f;

.error-page {
	height: 100vh;
}

.error-logo {
	width: 300px;
	height: auto;
}

.error-subtitle {
	font-family: "Alkes", sans-serif;
	font-size: 1.9rem;
	font-weight: bold;
	color: #333;
	width: 60%;
	margin: 0 auto;
	margin-top: 10px;
	margin-bottom: 10px;
}

.error-description {
	font-family: "Panton", sans-serif;
	font-weight: 600;
	font-size: 1.3rem;
	color: rgba(52, 62, 61, 0.8);
	width: 50%;
	margin: 0 auto;
}

.error-tree {
	width: 200px;
	height: auto;
	display: block;
	margin: 0 auto;
}

.error-link {
	font-family: "Panton", sans-serif;
	font-weight: 500;
	font-size: 1.1rem;

	display: inline-block;
	padding: 0.5rem 1rem;
	border-radius: 0.25rem;
	text-decoration: none;
	transition: all 0.3s;
}

.title-dark-theme {
	color: $secondary-color;
}

.title-light-theme {
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
	.error-subtitle {
		font-size: 1.5rem;
		width: 80%;
	}

	.error-description {
		font-size: 1.1rem;
		width: 70%;
	}

	.error-link {
		font-size: 1rem;
	}
}

@media (max-width: 576px) {
	.error-subtitle {
		font-size: 1.3rem;
		width: 90%;
	}

	.error-description {
		font-size: 1rem;
		width: 80%;
	}

	.error-link {
		font-size: 0.9rem;
	}
}

@media (max-width: 375px) {
	.error-subtitle {
		font-size: 1.1rem;
		width: 100%;
	}

	.error-description {
		font-size: 0.9rem;
		width: 90%;
	}

	.error-link {
		font-size: 0.8rem;
	}
}
</style>
