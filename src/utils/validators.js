/**
 * Function used to validate an email address.
 * @param email - The email address to validate.
 * @returns A boolean value.
 */
export function validateEmail(email) {
	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;

	return emailRegex.test(String(email).toLowerCase());
}
