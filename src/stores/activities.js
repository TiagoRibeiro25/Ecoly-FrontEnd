import api from "@/services/api";
import { defineStore } from "pinia";

export const useActivitiesStore = defineStore("activities", () => {
	/** @param {string} input @returns {Promise<{success: boolean, data: []}>} */
	const search = async (input) => {
		try {
			const response = await api.get(`/activities?search=${input}`);
			return response.data;
		} catch (err) {
			console.log(err.response.data || "Error in search activities");
			return { success: false, data: [] };
		}
	};

	return { search };
});
