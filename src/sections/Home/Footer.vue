<script setup>
import { useNewsStore } from "@/stores/news";
import { useUsersStore } from "@/stores/users";
import { validateEmail } from "@/utils/validators";
import { useDark } from "@vueuse/core";
import { ref } from "vue";

const isDark = useDark();
const usersStore = useUsersStore();
const isUserLoggedIn = usersStore.isUserLoggedIn;
const newsLetterEmail = ref("");
const btnMessage = ref("Subscrever");

const subscribe = async () => {
	try {
		if (!validateEmail(newsLetterEmail.value)) btnMessage.value = "Email inválido";
		else {
			const newsStore = useNewsStore();
			const response = await newsStore.subscribeNewsLetter(newsLetterEmail.value);
			btnMessage.value = response.success ? "Sucesso" : "Erro";
		}
	} catch (err) {
		btnMessage.value = "Erro";
	} finally {
		setTimeout(() => {
			btnMessage.value = "Subscrever";
		}, 2000);
	}
};
</script>

<template>
	<footer class="footer pt-5 pb-5 px-5" :class="isDark ? 'footer-dark' : 'footer-light'">
		<div class="row pb-5">
			<div class="col-lg-4 left-content">
				<img
					v-lazy="{ src: isDark ? '../assets/logo/logo_exp.webp' : '../assets/logo/logo_exp_dark.webp' }"
					alt="Ecoly"
					width="170"
					height="170"
					class="img-fluid mb-2"
				/>
				<h4 class="slogan mb-3 text-uppercase" :class="isDark ? 'slogan-dark' : 'slogan-light'">
					PLANTA O TEU FUTURO
				</h4>
				<router-link
					:to="{ name: 'News' }"
					class="route-link"
					:class="isDark ? 'route-link-dark' : 'route-link-light'"
				>
					notícias
				</router-link>
				<router-link
					:to="{ name: 'Activities' }"
					class="route-link"
					:class="isDark ? 'route-link-dark' : 'route-link-light'"
				>
					atividades
				</router-link>
				<h4 class="sub-title mt-4" :class="isDark ? 'sub-title-dark' : 'sub-title-light'">
					SUBSCREVER À NEWSLETTER
				</h4>
				<form class="input-group mb-3" @submit.prevent="subscribe">
					<input
						type="email"
						class="form-control"
						:class="isDark ? 'form-control-dark' : 'form-control-light'"
						placeholder="Email"
						aria-label="Email"
						aria-describedby="button-addon2"
						v-model="newsLetterEmail"
						required
					/>
					<button
						class="btn btn-outline-secondary"
						:class="{
							'btn-msg-success': btnMessage === 'Sucesso',
							'btn-msg-danger': btnMessage === 'Erro',
							'btn-msg-warning': btnMessage === 'Email inválido',
						}"
						type="submit"
						id="button-addon2"
					>
						{{ btnMessage }}
					</button>
				</form>
				<span class="cr-name" :class="isDark ? 'cr-name-dark' : 'cr-name-light'"> &copy; 2022 Ecoly </span>
			</div>
			<div class="col-lg-4 my-lg-0 my-5 pl-lg-5">
				<div class="mb-2">
					<img
						v-lazy="{
							src: isDark
								? '../assets/icons/socials/instagram_dark.svg'
								: '../assets/icons/socials/instagram_light.svg',
						}"
						alt="instagram"
						width="20"
						height="20"
					/>
					<img
						class="px-3"
						v-lazy="{
							src: isDark
								? '../assets/icons/socials/facebook_dark.svg'
								: '../assets/icons/socials/facebook_light.svg',
						}"
						alt="facebook"
						width="51"
						height="51"
					/>
					<img
						v-lazy="{
							src: isDark
								? '../assets/icons/socials/twitter_dark.svg'
								: '../assets/icons/socials/twitter_light.svg',
						}"
						alt="twitter"
						width="20"
						height="20"
					/>
				</div>

				<router-link
					:to="{ name: 'Activities' }"
					class="route-link"
					:class="isDark ? 'route-link-dark' : 'route-link-light'"
				>
					plano de atividades
				</router-link>
				<router-link
					v-if="isUserLoggedIn"
					:to="{ name: 'Manage' }"
					class="route-link"
					:class="isDark ? 'route-link-dark' : 'route-link-light'"
				>
					gestão do conselho
				</router-link>
				<router-link
					v-if="!isUserLoggedIn"
					:to="{ name: 'Authenticate' }"
					class="route-link"
					:class="isDark ? 'route-link-dark' : 'route-link-light'"
				>
					criar conta
				</router-link>
			</div>
			<div class="col-lg-4 right-content" :class="isDark ? 'right-content-dark' : 'right-content-light'">
				<h5>ENTRE EM CONTACTO</h5>
				<span class="mb-5">ECOLY@eco-escolas.com</span>

				<h5>PARA MAIS INFORMAÇÕES</h5>
				<span class="mb-1">fee.portugal@abae.pt</span>
				<span class="mb-5">abae@abae.pt</span>

				<h5>SOBRE NÓS</h5>
				<span style="line-height: 1.8">
					ECOLY tem como objetivo reunir pessoas interessadas em tornar o planeta um espaço verde de forma a
					sustentar o ecossistema que nos rodeia. Para o efeito, é disponibilizado ferramentas para os membros
					do conselho poderem gerir o conselho Eco-escolas e á criação de atividades para o plano de ação e
					poderá ter interação com outros utilizadores.
				</span>
			</div>
		</div>
	</footer>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #aedcc0;
