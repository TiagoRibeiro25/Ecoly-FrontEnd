<script setup>
import { validateEmail } from "../../utils/validators";
import { useUsersStore } from "../../stores/users";
import { ref } from "vue";

const props = defineProps({
	user: { type: Object, required: true },
});

const email = ref(props.user.email);
const password = ref("");
const confirmPassword = ref("");
const internalNumber = ref(props.user.internal_id || "");
const course = ref(props.user.course || "");
const year = ref(props.user.year || "");
const updating = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const validateForm = () => {
	if (!validateEmail(email.value)) {
		return { success: false, message: "Insira um email válido" };
	}

	if (password.value !== confirmPassword.value || password.value.length < 3) {
		return { success: false, message: "As passwords não coincidem" };
	}

	if (internalNumber.value) {
		if (!internalNumber.value.match(/^\S+$/)) {
			return { success: false, message: "Insira um número interno válido" };
		}

		if (course.value) {
			if (!course.value.trim().match(/[a-zA-Z]/)) {
				return { success: false, message: "Insira um curso válido" };
			}

			if (year.value) {
				const yearNumber = Number(year.value);
				if (isNaN(yearNumber)) {
					return { success: false, message: "Insira um ano válido" };
				}
			}
		}
	}

	return { success: true };
};

const updateUser = async () => {
	errorMsg.value = "";
	successMsg.value = "";

	const validation = validateForm();
	if (!validation.success) {
		errorMsg.value = validation.message;
		return;
	}

	updating.value = true;
	const newData = {
		password: password.value,
	};

	if (email.value.trim() !== props.user.email && email.value.trim() !== "") {
		newData.email = email.value;
	}
	if (internalNumber.value.trim() !== props.user.internal_id && internalNumber.value.trim() !== "") {
		newData.internalId = internalNumber.value;
	}
	if (course.value.trim() !== props.user.course && course.value.trim() !== "") {
		newData.course = course.value;
	}
	if (year.value.toString().trim() !== props.user.year.toString() && year.value.toString().trim() !== "") {
		newData.year = +year.value;
	}

	if (Object.keys(newData).length === 1) {
		errorMsg.value = "Não há nada para alterar";
		updating.value = false;
		return;
	}

	const response = await useUsersStore().updateUserData(newData);
	if (response.success) {
		successMsg.value = "Dados alterados com sucesso";
		// update the user object
		props.user.email = email.value;
		if (internalNumber.value.length > 0) props.user.internal_id = internalNumber.value;
		if (course.value.length > 0) props.user.course = course.value;
		if (year.value.length > 0) props.user.year = year.value;
	} else {
		errorMsg.value = response.message;
	}

	updating.value = false;
};
</script>

<template>
	<b-modal size="lg" hide-footer>
		<div class="container">
			<h4 class="modal-title text-center mt-1">Alterar dados da conta</h4>

			<form class="form mt-5 px-5" @submit.prevent="updateUser">
				<!-- Email -->
				<div class="form-group">
					<b-form-input type="email" class="form-input" v-model="email" placeholder="Email"></b-form-input>
				</div>

				<!-- Password -->
				<div class="form-group mt-5">
					<b-form-input
						class="form-input"
						type="password"
						v-model="password"
						placeholder="Password"
					></b-form-input>
				</div>

				<!-- Confirm Password -->
				<div class="form-group">
					<b-form-input
						class="form-input"
						type="password"
						v-model="confirmPassword"
						placeholder="Confirme Password"
					></b-form-input>
				</div>

				<!-- Internal Number -->
				<div class="form-group mt-5">
					<b-form-input
						class="form-input"
						type="text"
						placeholder="Número Interno do Aluno (opcional)"
						v-model="internalNumber"
						min="0"
					></b-form-input>
				</div>

				<!-- Course -->
				<div class="form-group">
					<b-form-input
						class="form-input"
						type="text"
						placeholder="Curso (opcional)"
						v-model="course"
					></b-form-input>
				</div>

				<!-- Course Year -->
				<div class="form-group mb-3">
					<b-form-input
						class="form-input"
						type="number"
						min="0"
						placeholder="Ano do Curso (opcional)"
						v-model="year"
					></b-form-input>
				</div>

				<div>
					<p class="text-center text-danger" v-if="errorMsg">{{ errorMsg }}</p>
					<p class="text-center text-success" v-if="successMsg">{{ successMsg }}</p>
				</div>

				<div v-if="updating" class="w-100 text-center mb-3">
					<b-spinner variant="success" label="Carregando..."></b-spinner>
				</div>

				<!-- Submit Button -->
				<div class="form-group" :class="updating ? 'mt-2' : 'mt-5'">
					<b-button
						type="submit"
						class="btn btn-block submit-btn"
						:disabled="updating || password.length === 0"
					>
						Alterar
					</b-button>
				</div>
			</form>
		</div>
	</b-modal>
</template>

<style lang="scss" scoped>
$primary-color: #343e3d;
$secondary-color: #ffffff;
$tertiary-color: #18516f;

.modal-title {
	font-family: "Panton", sans-serif;
	font-size: 1.5rem;
	font-weight: 600;
	color: #343e3d;
}

.submit-btn {
	font-family: "Panton", sans-serif;
	font-size: 1.2rem;
	font-weight: 600;
	color: $secondary-color;
	background-color: $primary-color;
	border: none;

	&:hover {
		background-color: $tertiary-color;
	}
}
</style>
