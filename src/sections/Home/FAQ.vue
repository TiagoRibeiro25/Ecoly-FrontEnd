<script setup>
import { useDark } from "@vueuse/core";
import FAQcontent from "../../utils/FAQcontent";

const isDark = useDark();
</script>

<template>
	<div class="FAQ-section pt-4" :class="{ 'FAQ-bg-light': !isDark, 'FAQ-bg-dark': isDark }">
		<div class="faq my-5 mx-auto px-3">
			<h2 class="title text-center" :class="{ 'title-light': !isDark, 'title-dark': isDark }">
				PERGUNTAS FREQUENTES
			</h2>
			<div class="accordion" role="tablist" :class="isDark ? 'accordion-dark' : 'accordion-light'">
				<b-card v-for="question in FAQcontent" :key="question.id" no-body class="mb-1 card">
					<b-card-header
						header-tag="header"
						class="p-1 border-0"
						:class="isDark ? 'card-header-dark' : 'card-header-light'"
						role="tab"
					>
						<b-button
							block
							v-b-toggle="'collapse-' + question.id"
							variant="info"
							class="text-left question border-0"
							:class="isDark ? 'question-dark' : 'question-light'"
							>{{ question.question }}</b-button
						>
					</b-card-header>
					<b-collapse :id="'collapse-' + question.id" accordion="my-accordion" role="tabpanel">
						<b-card-body class="border-0" :class="isDark ? 'card-body-dark' : 'card-body-light'">
							<b-card-text class="answer"> {{ question.answer }}</b-card-text>
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
$quaternary-color: #e4f0e8;
$quinary-color: #2a3231;

.FAQ-section {
	background-repeat: no-repeat;
	background-position: center;
	background-position-y: -170px;
	min-height: 550px;

	& .faq {
		max-width: 905px;
		margin: 0 auto;
		min-height: 200px;
	}
}

.FAQ-bg-light {
	background-image: url("@/assets/images/illustrationFAQ.webp");
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

	&-dark {
		color: $tertiary-color;
	}

	&-light {
		color: $secondary-color;
	}
}

.accordion {
	border-radius: 5px;
	padding: 10px;
	border: none;

	&-dark {
		background-color: $secondary-color;
	}

	&-light {
		background-color: $quaternary-color;
	}
}

.card {
	border: none;
}

.card-header {
	&-dark {
		background-color: $secondary-color;
	}

	&-light {
		background-color: $quaternary-color;
	}
}

.question {
	font-family: "Panton", sans-serif;
	font-weight: bold;
	font-size: 19px;

	&-dark {
		background-color: $secondary-color;
		color: $primary-color;

		&:focus,
		&:active,
		&:hover {
			outline: none;
			box-shadow: none;
			background-color: $quinary-color;
		}

		&:focus,
		&:active {
			background-color: $secondary-color;
		}
	}

	&-light {
		background-color: $quaternary-color;
		color: $secondary-color;

		&:focus,
		&:active,
		&:hover {
			outline: none;
			box-shadow: none;
			background-color: $tertiary-color;
			color: $secondary-color;
		}

		&:focus,
		&:active {
			background-color: $quaternary-color;
		}
	}
}

.card-body {
	&-dark {
		background-color: $secondary-color;
		color: $primary-color;
	}

	&-light {
		background-color: $quaternary-color;
		color: $secondary-color;
	}
}

.answer {
	font-family: "Panton", sans-serif;
	font-weight: normal;
	font-size: 17px;
}
</style>
