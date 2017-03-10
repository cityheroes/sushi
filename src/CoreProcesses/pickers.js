export default {

	contains: (key, picker, helper) => {
		picker.matches = picker.matches || [];

		return picker.matches.reduce((previousValidation, match) => {
			return previousValidation || key.indexOf(match) !== -1;
		}, false);
	},

};