<script setup>
import { useDark } from "@vueuse/core";
import SearchBar from "../components/SearchBar.vue";
import Header from "../components/Header.vue";

const isDark = useDark();
</script>

<template>
	<div class="col-12 d-flex align-items-center mt-5">
		<SearchBar page="Activities" placeholder="Pesquise por atividades" />
	</div>
	<div class="col-12">
		<Header title="ATIVIDADES" />
	</div>
</template>
