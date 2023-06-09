<script setup>
import { useDark } from "@vueuse/core";
import { useRouter } from "vue-router";
import EditProfileModal from "../../components/Modals/EditProfileModal.vue";
import { useActivitiesStore } from "../../stores/activities";
import { useMeetingsStore } from "../../stores/meetings";
import { useNewsStore } from "../../stores/news";
import { useUsersStore } from "../../stores/users";

const isDark = useDark();
const props = defineProps({
	user: { type: Object, required: true },
	highLightedBadge: { type: Object, required: false },
});
const router = useRouter();

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const signOut = async () => {
	const usersStore = useUsersStore();
	const newsStore = useNewsStore();
	const activitiesStore = useActivitiesStore();
	const meetingsStore = useMeetingsStore();

	usersStore.signOut();
	newsStore.resetData();
	activitiesStore.resetData();
	meetingsStore.resetData();
	await router.push({ name: "Authenticate" });
};
</script>

<template>
	<div
		class="top-info row mx-auto py-xl-0 py-sm-3 py-3 shadow"
		:class="isDark ? 'top-info-dark' : 'top-info-light'"
	>
		<!-- Profile Picture -->
		<div class="col-xl-2 d-flex justify-content-center align-items-center flex-column">
			<img
				class="img-fluid profile-pic rounded-circle"
				:class="isDark ? 'profile-pic-dark' : 'profile-pic-light'"
				alt="Imagem de Perfil"
				width="150"
				height="150"
				v-lazy="{ src: props.user.photo }"
			/>
		</div>
		<!-- Profile Info -->
		<div class="col-xl-8 pl-xl-0 pb-xl-0 pb-3 text-xl-left text-center">
			<div>
				<h3 class="user-name mb-2 mt-4" :class="isDark ? 'user-name-dark' : 'user-name-light'">
					{{ props.user.name }}
				</h3>
				<span class="user-info d-block" :class="isDark ? 'user-info-dark' : 'user-info-light'">{{
					props.user.email
				}}</span>
				<span class="user-info d-block" :class="isDark ? 'user-info-dark' : 'user-info-light'">
					{{ props.user.role === "unsigned" ? "Sem cargo" : capitalize(props.user.role) }}
					{{ props.user.internal_id ? " - " + props.user.internal_id : "" }}
				</span>
				<span class="user-info d-block" :class="isDark ? 'user-info-dark' : 'user-info-light'">
					{{ props.user.school }}
				</span>
				<div v-if="props.user.course">
					<span class="user-info d-block" :class="isDark ? 'user-info-dark' : 'user-info-light'">
						{{ props.user.course }}
						{{ props.user.year ? `- ${props.user.year} ano` : "" }}
					</span>
				</div>
			</div>
		</div>
		<!-- Profile HighLight Badge + Edit Profile Button -->
		<div class="col-xl-2 d-flex justify-content-center align-items-center flex-column">
			<!-- HighLight Badge -->
			<div v-if="highLightedBadge" class="d-flex justify-content-center align-items-center flex-column">
				<img
					class="img-fluid badge-icon mb-2"
					v-lazy="{ src: highLightedBadge.img }"
					width="60"
					height="70"
					alt="Medalha em Destaque"
				/>
				<span
					class="badge-title d-block text-center"
					:class="isDark ? 'badge-title-dark' : 'badge-title-light'"
					>{{ highLightedBadge.title }}</span
				>
			</div>
			<div v-else class="d-flex justify-content-center align-items-center flex-column">
				<img
					class="empty-badge"
					:class="{ 'mb-3': !props.user.isLoggedUser, 'ml-3': !isDark, 'ml-2': isDark }"
					v-lazy="{ src: isDark ? '../assets/logo/logo.webp' : '../assets/logo/logo_dark.webp' }"
					alt="Nenhuma medalha em destaque"
					width="65"
					height="90"
				/>
			</div>
			<!-- Edit Profile Button -->
			<div v-if="props.user.isLoggedUser" class="mt-3 d-flex flex-column">
				<b-button
					class="edit-profile-btn px-2"
					:class="isDark ? 'edit-profile-btn-dark' : 'edit-profile-btn-light'"
					size="sm"
					@click="$bvModal.show('edit-profile-modal')"
				>
					Editar Perfil
				</b-button>
				<b-button
					class="edit-profile-btn px-2 mt-3 d-md-none d-block"
					:class="isDark ? 'edit-profile-btn-dark' : 'edit-profile-btn-light'"
					size="sm"
					@click="signOut"
				>
					Sign Out
				</b-button>
			</div>
		</div>
	</div>
	<EditProfileModal v-if="props.user.isLoggedUser" :user="props.user" id="edit-profile-modal" />
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #6ea952;
$quaternary-color: #e4f0e8;

.top-info {
	border-radius: 20px;
	min-height: 180px;
	max-width: 1400px;

	&-dark {
		background-color: $primary-color;
	}

	&-light {
		background-color: $quaternary-color;
	}
}

.profile-pic {
	max-width: 150px;
	max-height: 150px;

	&-dark {
		background-color: $tertiary-color;
	}

	&-light {
		background-color: $secondary-color;
	}
}

.user-name,
.user-info {
	font-family: "Panton", sans-serif;
	font-size: 1.7rem;
	font-weight: 700;

	&-dark {
		color: $secondary-color;
	}

	&-light {
		color: $primary-color;
	}
}

.user-info {
	font-size: 1rem;
	font-weight: 400;
}

.badge-title {
	font-family: "Panton", sans-serif;
	font-size: 0.9rem;
	font-weight: 700;

	&-dark {
		color: $secondary-color;
	}

	&-light {
		color: $primary-color;
	}
}

.badge-icon {
	width: 60px;
	height: 70px;
}

.empty-badge {
	width: 65px;
	height: 90px;
}

.edit-profile-btn {
	background: transparent;
	font-family: "Panton", sans-serif;
	font-size: 0.9rem;
	font-weight: 700;
	border-radius: 20px;

	&-dark {
		color: $secondary-color;
		border: 1px solid $secondary-color;

		&:hover {
			color: $quaternary-color;
			border: 1px solid $quaternary-color;
			background-color: transparent !important;
		}

		&:focus {
			color: $quaternary-color;
			border: 1px solid $quaternary-color;
			background-color: transparent !important;
		}
	}

	&-light {
		color: $primary-color;
		border: 1px solid $primary-color;

		&:hover {
			color: $tertiary-color;
			border: 1px solid $tertiary-color;
			background-color: transparent !important;
		}

		&:focus {
			color: $tertiary-color;
			border: 1px solid $tertiary-color;
			background-color: transparent !important;
		}
	}
}
</style>
