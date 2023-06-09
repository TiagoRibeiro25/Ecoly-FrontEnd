import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const url = import.meta.env.VITE_QUOTE_API_ROUTE;

export const useQuotesStore = defineStore("quotes", () => {
	const quote = ref({});

	/** @returns {Promise<{author: string, content: string}>} */
	const getRandomQuote = async () => {
		try {
			if (Object.keys(quote.value).length) return quote.value;

			const response = await axios.get(url);
			quote.value = response.data;
			return response.data;
		} catch (err) {
			console.log("There was an error fetching the quote. Using default quote instead.\n Error: ", err);
			return {
				author: "Yan Arthus Bertrand",
				content:
					"A ecologia deve estar inscrita no ADN de tudo o que fazemos diariamente e ainda não entrou nos costumes.",
			};
		}
	};

	return { getRandomQuote };
});
