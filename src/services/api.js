import axios from "axios";
import { useUsersStore } from "../stores/users";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_ROUTE,
	headers: { "Content-Type": "application/json" },
});

// Add a response interceptor - update token if it changes
api.interceptors.response.use(
	(response) => {
		const newToken = response.headers["x-access-token"] || response.headers["authorization"];
		if (newToken) {
			useUsersStore().token = newToken.replace("Bearer ", "");
		}

		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default api;
