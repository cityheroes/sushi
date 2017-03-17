import Helper from '../Helper';

export default {

	pass: (value, mapper) => {
		return value;
	},

	translate: (value, mapper) => {
		let translations = mapper.translations || {};
		let result = typeof translations[value] !== 'undefined' ? translations[value] : value;
		return result;
	},

};