let castFunctions = {
	string: String,
	number: Number,
	boolean: Boolean
};

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
		let conversions = mapper.conversions || mapper.convertions || {},
			roundedValue = Math.round(value);
		return typeof conversions[roundedValue] !== 'undefined' ? conversions[roundedValue] : value;
	},

	stratify: (value, mapper) => {
		let conversions = mapper.conversions || mapper.convertions || {},
			partialValue = mapper.default || value;

		Object.keys(conversions).forEach((key) => {
			let bounds = key.split('-');

			if (
				bounds.length === 2 &&
				value >= Number(bounds[0]) &&
				value <= Number(bounds[1])
			) {
				partialValue = conversions[key];
			}
		});

		return partialValue;
	},

	cast: (value, mapper) => {
		let type = mapper.type || 'number';
		return castFunctions[type](value);
	}

};