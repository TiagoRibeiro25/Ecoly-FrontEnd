import api from "@/services/api";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/utils/localStorage";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsersStore = defineStore("users", () => {
	const isUserLoggedIn = ref(getLocalStorage("auth_key") ? true : false);
	const token = ref(getLocalStorage("auth_key") || "");

	const getLoggedInUser = async () => {
		if (!token.value || !isUserLoggedIn) return { success: false, message: "No token" };
		try {
			const headers = { Authorization: `Bearer ${token.value}` };
			const response = await api.get("/users/me", { headers });
			return response.data;
		} catch (err) {
			console.log(err);
			return { success: false, message: "Error getting user" };
		}
	};

	const getUserProfile = async (id) => {
		try {
			// if the user is logged in, send the token in the header
			const headers = isUserLoggedIn.value ? { Authorization: `Bearer ${token.value}` } : {};
			const response = await api.get(`/users/${id}`, { headers });
			return response.data;
		} catch (err) {
			console.log(err.response);
			return err.response.data;
		}
	};

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
			return err.response.data;
		}
	};

	const register = async (data) => {
		try {
			const response = await api.post("/users", data);
			console.log(response.data);
			return response.data;
		} catch (err) {
			console.log(err.response);
			return err.response.data;
		}
	};

	const updateUserData = async (data) => {
		try {
			const headers = { Authorization: `Bearer ${token.value}` };
			const response = await api.patch("/users", data, { headers });
			return response.data;
		} catch (err) {
			console.log(err.response);
			return err.response.data;
		}
	};

	const signOut = () => {
		isUserLoggedIn.value = false;
		removeLocalStorage("auth_key");
		token.value = "";
	};

	return {
		isUserLoggedIn,
		token,
		getLoggedInUser,
		getUserProfile,
		login,
		register,
		updateUserData,
		signOut,
	};
});
