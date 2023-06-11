<script setup>
import { useDark } from "@vueuse/core";
import { useUsersStore } from "../../stores/users";
import { useSchoolsStore } from "../../stores/schools";
import { validateEmail } from "../../utils/validators";
import { useRouter } from "vue-router";
import { onBeforeMount, ref } from "vue";

const isDark = useDark();
const router = useRouter();

const showLogIn = ref(true);
const toggleLogIn = (form) => {
	if (form === "login") loginQuitLogin.value = true;
	else registerQuitRegister.value = true;

	setTimeout(() => {
		showLogIn.value = !showLogIn.value;
		registerQuitRegister.value = !registerQuitRegister.value;

		loginQuitLogin.value = false;
		loginEmail.value = "";
		loginPassword.value = "";
		loginErrorMsg.value = "";

		registerUserName.value = "";
		registerEmail.value = "";
		registerPassword.value = "";
		registerSchool.value = 1;
		registerInternalNumber.value = "";
		registerCourse.value = "";
		registerYear.value = "";
		registerErrorMsg.value = "";
	}, 300);
};

// Login Variables
const loginEmail = ref("");
const loginPassword = ref("");
const logging = ref(false);
const loginQuitLogin = ref(false);
const loginErrorMsg = ref("");

const login = async () => {
	logging.value = true;
	loginErrorMsg.value = "";

	const usersStore = useUsersStore();
	const response = await usersStore.login(loginEmail.value, loginPassword.value);

	if (response.success) return router.go();

	if (response.message === "User not found.") {
		loginErrorMsg.value = "Email não encontrado.";
	}
	if (response.message === "Invalid password.") {
		loginErrorMsg.value = "Password incorreta.";
	} else {
		loginErrorMsg.value = "Ocorreu um erro ao fazer login.";
	}

	logging.value = false;
};

// Register Variables
const schools = ref([{ value: 1, text: "ESMAD" }]);

const registerUserName = ref("");
const registerEmail = ref("");
const registerPassword = ref("");
const registerSchool = ref(1);
const registerInternalNumber = ref("");
const registerCourse = ref("");
const registerYear = ref("");
const registerErrorMsg = ref("");
const registerSuccessMsg = ref("");
const registering = ref(false);
const registerQuitRegister = ref(false);

const validateForm = () => {
	// name
	const name = registerUserName.value.trim();
	if (name.split(" ").length < 2) {
		return { success: false, message: "Insira um nome válido (primeiro e último nome)" };
	}

	// email
	if (!validateEmail(registerEmail.value)) {
		return { success: false, message: "Insira um email válido" };
	}

	// password
	if (registerPassword.value.trim().length < 3) {
		return { success: false, message: "Insira uma password válida" };
	}

	// school
	if (!registerSchool.value) {
		return { success: false, message: "Selecione uma escola" };
	}

	// internal number
	if (registerInternalNumber.value) {
		if (!RegExp(/^\S+$/).exec(registerInternalNumber.value)) {
			return { success: false, message: "Insira um número interno válido" };
		}

		if (registerCourse.value) {
			if (!RegExp(/[a-zA-Z]/).exec(registerCourse.value.trim())) {
				return { success: false, message: "Insira um curso válido" };
			}

			if (registerYear.value) {
				const yearNumber = Number(registerYear.value);
				if (isNaN(yearNumber)) {
					return { success: false, message: "Insira um ano válido" };
				}
			}
		}
	}

	return { success: true };
};

const register = async () => {
	registerErrorMsg.value = "";
	registerSuccessMsg.value = "";
	const validation = validateForm();
	if (!validation.success) {
		registerErrorMsg.value = validation.message;
		return;
	}

	registering.value = true;
	const usersStore = useUsersStore();
	const response = await usersStore.register({
		name: registerUserName.value,
		email: registerEmail.value,
		password: registerPassword.value,
		schoolId: +registerSchool.value,
		internalId: registerInternalNumber.value,
		course: registerCourse.value,
		year: +registerYear.value,
	});

	if (response.success) {
		registerSuccessMsg.value = "Conta criada com sucesso.";
	} else {
		if (response.message === "There's already an account with that email.") {
			registerErrorMsg.value = "Email já existe.";
		} else if (response.message === "School not found.") {
			registerErrorMsg.value = "Escola não encontrada.";
		} else {
			registerErrorMsg.value = "Ocorreu um erro ao criar a conta.";
		}
	}

	registering.value = false;
};

