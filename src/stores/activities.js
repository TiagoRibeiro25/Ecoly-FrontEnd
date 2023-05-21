import api from "@/services/api";
import { defineStore } from "pinia";
import { useUsersStore } from "./users";

export const useActivitiesStore = defineStore("activities", () => {
	/** @param {string} input @returns {Promise<{success: boolean, data: []}>} */
	const search = async (input) => {
		try {
			const response = await api.get(`/activities?search=${input}`);
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	const getRecentActivities = async () => {
		try {
			const response = await api.get("/activities?fields=activities&filter=recent");
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	const deleteActivity = async (id) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.delete(`/activities/${id}`, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Ocorreu um erro ao apagar a atividade" };
		}
	};

	const getActiveThemes = async () => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.get("/activities?fields=themes", { headers });
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	return { search, deleteActivity, getRecentActivities, getActiveThemes };
});
