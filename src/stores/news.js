import api from "@/services/api";
import { defineStore } from "pinia";
import { useUsersStore } from "./users";

export const useNewsStore = defineStore("news", () => {
	/** @param {string} input @returns {Promise<{success: boolean, data: []}>} */
	const search = async (input) => {
		try {
			const response = await api.get(`/news?search=${input}`);
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	/** @returns {Promise<{success: boolean, data: []}>} */
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

	/** @param {number} id @returns {Promise<{success: boolean, data: []}>} */
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

	/** @param {{title: string, content: string, imgs: string[] }} data @returns {Promise<{success: boolean, message: string, statusCode: number}>} */
	const addNew = async (data) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.post("/news", data, { headers });
			return { statusCode: 200, ...response.data };
		} catch (err) {
			return {
				success: false,
				message: "Ocorreu um erro ao adicionar a notícia",
				statusCode: err.response.status,
			};
		}
	};

	/** @param {number} id @returns {Promise<{success: boolean, message: string}>} */
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

	/** @returns {Promise<{success: boolean, message: string}>} */
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

	return { search, getNews, getNew, addNew, deleteNew, isSubscribed };
});
