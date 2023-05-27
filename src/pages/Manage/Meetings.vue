<script setup>
import { useDark } from "@vueuse/core";
import { ref } from "vue";

const isDark = useDark();
const option = ref("realizadas");
</script>

<template>
	<div class="col-12 px-0">
		<span
			class="option mx-3"
			:class="{ 'option-selected': option === 'realizadas', 'option-dark': isDark, 'option-light': !isDark }"
			@click="option = 'realizadas'"
		>
			Realizadas
		</span>
		<span
			class="option mx-2"
			:class="{ 'option-selected': option === 'futuras', 'option-dark': isDark, 'option-light': !isDark }"
			@click="option = 'futuras'"
		>
			Futuras
		</span>
	</div>
	<div class="col-12 meetings shadow" :class="isDark ? 'meetings-dark' : 'meetings-light'"></div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #ffffff;
$quaternary-color: #3fc380;
$quinary-color: #e4f0e8;
$senary-color: #18516f;

.option {
	font-family: "Panton", sans-serif;
	font-size: 1.5rem;
	font-weight: 500;
	letter-spacing: 0.05rem;
	line-height: 1.5rem;
	opacity: 0.5;
	cursor: pointer;
	transition: all 0.3s ease-in-out;

	&-selected {
		opacity: 1;
	}

	&-dark {
		color: $secondary-color;

		&:hover {
			color: $tertiary-color;
		}
	}

	&-light {
		color: $primary-color;

		&:hover {
			color: $senary-color;
		}
	}
}

.meetings {
	height: 275px;
	border-radius: 15px;

	&-dark {
		background-color: $primary-color;
	}

	&-light {
		background-color: $quinary-color;
	}
}
</style>
