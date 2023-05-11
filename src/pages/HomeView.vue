<script setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
	<h1 class="text-center">Home</h1>
	<p>Dark theme: {{ isDark }}</p>

	<button @click="toggleDark()">Toggle Color Mode</button>
</template>
