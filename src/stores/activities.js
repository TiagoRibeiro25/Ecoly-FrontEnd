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

	/** @returns {Promise<{success: boolean, data: []}>} */
	const getRecentActivities = async () => {
		try {
			const response = await api.get("/activities?fields=activities&filter=recent");
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	/** @returns {Promise<{success: boolean, isUserVerified?: boolean, data: []}>}*/
	const getAllUnfinishedActivities = async () => {
		const usersStore = useUsersStore();
		const headers = usersStore.token ? { Authorization: `Bearer ${usersStore.token}` } : {};

		try {
			const response = await api.get("/activities?fields=activities&filter=unfinished", { headers });
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	/** @param {string} schoolName @returns {Promise<{success: boolean, isUserVerified?: boolean, data: []}>} */
	const getUnfinishedActivitiesFromSchool = async (schoolName) => {
		const usersStore = useUsersStore();
		const headers = usersStore.token ? { Authorization: `Bearer ${usersStore.token}` } : {};

		try {
			const response = await api.get(`/activities?fields=activities&filter=unfinished&school=${schoolName}`, {
				headers,
			});
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	/**
	 * @param {number} year
	 * @returns {Promise<{success: boolean, data: []}>}
	 */
	const getFinishedActivitiesByYear = async (year) => {
		const usersStore = useUsersStore();
		const headers = usersStore.token ? { Authorization: `Bearer ${usersStore.token}` } : {};

		try {
			const response = await api.get("/activities?fields=activities&filter=finished&year=" + year, {
				headers,
			});
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	/**
	 * @param {number | string} id
	 * @returns {Promise<{data, success, canUserEdit: boolean}|{data: *[], success: boolean}>}
	 */
	const getActivity = async (id) => {
		const usersStore = useUsersStore();
		const headers = usersStore.token ? { Authorization: `Bearer ${usersStore.token}` } : {};

		try {
			const response = await api.get(`/activities/${id}`, { headers });
			return {
				success: response.data.success,
				canUserEdit: response.data.canUserEdit,
				data: response.data.data,
			};
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	/**
	 * @param {{theme_id: number, title:string, complexity: number, initial_date: string, final_date: string, objective: string, diagnostic: string, meta: string, meta: string, resources: string, participants: string, evaluation_indicator: string, evaluation_method: string, images: string[]}} activity
	 * @returns {Promise<{success: boolean, message: string}>}
	 */
	const addActivity = async (activity) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.post("/activities?fields=activity", activity, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Ocorreu um erro ao adicionar a atividade" };
		}
	};

	/** @param {number} id @returns {Promise<{success: boolean, message: string}>} */
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

	/** @param {{id: number, images: string[], report: string}} @returns {Promise<{success: boolean, message: string}>} */
	const finishActivity = async ({ id, images, report }) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.patch(`/activities/${id}?fields=activity`, { report, images }, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Ocorreu um erro ao finalizar a atividade" };
		}
	};

	/** @returns {Promise<{success: boolean, data: []}>} */
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

	/** @param {number} id @returns {Promise<{success: boolean, message: string}>} */
	const deleteTheme = async (id) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.patch(`/activities/${id}?fields=theme`, {}, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Ocorreu um erro ao apagar o tema" };
		}
	};

	/** @param {string} theme @returns {Promise<{success: boolean, message: string}>} */
	const addTheme = async (theme) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.post("/activities?fields=theme", { name: theme }, { headers });
			return response.data;
		} catch (err) {
			if (err.response.status === 409) return { success: false, message: "O tema já existe" };
			return { success: false, message: "Ocorreu um erro ao adicionar o tema" };
		}
	};

	/**
	 * @param {number} id
	 * @returns {Promise<{success: boolean, message: string}>}
	 */
	const getActivityReport = async (id) => {
		const usersStore = useUsersStore();
		const headers = usersStore.token ? { Authorization: `Bearer ${usersStore.token}` } : {};

		try {
			const response = await api.get(`/activities/${id}?fields=report`, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Ocorreu um erro ao obter o relatório da atividade" };
		}
	};

	return {
		search,
		addActivity,
		deleteActivity,
		finishActivity,
		getRecentActivities,
		getAllUnfinishedActivities,
		getUnfinishedActivitiesFromSchool,
		getFinishedActivitiesByYear,
		getActivity,
		getActiveThemes,
		deleteTheme,
		addTheme,
		getActivityReport,
	};
});
