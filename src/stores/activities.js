import api from "@/services/api";
import { defineStore } from "pinia";
import { useUsersStore } from "./users";
import { ref } from "vue";

export const useActivitiesStore = defineStore("activities", () => {
	const themes = ref([]);
	const recentActivities = ref([]);
	const unfinishedActivities = ref({});

	/** @param {string} input @returns {Promise<{success: boolean, data: []}>} */
	const search = async (input) => {
		try {
			if (Object.keys(unfinishedActivities.value).length) {
				const activitiesCopy = JSON.parse(JSON.stringify(unfinishedActivities.value));

				const filtered = activitiesCopy;
				filtered.data = activitiesCopy.data.filter((n) =>
					n.title.toLowerCase().includes(input.toLowerCase())
				);

				return { success: true, data: filtered.data };
			}

			const response = await api.get(`/activities?search=${input}`);
			return response.data;
		} catch (err) {
			return { success: false, data: [] };
		}
	};

	/** @returns {Promise<{success: boolean, data: []}>} */
	const getRecentActivities = async () => {
		try {
			if (recentActivities.value.length) return { success: true, data: recentActivities.value };
			const response = await api.get("/activities?fields=activities&filter=recent");
			recentActivities.value = response.data.data;
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
			if (Object.keys(unfinishedActivities.value).length) {
				return {
					success: true,
					isUserVerified: unfinishedActivities.value.isUserVerified,
					data: unfinishedActivities.value.data,
				};
			}

			const response = await api.get("/activities?fields=activities&filter=unfinished", { headers });
			unfinishedActivities.value = response.data;
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
			recentActivities.value = [];
			unfinishedActivities.value = {};
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
			recentActivities.value = recentActivities.value.filter((activity) => activity.id !== id);
			unfinishedActivities.value.data = unfinishedActivities.value.data.filter(
				(activity) => activity.id !== id
			);
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
			recentActivities.value = recentActivities.value.filter((activity) => activity.id !== id);
			unfinishedActivities.value.data = unfinishedActivities.value.data.filter(
				(activity) => activity.id !== id
			);
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
			if (themes.value.length) return { success: true, data: themes.value };

			const response = await api.get("/activities?fields=themes", { headers });
			themes.value = response.data.data;
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
			themes.value = themes.value.filter((theme) => theme.id !== id);
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
			themes.value = [];
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
