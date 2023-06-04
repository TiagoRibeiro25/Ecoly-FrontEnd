import api from "@/services/api";
import { defineStore } from "pinia";
import { useUsersStore } from "./users";
import { ref } from "vue";

export const useNewsStore = defineStore("news", () => {
	const news = ref({});
	const filteredNews = ref({});

	/** @param {string} input @returns {Promise<{success: boolean, data: []}>} */
	const search = async (input) => {
		try {
			if (Object.keys(news.value).length) {
				const newsCopy = JSON.parse(JSON.stringify(news.value));

				const filtered = newsCopy;
				filtered.news = newsCopy.news.filter((n) => n.title.toLowerCase().includes(input.toLowerCase()));
				return { success: true, data: filtered };
			}

			const response = await api.get(`/news?search=${input}`);
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	/** @returns {Promise<{success: boolean, data: []}>} */
	const getNews = async (filter = "") => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			if ((filter === "all" || filter === "" || !filter) && Object.keys(news.value).length) {
				return { success: true, data: news.value };
			}

			if (filter === "recent" && Object.keys(filteredNews.value).length) {
				return { success: true, data: filteredNews.value };
			}

			const response = await api.get(`/news?filter=${filter}`, { headers });

			if (filter === "all" || filter === "" || !filter) {
				news.value = response.data.data;
				return { success: true, data: news.value };
			} else {
				filteredNews.value = response.data.data;
				return { success: true, data: filteredNews.value };
			}
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
			news.value = [];
			filteredNews.value = [];
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
			news.value.news = news.value.news.filter((n) => n.id !== id);
			filteredNews.value.news = filteredNews.value.news.filter((n) => n.id !== id);
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

	return {
		news,
		filteredNews,
		search,
		getNews,
		getNew,
		addNew,
		deleteNew,
		isSubscribed,
	};
});
