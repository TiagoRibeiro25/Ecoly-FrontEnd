import api from "@/services/api";
import { defineStore } from "pinia";
import { useUsersStore } from "./users";
import { ref } from "vue";

export const useSchoolsStore = defineStore("schools", () => {
	const schools = ref([]);

	const getSchools = async () => {
		try {
			if (schools.value.length) return { success: true, data: schools.value };

			const response = await api.get("/schools");
			schools.value = response.data.data;
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
			schools.value = [];
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
			const school = schools.value.find((school) => school.id === schoolId);
			school.name = newName;
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao editar escola" };
		}
	};

	return { getSchools, addSchool, editSchool };
});