onBeforeMount(async () => {
	const schoolsStore = useSchoolsStore();
	const response = await schoolsStore.getSchools();
	if (response.success) {
		schools.value = response.data.map((school) => {
			return { value: school.id, text: school.name };
		});
	}
});
</script>

<template>
	<div class="row mx-0">
		<div class="column col-6 d-none d-xl-inline-block">
			<img v-if="!isDark" src="@/assets/images/auth_illustration-light-theme.webp" alt="Autenticação" />
			<img v-else src="@/assets/images/auth_illustration-dark-theme.webp" alt="Autenticação" />
		</div>
		<div class="column col-xl-6 col-12 d-flex flex-column justify-content-center align-items-center">
			<!-- Log In Form -->
			<b-form
				v-if="showLogIn"
				class="form p-sm-4"
				:class="{ 'quit-login': loginQuitLogin }"
				@submit.prevent="login"
			>
				<h1 class="mb-3 text-center" :class="!isDark ? 'title-light' : 'title-dark'">Log In</h1>

				<div class="form-group">
					<b-form-input
						type="email"
						class="form-input"
						:class="!isDark ? 'input-light' : 'input-dark'"
						v-model="loginEmail"
						:state="loginEmail.length > 0 ? validateEmail(loginEmail) : null"
						placeholder="Email"
					></b-form-input>
					<b-form-invalid-feedback> Email inválido </b-form-invalid-feedback>
				</div>
				<div class="form-group">
					<b-form-input
						type="password"
						class="form-input"
						:class="!isDark ? 'input-light' : 'input-dark'"
						v-model="loginPassword"
						placeholder="Password"
					></b-form-input>
				</div>
				<div class="form-group text-center">
					<span
						class="change-form"
						:class="!isDark ? 'title-light' : 'title-dark'"
						@click="!logging && toggleLogIn('login')"
						>Não és membro? Crie uma conta aqui</span
					>
				</div>
				<div class="text-center mx-auto mb-3">
					<span class="error-msg">{{ loginErrorMsg }}</span>
				</div>
				<div v-if="logging" class="text-center my-3">
					<b-spinner variant="success" label="Carregando..."></b-spinner>
				</div>
				<div class="form-group text-center">
					<b-button
						type="submit"
						class="submit-btn"
						:class="!isDark ? 'btn-light' : 'btn-dark'"
						:disabled="!validateEmail(loginEmail) || loginPassword.length === 0 || logging"
					>
						Entrar
					</b-button>
				</div>
			</b-form>
			<!-- Register Form -->
			<b-form
				v-else
				class="form p-sm-4"
				:class="{ 'quit-register': RegisterQuitRegister }"
				@submit.prevent="register"
			>
				<h1 class="mb-3 text-center" :class="!isDark ? 'title-light' : 'title-dark'">
					Crie a sua conta e torne-se num membro
				</h1>
				<!-- Name -->
				<div class="form-group">
					<b-form-input
						class="form-input"
						:class="!isDark ? 'input-light' : 'input-dark'"
						type="text"
						placeholder="Nome"
						v-model="registerUserName"
					></b-form-input>
				</div>
				<!-- Email -->
				<div class="form-group">
					<b-form-input
						type="email"
						class="form-input"
						:class="!isDark ? 'input-light' : 'input-dark'"
						v-model="registerEmail"
						placeholder="Email"
					></b-form-input>
				</div>
				<!-- Password -->
				<div class="form-group">
					<b-form-input
						class="form-input"
						:class="!isDark ? 'input-light' : 'input-dark'"
						type="password"
						v-model="registerPassword"
						placeholder="Password"
					></b-form-input>
				</div>
				<!-- School -->
				<div class="form-group">
					<b-form-select
						class="form-input"
						:class="!isDark ? 'input-light' : 'input-dark'"
						v-model="registerSchool"
						:options="schools"
					></b-form-select>
				</div>
				<!-- Internal Id -->
				<div class="form-group">
					<b-form-input
						class="form-input"
						:class="!isDark ? 'input-light' : 'input-dark'"
						type="number"
						placeholder="Número Interno do Aluno (opcional)"
						v-model="registerInternalNumber"
						min="0"
					></b-form-input>
				</div>
				<!-- Course -->
				<div class="form-group">
					<b-form-input
						class="form-input"
						:class="!isDark ? 'input-light' : 'input-dark'"
						type="text"
						placeholder="Curso (opcional)"
						v-model="registerCourse"
					></b-form-input>
				</div>
				<!-- Course Year -->
				<div class="form-group">
					<b-form-input
						class="form-input"
						:class="!isDark ? 'input-light' : 'input-dark'"
						type="number"
						min="0"
						placeholder="Ano do Curso (opcional)"
						v-model="registerYear"
					></b-form-input>
				</div>
				<!-- Switch to LogIn View -->
				<div class="form-group text-center">
					<span
						class="change-form"
						:class="!isDark ? 'title-light' : 'title-dark'"
						@click="!registering && toggleLogIn('register')"
					>
						Já tens conta? Entre aqui!
					</span>
				</div>
				<!-- Success Message -->
				<div class="text-center mx-auto mb-3">
					<span class="success-msg">{{ registerSuccessMsg }}</span>
				</div>
				<!-- Error Message -->
				<div class="text-center mx-auto mb-3">
					<span class="error-msg">{{ registerErrorMsg }}</span>
				</div>
				<!-- Loading Icon -->
				<div v-if="registering" class="text-center my-3">
					<b-spinner variant="success" label="Carregando..."></b-spinner>
				</div>
				<!-- Create Account Button -->
				<div class="form-group text-center">
					<b-button type="submit" class="submit-btn" :class="!isDark ? 'btn-light' : 'btn-dark'">
						Criar Conta
					</b-button>
				</div>
			</b-form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #e4f0e8;
