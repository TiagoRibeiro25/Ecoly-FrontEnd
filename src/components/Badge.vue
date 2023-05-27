<script setup>
import { useUsersStore } from "@/stores/users";
import { useDark } from "@vueuse/core";

const isDark = useDark();
const props = defineProps({
	index: { type: Number, required: true },
	id: { type: Number, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	img: { type: String, required: true },
	percentage: { type: Number, required: true },
	isUnlocked: { type: Boolean, required: true },
	isUserProfile: { type: Boolean, required: true },
	highlightedBadge: { type: Object, required: true },
	updateHighLightedBadge: { type: Function, required: true },
});

/** @param {{id: number, title: string, description: string, img: string, percentage: number}} badge */
const changeHighlightedBadge = async (badge) => {
	if (!props.isUserProfile || !props.isUnlocked) return;

	const usersStore = useUsersStore();
	usersStore.updateUserData({ highlightBadgeId: badge.id });

	props.updateHighLightedBadge(badge);
};

const contrastBg = (index) => index % 2 === 0;
</script>

<template>
	<div
		class="row pl-4 py-3"
		:class="{
			'bg-darker': contrastBg(props.index) && isDark,
			'bg-lighter': contrastBg(props.index) && !isDark,
			disabled: !isUnlocked,
		}"
	>
		<!-- Icon -->
		<div class="col-2 text-center">
			<img
				class="img-fluid badge-icon"
				:class="{ 'unlocked-badge': isUnlocked && isUserProfile, 'badge-icon-light': !isDark }"
				v-lazy="{ src: props.img }"
				alt="Badge Icon"
				@click="
					changeHighlightedBadge({
						id: props.id,
						title: props.title,
						description: props.description,
						img: props.img,
						percentage: props.percentage,
					})
				"
			/>
		</div>

		<div class="col-7">
			<div class="row">
				<!-- Title -->
				<div class="col-12">
					<h3
						class="badge-title"
						:class="{
							'text-success': props.id === highlightedBadge?.id,
							'badge-title-dark': isDark,
							'badge-title-light': !isDark,
						}"
					>
						{{ props.title }}
					</h3>
				</div>
				<!-- Description -->
				<div class="col-12">
					<p
						class="badge-description"
						:class="{
							'text-success': props.id === highlightedBadge?.id,
							'badge-description-dark': isDark,
							'badge-description-light': !isDark,
						}"
					>
						{{ props.description }}
					</p>
				</div>
			</div>
		</div>

		<!-- Percentage of Users that unlocked it -->
		<div class="col-2">
			<div class="row mt-2">
				<div class="col-12 text-center">
					<span class="badge-percentage" :class="isDark ? 'badge-percentage-dark' : 'badge-percentage-light'"
						>{{ props.percentage }}%</span
					>
				</div>
				<div class="col-12">
					<div class="progress">
						<div
							class="progress-bar bg-success"
							role="progressbar"
							:style="{ width: props.percentage + '%' }"
						></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #dde9e1;
$secondary-color: #aedcc0;
$tertiary-color: #6ea952;
$quinary-color: #303a39;

.disabled {
	opacity: 0.5;
}

.badge-icon {
	width: 70px;
	height: 80px;

	&-light {
		filter: brightness(0.7);
	}
}

.unlocked-badge {
	transition: transform 0.2s ease-in-out;

	&:hover {
		cursor: pointer;
		transform: scale(1.1);
	}
}

.badge-title,
.badge-description,
.badge-percentage {
	font-family: "Panton", sans-serif;
	font-size: 1.3rem;
	font-weight: 700;

	&-dark {
		color: $secondary-color;
	}

	&-light {
		color: $quinary-color;
	}
}

.badge-description {
	font-size: 1rem;
	font-weight: 400;
}

.badge-percentage {
	font-size: 1rem;
}

.bg-darker {
	background-color: $quinary-color;
}

.bg-lighter {
	background-color: $primary-color;
}

.progress {
	height: 10px !important;
	background-color: $secondary-color !important;
}

.progress-bar {
	background-color: $tertiary-color !important;
}
</style>
