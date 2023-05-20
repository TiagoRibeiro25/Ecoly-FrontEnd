<script setup>
import { useDark } from "@vueuse/core";
import FAQcontent from "../../utils/FAQcontent";

const isDark = useDark();
</script>

<template>
	<div class="FAQ-section pt-4" :class="{ 'FAQ-bg-light': !isDark, 'FAQ-bg-dark': isDark }">
		<div class="faq my-5">
			<h2 class="title text-center" :class="{ 'title-text-light': !isDark, 'title-text-dark': isDark }">
				PERGUNTAS FREQUENTES
			</h2>
			<div class="accordion" role="tablist">
				<b-card v-for="question in FAQcontent" :key="question.id" no-body class="mb-1 card">
					<b-card-header header-tag="header" class="p-1" role="tab">
						<b-button
							block
							v-b-toggle="'collapse-' + question.id"
							variant="info"
							class="text-left question"
							>{{ question.question }}</b-button
						>
					</b-card-header>
					<b-collapse :id="'collapse-' + question.id" accordion="my-accordion" role="tabpanel">
						<b-card-body>
							<b-card-text class="text-left answer"> {{ question.answer }}</b-card-text>
						</b-card-body>
					</b-collapse>
				</b-card>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #f8f9fa;
$secondary-color: #343e3d;
$tertiary-color: #aedcc0;
.FAQ-section {
	background-repeat: no-repeat;
	background-position: center;
	background-position-y: -170px;
	min-height: 550px;

	& .faq {
		width: 65%;
		max-width: 905px;
		margin: 0 auto;
		min-height: 200px;
	}
}

.FAQ-bg-light {
	background-image: url("@/assets/images/illustrationFAQ.webp");
	background-color: $tertiary-color;
}

.FAQ-bg-dark {
	background-image: url("@/assets/images/illustrationFAQ-dark-theme.webp");
}

.title {
	font-family: "Alkes", sans-serif;
	font-weight: bold;
	font-size: 35px;
	margin-top: -20px;
	margin-bottom: 80px;
}

.title-text-light {
	color: $secondary-color;
}

.title-text-dark {
	color: $tertiary-color;
}

.accordion {
	background-color: $secondary-color;
	color: $tertiary-color;
	border-radius: 5px;
	padding: 10px;
	border: none;
}

.card {
	border: none;
}

.card-header {
	background-color: $secondary-color;
	color: $primary-color;
	border: none;
}

button {
	background-color: $secondary-color;
	color: $primary-color;
	border: none;
}

button:focus,
button:active,
button:hover {
	outline: none;
	box-shadow: none;
	background-color: $secondary-color;
}

.card-body {
	background-color: $secondary-color;
	color: $primary-color;
	border: none;
}

.card-text {
	color: $primary-color;
	font-size: 15px;
}

.question {
	font-family: "Panton", sans-serif;
	font-weight: bold;
	font-size: 20px;
}

.answer {
	font-family: "Panton", sans-serif;
	font-weight: normal;
	font-size: 18px;
}

.light-text {
	color: $secondary-color;
}

.dark-text {
	color: $primary-color;
}
</style>
