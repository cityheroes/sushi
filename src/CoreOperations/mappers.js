import Helper from '../Helper';

export default {

	pass: (value, mapper) => {
		return value;
	},

	replace: (value, mapper) => {

		if (typeof value !== 'string') {
			return value;
		}

		let replacer = mapper.match || '';

		if (mapper.regex) {
			replacer = new RegExp(mapper.regex, 'i');
		}

		return value.replace(replacer, (mapper.replacement || ''));
	},

	substring: (value, mapper) => {

		if (typeof value !== 'string') {
			return value;
		}

		return value.substring(
			(mapper.start || 0),
			(mapper.end || undefined)
		);
	},

	translate: (value, mapper) => {
		let convertions = mapper.convertions || {};
		return typeof convertions[value] !== 'undefined' ? convertions[value] : value;
	},

	classify: (value, mapper) => {
		let convertions = mapper.convertions || {};
		let roundedValue = Math.round(value);
		return typeof convertions[roundedValue] !== 'undefined' ? convertions[roundedValue] : value;
	},

};