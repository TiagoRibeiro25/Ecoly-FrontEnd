<script setup>
import Badge from "@/components/Badge.vue";
import { useRoute, useRouter } from "vue-router";
import { useUsersStore } from "../../stores/users";
import { ref, watchEffect } from "vue";
import UserInfo from "./UserInfo.vue";
import SeedsInfo from "./SeedsInfo.vue";

const route = useRoute();
const router = useRouter();
const isLoaded = ref(false);
const user = ref(null);
const highLightedBadge = ref(null);

const updateHighLightedBadge = (badge) => (highLightedBadge.value = badge);

watchEffect(async () => {
	isLoaded.value = false;
	const id = route.params.id;

	const usersStore = useUsersStore();
	const response = await usersStore.getUserProfile(id);
	if (!response.success) {
		if (id === "me") router.push({ name: "Authenticate" });
		else router.push({ name: "NotFound" });
		return;
	}

	user.value = response.data;
	highLightedBadge.value = response.data.badges.unlocked.find(
		(badge) => badge.id === response.data.badges.highlighted
	);
	isLoaded.value = true;
});
</script>

<template>
	<div v-if="!isLoaded" class="d-flex justify-content-center align-items-center" style="height: 100vh">
		<b-spinner variant="success" label="Carregando..."></b-spinner>
	</div>
	<div v-else class="px-sm-5 px-1 mt-5 mb-5">
		<UserInfo :user="user" :highLightedBadge="highLightedBadge" />
		<SeedsInfo :user="user" />
		<!-- Unlocked Badges -->
		<div class="badges row mx-auto py-lg-0 py-5 mt-lg-5 d-flex justify-content-center align-items-center">
			<div class="col-xl-6 px-0 pr-xl-4">
				<div class="badges-info py-3 shadow">
					<div class="row">
						<div class="col-9 d-flex align-items-center">
							<h2 class="ml-4 pl-3 badges-info-title">Medalhas desbloqueadas</h2>
						</div>
						<div class="col-3 text-center pr-5">
							<span class="percentage-info"> % de usuários com a medalha </span>
						</div>
					</div>
					<div class="badges-list mt-2">
						<div v-for="(badge, index) in user.badges.unlocked" :key="badge.id">
							<Badge
								:index="index"
								:id="badge.id"
								:title="badge.title"
								:description="badge.description"
								:img="badge.img"
								:percentage="badge.percentageUnlocked"
								:isUnlocked="true"
								:isUserProfile="user.isLoggedUser"
								:highlightedBadge="highLightedBadge"
								:updateHighLightedBadge="updateHighLightedBadge"
							/>
						</div>
					</div>
				</div>
			</div>
			<!-- Locked Badges -->
			<div class="col-xl-6 px-0 pl-xl-4">
				<div class="badges-info py-3 shadow mt-xl-0 mt-5">
					<div class="row">
						<div class="col-9 d-flex align-items-center">
							<h2 class="ml-4 pl-3 badges-info-title">Medalhas bloqueadas</h2>
						</div>
						<div class="col-3 text-center pr-5">
							<span class="percentage-info"> % de usuários com a medalha </span>
						</div>
					</div>
					<div class="badges-list mt-2">
						<div v-for="(badge, index) in user.badges.locked" :key="badge.id">
							<Badge
								:index="index"
								:id="badge.id"
								:title="badge.title"
								:description="badge.description"
								:img="badge.img"
								:percentage="badge.percentageUnlocked"
								:isUnlocked="false"
								:isUserProfile="user.isLoggedUser"
								:highlightedBadge="highLightedBadge"
								:updateHighLightedBadge="updateHighLightedBadge"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #6ea952;
$quaternary-color: #3fc380;
$quinary-color: #303a39;

.badges {
	max-width: 1400px;
}

.badges-info {
	min-height: 500px;
	background-color: $primary-color;
	border-radius: 20px;
}

.badges-info-title {
	color: $secondary-color;
	font-family: "Alkes", sans-serif;
	font-size: 1.55rem;
	font-weight: 700;
}

.percentage-info {
	color: $secondary-color;
	font-family: "Alkes", sans-serif;
	font-size: 0.8rem;
	font-weight: 700;
}

.badges-list {
	overflow-y: scroll;
	overflow-x: hidden;
	height: 430px;

	&::-webkit-scrollbar {
		width: 10px;
	}
	&::-moz-scrollbar {
		width: 10px;
	}
	scrollbar-width: 10px;

	&::-webkit-scrollbar-track {
		background: $quinary-color;
	}
	&::-moz-scrollbar-track {
		background: $quinary-color;
	}

	&::-webkit-scrollbar-thumb {
		background: $quaternary-color;
	}
	&::-moz-scrollbar-thumb {
		background: $quaternary-color;
	}

	&::-webkit-scrollbar-thumb:hover {
		background: $secondary-color;
	}
	&::-moz-scrollbar-thumb:hover {
		background: $secondary-color;
	}
}
</style>
