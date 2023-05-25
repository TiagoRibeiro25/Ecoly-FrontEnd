import api from "@/services/api";
import { defineStore } from "pinia";
import { ref } from "vue";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/utils/localStorage";

export const useUsersStore = defineStore("users", () => {
	const isUserLoggedIn = ref(!!getLocalStorage("auth_key"));
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

	/** @param {number | number} id 
	 *  @returns {Promise<{success: boolean, message?: string, data?: object}>} */
	const getUserProfile = async (id) => {
		const headers = isUserLoggedIn.value ? { Authorization: `Bearer ${token.value}` } : {};
		try {
			const response = await api.get(`/users/${id}`, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro obtendo informação do utilizador" };
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

	/** @param {number} userId
	 *  @param {number} roleId
	 *  @returns {Promise<{success: boolean, message: string}>} */
	const changeUserRole = async (userId, roleId) => {
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.patch(`/users/${userId}/role`, { roleId }, { headers });
			return response.data;
		} catch (error) {
			return { success: false, message: "Erro ao atualizar o cargo" };
		}
	};

	/** @returns {Promise<{success: boolean, message?: string, data?: {id: number, title: string}[]}>}*/
	const getRoles = async () => {
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.get("/users/role", { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao obter roles" };
		}
	};

	/** @param {number} roleId
	 * 	@param {string} name
	 * 	@returns {Promise<{success: boolean, message?: string}>} */
	const editRole = async (roleId, name) => {
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.put(`/users/role/${roleId}`, { role: name }, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao editar cargo" };
		}
	};

	/** @param {string} role
	 * @returns {Promise<{success: boolean, message: string}>} */
	const addRole = async (role) => {
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.post("/users/role", { role }, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao adicionar novo cargo" };
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
			return { success: false, message: "Erro no login" };
		}
	};

	/**
	 * @param {{name: string, email: string, password: string, schoolId: number, internalId?: number, course?: string, year?: number}} data
	 * @returns {Promise<{success: boolean, message: string}>}
	 */
	const register = async (data) => {
		try {
			const response = await api.post("/users", data);
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro no registo" };
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
			return { success: false, message: "Erro ao atualizar o utilizador" };
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
			return { success: false, message: "Erro ao cancelar subscrição" };
		}
	};

	/** @param {string | null} email
	 *  @returns {Promise<{success: boolean, message: string}>} */
	const subscribeNewsLetter = async (email = null) => {
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.post("/subscribe", email ? { email } : {}, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao efetuar a subscrição" };
		}
	};

	const contact = async (to, content) => {
		const headers = { Authorization: `Bearer ${token.value}` };
		try {
			const response = await api.post("/users/contact", { to, content }, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao enviar mensagem" };
		}
	};

	return {
		isUserLoggedIn,
		token,
		getLoggedInUser,
		getUserProfile,
		getUsers,
		getUsersFromSchool,
		changeUserRole,
		getRoles,
		editRole,
		addRole,
		login,
		register,
		updateUserData,
		signOut,
		cancelNewsLetter,
		subscribeNewsLetter,
		contact
	};
});
