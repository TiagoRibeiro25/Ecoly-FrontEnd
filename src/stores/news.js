import api from "@/services/api";
import { defineStore } from "pinia";
import { useUsersStore } from "./users";
import { ref } from "vue";

export const useNewsStore = defineStore("news", () => {
	const news = ref({});
	const filteredNews = ref({});
	const isUserSubscribed = ref(undefined);

	/** @param {string} input @returns {Promise<{success: boolean, data: []}>} */
	const search = async (input) => {
		try {
			if (Object.keys(news.value).length) {
				const newsCopy = { ...news.value };

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
			return {
				statusCode: response.status,
				...response.data,
			};
		} catch (err) {
			return {
				success: false,
				message: "Ocorreu um erro ao adicionar a notícia",
				statusCode: err.response?.status || 500,
			};
		}
	};

	/** @param {number} id @returns {Promise<{success: boolean, message: string}>} */
	const deleteNew = async (id) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.delete(`/news/${id}`, { headers });
			news.value = [];
			filteredNews.value = [];
			return response.data;
		} catch (err) {
			return { success: false, message: "Ocorreu um erro ao apagar a notícia" };
		}
	};

	/** @returns {Promise<{success: boolean, message: string}>} */
	const isSubscribed = async () => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		console.log(isUserSubscribed.value);

		try {
			if (isUserSubscribed.value !== undefined) {
				return {
					success: !!isUserSubscribed.value.isSubscribed,
					message: isUserSubscribed.value.isSubscribed ? "Subscrito" : "Não subscrito",
					deleteKey: isUserSubscribed.value.deleteKey,
				};
			}

			const response = await api.get("/subscribe", { headers });
			isUserSubscribed.value = { isSubscribed: response.data.success, deleteKey: response.data?.deleteKey };
			return response.data;
		} catch (err) {
			if (err.response?.status === 404) {
				isUserSubscribed.value = { isSubscribed: false, deleteKey: undefined };
				return { success: false, message: "Não subscrito" };
			}

			return { success: false, message: "Ocorreu um erro ao verificar a subscrição" };
		}
	};

	/**
	 * 	@param {string | null} email
	 *  @returns {Promise<{success: boolean, message: string}>}
	 */
	const subscribeNewsLetter = async (email = null) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };
		try {
			const response = await api.post("/subscribe", email ? { email } : {}, { headers });
			isUserSubscribed.value = undefined;
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao efetuar a subscrição" };
		}
	};

	/** @param {string} delete_key @returns  {Promise<{success: boolean, message: string}>} */
	const cancelNewsLetter = async (delete_key) => {
		try {
			const response = await api.delete(`/subscribe/${delete_key}`);
			isUserSubscribed.value = false;
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao cancelar subscrição" };
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
		subscribeNewsLetter,
		cancelNewsLetter,
	};
});
