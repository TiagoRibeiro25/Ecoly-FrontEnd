import api from "@/services/api";
import { defineStore } from "pinia";
import { ref } from "vue";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "../utils/localStorage";

export const useUsersStore = defineStore("users", () => {
	const isUserLoggedIn = ref(getLocalStorage("auth_key") ? true : false);
	const token = ref(getLocalStorage("auth_key") || "");

	/** @returns {Promise<{success: boolean, message?: string, data?: object}>} */
	const getLoggedInUser = async () => {
		if (!token.value || !isUserLoggedIn) return { success: false, message: "No token" };
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.get("/users/me", { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao obter utilizador autenticado" };
		}
	};

	/** @param {number} id @returns {Promise<{success: boolean, message?: string, data?: object}>} */
	const getUserProfile = async (id) => {
		const headers = isUserLoggedIn.value ? { Authorization: `Bearer ${token.value}` } : {};
		try {
			const response = await api.get(`/users/${id}`, { headers });
			return response.data;
		} catch (err) {
			return err.response ? err.response.data : { success: false, message: "Error getting user" };
		}
	};

	/** @returns {Promise<{success: boolean, message?: string, data?: {id: number, name: string, email: string, role: string, school: string}[]}>} */
	const getUsers = async () => {
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.get("/users", { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao obter utilizadores" };
		}
	};

	/** @returns {Promise<{success: boolean, message?: string, data?: {id: number, name: string, email: string, role: string, school: string}[]}>} */
	const getUsersFromSchool = async () => {
		if (!token.value || !isUserLoggedIn) return { success: false, message: "No token" };
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.get("/users?filter=school", { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao obter utilizadores" };
		}
	};

	/** @returns {Promise<{success: boolean, message?: string, data?: {id: number, title: string}[]}>}*/
	const getRoles = async () => {
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.get("/users/role", { headers });
			return response.data;
		} catch (err) {
			return err.response ? err.response.data : { success: false, message: "Erro ao obter roles" };
		}
	};

	/**
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<{success: boolean, message?: string, data?: {auth_key: string}}>}
	 */
	const login = async (email, password) => {
		try {
			const response = await api.post("/users/login", { email, password });
			if (response.data.success) {
				token.value = response.data.data.auth_key;
				setLocalStorage("auth_key", response.data.data.auth_key);
				isUserLoggedIn.value = true;
			}
			return response.data;
		} catch (err) {
			return err.response ? err.response.data : { success: false, message: "Erro no login" };
		}
	};

	/**
	 * @param {{name: string, email: string, password: string, schoolId: number, internalId?: number, course?: string, year?: number}} data
	 * @returns {Promise<{success: boolean, message: string}>
	 */
	const register = async (data) => {
		try {
			const response = await api.post("/users", data);
			return response.data;
		} catch (err) {
			return err.response ? err.response.data : { success: false, message: "Erro no registo" };
		}
	};

	/**
	 * @param {{ email?: string, password?: string, internal_id?: string, course?: string, year?: number, highlightBadgeId?: number }} data
	 * @returns {Promise<{success: boolean, message: string}>}
	 */
	const updateUserData = async (data) => {
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.patch("/users", data, { headers });
			return response.data;
		} catch (err) {
			return err.response ? err.response.data : { success: false, message: "Erro ao atualizar o utilizador" };
		}
	};

	/** @returns {void} */
	const signOut = () => {
		isUserLoggedIn.value = false;
		removeLocalStorage("auth_key");
		token.value = "";
	};

	/** @param {string} delete_key @returns  {Promise<{success: boolean, message: string}>} */
	const cancelNewsLetter = async (delete_key) => {
		try {
			const response = await api.delete(`/subscribe/${delete_key}`);
			return response.data;
		} catch (err) {
			return err.response ? err.response.data : { success: false, message: "Erro ao cancelar subscrição" };
		}
	};

	/** @param {string} email  @returns {Promise<{success: boolean, message: string}>} */
	const subscribeNewsLetter = async (email = null) => {
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.post("/subscribe", email ? { email } : {}, { headers });
			return response.data;
		} catch (err) {
			return err.response ? err.response.data : { success: false, message: "Erro ao efetuar a subscrição" };
		}
	};

	const contact = async (to, content) => {
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.post("/users/contact", { to, content }, { headers });
			return response.data;
		} catch (err) {
			return err.response ? err.response.data : { success: false, message: "Erro ao enviar mensagem" };
		}
	};

	return {
		isUserLoggedIn,
		token,
		getLoggedInUser,
		getUserProfile,
		getUsers,
		getUsersFromSchool,
		getRoles,
		login,
		register,
		updateUserData,
		signOut,
		cancelNewsLetter,
		subscribeNewsLetter,
		contact,
	};
});
