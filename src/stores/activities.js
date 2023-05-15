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

	const deleteActivity = async (id) => {
		const token = useUsersStore().token;

		try {
			const response = await api.delete(`/activities/${id}`).set("Authorization", `Bearer ${token}`);
			return response.data;
		} catch (err) {
			return { success: false, message: "Ocorreu um erro ao apagar a atividade" };
		}
	};

	return { search, deleteActivity };
});
