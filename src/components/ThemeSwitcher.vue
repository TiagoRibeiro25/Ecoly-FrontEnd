<script setup>
import Switches from "vue-switches";
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
	<div class="d-flex align-items-center justify-content-center pt-2">
		<Switches v-model="isDark" color="success" theme="bootstrap" />
	</div>
</template>
