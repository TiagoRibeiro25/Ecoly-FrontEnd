import api from "@/services/api";
import { defineStore } from "pinia";
import { useUsersStore } from "./users";

export const useMeetingsStore = defineStore("meetings", () => {
	/**
	 * @param {{date: string, description: string, room: string}} meeting
	 * @returns {Promise<{success: boolean, message: string}>}
	 */
	const createMeeting = async (meeting) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.post("/meetings", meeting, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao criar reunião" };
		}
	};

	/**
	 * @param {"past" | "future"} type
	 * @returns {Promise<{success: boolean, error?: string, data?: {hasAta?: boolean, id: number, creator: {id: number, name: string}, date: string, room: string description: string}[]}>}
	 */
	const getMeetings = async (type) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.get(`/meetings/?filter=${type}`, { headers });
			return response.data;
		} catch (err) {
			return { success: false, error: "Erro ao obter reuniões" };
		}
	};

	return { createMeeting, getMeetings };
});