$tertiary-color: #3fc380;
$quaternary-color: #f8f9fa;
$quinary-color: #e4f0e8;
$sixth-color: #18516f;

.footer {
	font-size: 14px;
	font-family: "Panton", sans-serif;
	font-weight: 400;

	background-repeat: no-repeat;
	background-position: center;
	background-size: 50%;
	min-height: 700px;

	&-dark {
		background-image: url("@/assets/images/footer-illustration-dark.webp");
		background-color: $primary-color;
		color: $secondary-color;
	}

	&-light {
		background-image: url("@/assets/images/footer-illustration-light.webp");
		background-color: $quinary-color;
		color: $primary-color;
	}
}

.slogan {
	font-size: 25px;
	font-family: "Panton", sans-serif;
	font-weight: 400;

	&-dark {
		color: $secondary-color;
	}

	&-light {
		color: $primary-color;
	}
}

.route-link {
	display: block;
	font-size: 15px;
	font-family: "Panton", sans-serif;
	font-weight: 400;
	margin-bottom: 10px;

	&-dark {
		color: $secondary-color;

		&:hover {
			color: $tertiary-color;
			text-decoration: none;
		}
	}

	&-light {
		color: $primary-color;

		&:hover {
			color: $sixth-color;
			text-decoration: none;
		}
	}
}

.sub-title {
	font-size: 20px;
	font-family: "Panton", sans-serif;
	font-weight: 400;
	margin-bottom: 10px;
	text-align: left;

	&-dark {
		color: $secondary-color;
	}

	&-light {
		color: $primary-color;
	}
}

.form-control {
	border: none;
	border-radius: 15px;
	color: $primary-color;
	font-size: 14px;
	font-family: "Panton", sans-serif;
	font-weight: 400;

	&:focus {
		box-shadow: none;
	}

	&-dark {
		background-color: $secondary-color;
	}

	&-light {
		background-color: $quaternary-color;
	}
}

.btn {
	border: none;
	border-radius: 0;
	border-top-right-radius: 15px;
	border-bottom-right-radius: 15px;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	background-color: $tertiary-color;
	color: #ffffff;
	font-size: 14px;
	font-family: "Panton", sans-serif;
	font-weight: 400;

	&:focus {
		box-shadow: none;
	}
	&:hover {
		background-color: #3fc380;
	}
}

.btn-msg-success {
	background-color: #3fc380;
}

.btn-msg-danger {
	background-color: #f54a4a;
	color: #333;

	&:hover {
		background-color: #f54a4a;
	}
}

.btn-msg-warning {
	background-color: #ff9f00;
	color: #333;

	&:hover {
		background-color: #ff9f00;
	}
}

.cr-name {
	font-size: 14px;
	font-family: "Panton", sans-serif;
	font-weight: 400;
	margin-left: 10px;

	&-dark {
		color: $secondary-color;
	}

	&-light {
		color: $primary-color;
	}
}

.right-content {
	& span {
		display: block;
		font-size: 14px;
		font-family: "Panton", sans-serif;
		font-weight: 400;
	}

	&-dark {
		& span {
			color: $quinary-color;
		}
	}

	&-light {
		& span {
			color: $primary-color;
		}
	}
}
</style>
