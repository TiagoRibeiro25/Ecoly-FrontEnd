import api from "@/services/api";
import { defineStore } from "pinia";

export const useSchoolsStore = defineStore("schools", () => {
	const getSchools = async () => {
		try {
			const response = await api.get("/schools");
			return response.data;
		} catch (err) {
			return { success: false, message: "Erro ao obter escolas" };
		}
	};

	return { getSchools };
});
