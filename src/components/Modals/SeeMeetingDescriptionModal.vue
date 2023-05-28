<script setup>
const emits = defineEmits(["close"]);
const props = defineProps({
	show: { type: Boolean, required: true },
	date: { type: String, required: true },
	creator: { type: Object, required: true },
	room: { type: String, required: true },
	description: { type: String, required: true },
});
</script>

<template>
	<b-modal v-model="props.show" size="lg" hide-footer @hidden="() => emits('close')">
		<div class="container">
			<div class="text-center">
				<h2>
					Informações da Reunião de <b>{{ props.date }}</b>
				</h2>
				<h3 class="mt-3">
					Reunião criada por
					<router-link :to="{ name: 'Profile', params: { id: props.creator.id } }" class="author-link">
						<b>{{ props.creator.name }}</b>
					</router-link>
				</h3>
				<h4 class="mt-3">
					Sala <b>{{ props.room }}</b>
				</h4>
			</div>

			<div class="row mt-4 mb-3 mx-5">
				<p class="modal-description text-justify">
					{{ props.description }}
				</p>
			</div>
		</div>
	</b-modal>
</template>

<style lang="scss" scoped>
h2,
h3,
h4 {
	font-family: "Panton", sans-serif;
	font-size: 1.8rem;
	font-weight: 500;
}

h3,
h4 {
	font-size: 1.3rem;
}

.author-link {
	color: #3ab175;
	text-decoration: none;

	&:hover {
		color: #18516f;
	}
}

.modal-description {
	font-family: "Panton", sans-serif;
	font-size: 1.1rem;
	font-weight: 500;
}
</style>
