import api from "@/services/api";
import { defineStore } from "pinia";

export const useSchoolsStore = defineStore("schools", () => {
	const getSchools = async () => {
		try {
			const response = await api.get("/schools");
			return response.data;
		} catch (err) {
			console.log(err);
			return { success: false, message: err.message };
		}
	};

	return { getSchools };
});
