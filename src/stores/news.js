import api from "@/services/api";
import { defineStore } from "pinia";

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
		try {
			const response = await api.get("/news");
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	return { search, getNews };
});
