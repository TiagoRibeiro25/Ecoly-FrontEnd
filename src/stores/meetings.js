import api from "@/services/api";
import { defineStore } from "pinia";
import { useUsersStore } from "./users";
import { ref } from "vue";

export const useMeetingsStore = defineStore("meetings", () => {
	const pastMeetings = ref([]);
	const futureMeetings = ref([]);

	/**
	 * @param {{date: string, description: string, room: string}} meeting
	 * @returns {Promise<{success: boolean, message: string}>}
	 */
	const createMeeting = async (meeting) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.post("/meetings", meeting, { headers });
			resetData();
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao criar reunião" };
		}
	};

	/**
	 * @param {"past" | "future"} type
	 * @returns {Promise<{success: boolean, message?: string, data?: {hasAta?: boolean, id: number, creator: {id: number, name: string}, date: string, room: string description: string}[]}>}
	 */
	const getMeetings = async (type) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		if (type === "past" && pastMeetings.value.length > 0) {
			return { success: true, data: pastMeetings.value };
		}
		if (type === "future" && futureMeetings.value.length > 0) {
			return { success: true, data: futureMeetings.value };
		}

		try {
			const response = await api.get(`/meetings/?filter=${type}`, { headers });

			if (type === "past") pastMeetings.value = response.data.data;
			else futureMeetings.value = response.data.data;

			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao obter reuniões" };
		}
	};

	/**
	 * @param {number} id
	 * @returns {Promise<{success: boolean, message?: string, data?: {ata: string, date: string, images: string[]}}>}
	 */
	const getMeetingAta = async (id) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.get(`/meetings/${id}?fields=ata`, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao obter ata da reunião" };
		}
	};

	/**
	 * @param {{id: number, ata: string, images: string[]}}
	 * @returns {Promise<{success: boolean, message: string}}>}
	 */
	const addMeetingAta = async ({ id, ata, images }) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.patch(`/meetings/${id}?fields=ata`, { ata, images }, { headers });
			resetData();
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao adicionar ata à reunião" };
		}
	};

	const resetData = () => {
		pastMeetings.value = [];
		futureMeetings.value = [];
	};

	return { createMeeting, getMeetings, getMeetingAta, addMeetingAta, resetData };
});
