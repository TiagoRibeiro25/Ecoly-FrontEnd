import api from "@/services/api";
import { defineStore } from "pinia";
import { useUsersStore } from "./users";

export const useNewsStore = defineStore("news", () => {
	//TODO: fix the backend to return the correct data
	/** @param {string} input @returns {Promise<{success: boolean, data: []}>} */
	const search = async (input) => {
		try {
			const response = await api.get(`/news?search=${input}`);
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	const getNews = async () => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.get("/news", { headers });
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	const getNew = async (id) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.get(`/news/${id}`, { headers });
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	const deleteNew = async (id) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.delete(`/news/${id}`, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Ocorreu um erro ao apagar a notícia" };
		}
	};

	const isSubscribed = async () => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.get("/subscribe", { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Ocorreu um erro ao verificar a subscrição" };
		}
	};

	return { search, getNews, getNew, deleteNew, isSubscribed };
});
