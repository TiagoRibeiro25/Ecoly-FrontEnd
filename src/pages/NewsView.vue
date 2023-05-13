<script setup>
import { useDark } from "@vueuse/core";
import SearchBar from "../components/SearchBar.vue";
import Header from "../components/Header.vue";

const isDark = useDark();
</script>

<template>
	<div class="col-12 d-flex align-items-center mt-5">
		<SearchBar page="News" placeholder="Pesquise por notícias" />
	</div>
	<div class="col-12">
		<Header title="NOTÍCIAS" />
	</div>
</template>
