<script setup>
import { useDark } from "@vueuse/core";
import Header from "../../components/Header.vue";

const isDark = useDark();
</script>

<template>
	<div class="col-12 mt-5">
		<Header title="DASHBOARD" />
	</div>
</template>
