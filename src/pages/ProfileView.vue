<script setup>
import EditProfileModal from "../components/EditProfileModal.vue";
import SeedImg from "../components/SeedImg.vue";
import Badge from "../components/Badge.vue";
import { useRoute, useRouter } from "vue-router";
import { useUsersStore } from "../stores/users";
import { formatNumber } from "../utils/formatData";
import { ref, watchEffect } from "vue";

const route = useRoute();
const router = useRouter();
const isLoaded = ref(false);
const user = ref(null);
const highLightedBadge = ref(null);

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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
	<div v-if="!isLoaded" class="loading">
		<b-spinner variant="success" label="Carregando..."></b-spinner>
	</div>
	<div v-else class="px-sm-5 px-1 mt-5 mb-5">
		<!-- User Info -->
		<div class="top-info row mx-auto py-lg-0 py-sm-3 py-5 shadow">
			<!-- Profile Picture -->
			<div class="col-lg-2 d-flex justify-content-center align-items-center flex-column">
				<img
					class="img-fluid profile-pic rounded-circle"
					alt="Imagem de Perfil"
					v-lazy="{ src: user.photo }"
				/>
			</div>
			<!-- Profile Info -->
			<div class="col-lg-8 pl-lg-0 pb-lg-0 pb-3 text-lg-left text-center">
				<div>
					<h3 class="user-name mb-2 mt-4">{{ user.name }}</h3>
					<span class="user-info d-block">{{ user.email }}</span>
					<span class="user-info d-block">
						{{ user.role === "unsigned" ? "Sem cargo" : capitalize(user.role) }}
						{{ user.internal_id ? " - " + user.internal_id : "" }}
					</span>
					<span class="user-info d-block">
						{{ user.school }}
					</span>
					<div v-if="user.course">
						<span class="user-info d-block">
							{{ user.course }}
							{{ user.year ? `- ${user.year} ano` : "" }}
						</span>
					</div>
				</div>
			</div>
			<!-- Profile HighLight Badge + Edit Profile Button -->
			<div class="col-lg-2 d-flex justify-content-center align-items-center flex-column">
				<!-- HighLight Badge -->
				<div v-if="highLightedBadge" class="d-flex justify-content-center align-items-center flex-column">
					<img
						class="img-fluid badge-icon mb-2"
						v-lazy="{ src: highLightedBadge.img }"
						alt="Medalha em Destaque"
					/>
					<span class="badge-title d-block text-center">{{ highLightedBadge.title }}</span>
				</div>
				<div v-else class="d-flex justify-content-center align-items-center flex-column">
					<img
						class="empty-badge"
						src="@/assets/logo/logo.webp"
						alt="Nenhuma medalha em destaque"
						:class="{ 'mb-3': !user.isLoggedUser }"
					/>
				</div>
				<!-- Edit Profile Button -->
				<div v-if="user.isLoggedUser" class="mt-3">
					<b-button class="edit-profile-btn px-2" size="sm" @click="$bvModal.show('edit-profile-modal')">
						Editar Perfil
					</b-button>
				</div>
			</div>
		</div>
		<!-- Seeds Info -->
		<div
			class="seeds-info row mx-auto py-lg-0 py-sm-3 py-5 mt-5 shadow d-flex justify-content-center align-items-center"
		>
			<div class="col-6 d-lg-block d-none">
				<h2 class="ml-4 title">Sementes</h2>
			</div>
			<div class="col-lg-3 col-6">
				<div class="row justify-content-center align-items-center">
					<h2 class="info">Mensal: {{ formatNumber(user.seeds.month) }}</h2>
					<SeedImg />
				</div>
			</div>
			<div class="col-lg-3 col-6">
				<div class="row justify-content-center align-items-center">
					<h2 class="info">Total: {{ formatNumber(user.seeds.total) }}</h2>
					<SeedImg />
				</div>
			</div>
		</div>
		<!-- Badges Info -->
		<!-- Unlocked -->
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
			<!-- Locked -->
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
		<!-- Edit Profile Modal -->
		<EditProfileModal v-if="user.isLoggedUser" :user="user" id="edit-profile-modal" />
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #6ea952;
$quaternary-color: #3fc380;
$quinary-color: #303a39;

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
}

.top-info {
	background-color: $primary-color;
	border-radius: 20px;
	min-height: 180px;
	max-width: 1400px;
}

.profile-pic {
	max-width: 150px;
	max-height: 150px;
	background-color: $tertiary-color;
}

.user-name,
.user-info {
	font-family: "Panton", sans-serif;
	font-size: 1.7rem;
	font-weight: 700;
	color: $secondary-color;
}

.user-info {
	font-size: 1rem;
	font-weight: 400;
}

.badge-title {
	font-family: "Panton", sans-serif;
	font-size: 0.9rem;
	font-weight: 700;
	color: $secondary-color;
}

.badge-icon {
	width: 60px;
	height: 70px;
}

.empty-badge {
	width: 65px;
	height: 90px;
	background-image: url("@/assets/logo/logo_dark.webp");
}

.edit-profile-btn {
	background: transparent;
	border: 1px solid $secondary-color;
	color: $secondary-color;
	font-family: "Panton", sans-serif;
	font-size: 0.9rem;
	font-weight: 700;
	border-radius: 20px;

	&:hover {
		background-color: $secondary-color;
		color: $primary-color;
	}
}

.seeds-info {
	background-color: $primary-color;
	border-radius: 20px;
	min-height: 100px;
	max-width: 1400px;
}

.title {
	color: $secondary-color;
	font-family: "Alkes", sans-serif;
	font-size: 1.7rem;
	font-weight: 700;
}

.info {
	color: $secondary-color;
	font-family: "Panton", sans-serif;
	font-size: 1.5rem;
	font-weight: 600;
	margin-top: 5px;
}

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
		background: $secondary-color;
	}
	&::-moz-scrollbar-thumb {
		background: $secondary-color;
	}

	&::-webkit-scrollbar-thumb:hover {
		background: $quaternary-color;
	}
	&::-moz-scrollbar-thumb:hover {
		background: $quaternary-color;
	}
}
</style>
