<script setup>
import { useDark } from "@vueuse/core";
import SearchBar from "../components/SearchBar.vue";
import ThemeSwitcher from "../components/ThemeSwitcher.vue";
import Header from "../components/Header.vue";

const isDark = useDark();
</script>

<template>
	<div class="d-flex flex-row mt-5">
		<div class="col-9 d-flex align-items-end">
			<SearchBar />
		</div>
		<div class="col-3 d-flex align-items-center justify-content-center">
			<ThemeSwitcher />
		</div>
	</div>
	<div class="col-12">
		<Header title="DESTAQUES" />
	</div>
</template>
