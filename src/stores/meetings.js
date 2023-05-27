import api from "@/services/api";
import { defineStore } from "pinia";
import { useUsersStore } from "./users";

export const useMeetingsStore = defineStore("meetings", () => {
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


	return { createMeeting };
});