$tertiary-color: #ffffff;
$fourth-color: #18516f;
$fifth-color: #aedcc0;
.column {
	min-height: 100vh;
	min-height: 100dvh;
	overflow-x: hidden;
}

.column + .column {
	overflow-y: scroll;
}

.column:first-child {
	& img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		margin-left: -15px;
	}
}

.form {
	width: 75%;
	animation: slide-from-right 0.5s ease-in-out forwards;
}

h1 {
	font-family: "Panton", sans-serif;
	font-weight: 500;
	font-size: 2.2rem;
}

.form-input {
	border: 2px solid $fifth-color;
	border-radius: 10px;
}

.change-form {
	font-family: "Panton", sans-serif;
	font-weight: 500;
	font-size: 1rem;
	color: $primary-color;
	cursor: pointer;

	&:hover {
		text-decoration: underline;
	}
}

.submit-btn {
	border: none;
	border-radius: 10px;
	font-family: "Panton", sans-serif;
	font-weight: 500;
	font-size: 1.2rem;
	padding: 0.2rem 5rem;
	transition: all 0.3s ease-in-out;
}

.title-light {
	color: $primary-color;
}

.title-dark {
	color: $secondary-color;
}

.input-light {
	border-color: $fifth-color;
	color: $primary-color;
	background-color: $tertiary-color;

	&:focus {
		background-color: $tertiary-color;
		border-color: $fifth-color;
	}
}

.input-dark {
	border-color: $fifth-color;
	color: $tertiary-color;
	background-color: $primary-color;

	&:focus {
		background-color: $primary-color;
		border-color: $fifth-color;
		color: $secondary-color;
	}
}

.btn-light {
	background-color: $primary-color;
	color: $tertiary-color;

	&:hover {
		background-color: $fourth-color;
		color: $tertiary-color;
	}
}

.btn-dark {
	background-color: $fifth-color;
	color: $primary-color;

	&:hover {
		background-color: $fourth-color;
		color: $tertiary-color;
	}
}

.error-msg,
.success-msg {
	font-family: "Panton", sans-serif;
	font-weight: 500;
	font-size: 1rem;
	color: rgb(175, 1, 1);
}

.success-msg {
	color: rgb(0, 128, 0);
}

.quit-login,
.quit-register {
	animation: slide-left 0.5s ease-in-out forwards;
}

@keyframes slide-left {
	0% {
		transform: translateX(0);
		opacity: 1;
	}
	100% {
		transform: translateX(-100%);
		opacity: 0;
	}
}

@keyframes slide-from-right {
	0% {
		transform: translateX(100%);
		opacity: 0;
	}

	100% {
		transform: translateX(0);
		opacity: 1;
	}
}

@media (max-width: 768px) {
	.form {
		width: 100%;
	}
}
</style>
