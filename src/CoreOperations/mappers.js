
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
		let conversions = mapper.conversions || mapper.convertions || {};
		return typeof conversions[value] !== 'undefined' ? conversions[value] : value;
	},

	classify: (value, mapper) => {
		let conversions = mapper.conversions || mapper.convertions || {};
		let roundedValue = Math.round(value);
		return typeof conversions[roundedValue] !== 'undefined' ? conversions[roundedValue] : value;
	}

};