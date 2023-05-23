import api from "@/services/api";
import { defineStore } from "pinia";
import { useUsersStore } from "./users";

export const useSchoolsStore = defineStore("schools", () => {
	const getSchools = async () => {
		try {
			const response = await api.get("/schools");
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao obter escolas" };
		}
	};

	const addSchool = async (school) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.post("/schools", { name: school }, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao adicionar escola" };
		}
	};

	const editSchool = async (schoolId, newName) => {
		const usersStore = useUsersStore();
		const headers = { Authorization: `Bearer ${usersStore.token}` };

		try {
			const response = await api.put(`/schools/${schoolId}`, { name: newName }, { headers });
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao editar escola" };
		}
	};

	return { getSchools, addSchool, editSchool };
});
