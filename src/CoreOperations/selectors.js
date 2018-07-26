import Helper from '../Helper';
import Tools from '../Tools';
import FormulaValues from 'formula-values';
import moment from 'moment';

let fvCache = {};

export default {

	extract: (item, selector) => {
		return Helper.get(item, selector.path, selector.default);
	},

	join: (item, selector) => {
		return selector.paths.map((path) => {
			return Helper.get(item, path, selector.default);
		}).join(selector.separator || ' ');
	},

	split: (item, selector) => {
		return Helper.get(item, selector.path, '').split(selector.separator || ' ');
	},

	format: (item, selector) => {
		return selector.paths.reduce(function(partialFormat, path, index) {
			return partialFormat.replace(
				'{' + index + '}',
				Helper.get(item, path, selector.default)
			);
		}, selector.format || '');
	},

	formatDate: (item, selector) => {
		return moment(Helper.get(item, selector.path, selector.default))
			.format(selector.format);
	},

	compare: (item, selector) => {
		let comparison = Helper.compare(
			Helper.get(item, selector.path),
			selector.match,
			selector.operator
		);
		return comparison ? selector.truth : selector.false;
	},

	operation: (item, selector) => {
		if (selector.path) {
			return Helper.calculate(
				[Helper.get(item, selector.path), selector.operand],
				selector.operator
			);
		} else if (selector.paths) {
			return Helper.calculate(
				Helper.extractMap(item, selector.paths),
				selector.operator
			);
		} else if (selector.keys) {
			return Helper.calculate(
				Helper.extractKeyValues(item, selector.keys),
				selector.operator
			);
		} else {
			return 0;
		}
	},

	average: (item, selector) => {
		if (selector.paths) {
			return Helper.average(Helper.extractMap(item, selector.paths));
		} else if (selector.keys) {
			return Helper.average(Helper.extractKeyValues(item, selector.keys));
		} else {
			return 0;
		}
	},

	existsInArray: (item, selector) => {

		let value = Helper.get(item, selector.path);

		if (!Tools.isArray(value)) {
			return value;
		}

		let matchValue = selector.matchValue || 1;
		let mismatchValue = selector.mismatchValue || 0;

		return value.indexOf(selector.match) !== -1 ? matchValue : mismatchValue;
	},

	pluck: (item, selector) => {

		let value = Helper.get(item, selector.path);

		if (!Tools.isArray(value) || !selector.property) {
			return value;
		}

		return value.map((subItem) => {
			return Helper.get(subItem, selector.property, (selector.default || subItem));
		});
	},

	count: (item, selector) => {

		let value = Helper.get(item, selector.path);

		if (!Tools.isArray(value)) {
			return value;
		}

		if (selector.match) {
			return value.filter((subItem) => {
				return Helper.compare(
					subItem,
					selector.match,
					selector.operator
				);
			}).length;
		} else {
			return value.length;
		}
	},

	merge: (item, selector) => {
		let result = [],
			value;
		selector.paths.forEach((path) => {
			value = Helper.get(item, path);
			if (Tools.isArray(value)) {
				result = result.concat(value);
			}
		});
		return result;
	},

	zip: (item, selector) => {
		let result = [],
			value,
			i,
			size;

		selector.paths.forEach((path) => {
			value = Helper.get(item, path);
			if (Tools.isArray(value)) {
				size = value.length;
				for (i = 0; i < size; i++) {
					if (!result[i]) {
						result[i] = [];
					}
					result[i].push(value[i]);
				}
			}
		});
		return result;
	},

	itemAt: (item, selector) => {

		let value = Helper.get(item, selector.path);

		if (!Tools.isArray(value)) {
			return selector.default;
		}

		let index = 'undefined' !== typeof selector.index ? selector.index : 0,
			size = value.length;

		if (size === 0) {
			return selector.default;
		}

		while (index < 0) {
			index = size + index;
		}

		return 'undefined' !== typeof value[index] ? value[index] : selector.default;
	},

	groupBy: (item, selector) => {

		let value = Helper.get(item, selector.path),
			defaultValue = selector.default;

		if (!Tools.isArray(value)) {
			return defaultValue;
		}

		if (!selector.group) {
			console.warn('A \'group\' parameter must be provided for the groupBy operation.');
			return defaultValue;
		}

		let groupMap = {},
			groupValue,
			group = selector.group,
			size = value.length - 1;

		for (var i = size; i >= 0; i--) {
			groupValue = Helper.get(value[i], group);
			groupValue = 'undefined' !== typeof groupValue ? groupValue : defaultValue;
			groupMap[groupValue] = groupMap[groupValue] || [];
			groupMap[groupValue].push(item);
		}

		return groupMap;
	},

	objKeys: (item, selector) => {
		let value = Helper.get(item, selector.path);

		if (!Tools.isObject) {
			return value;
		}

		return Object.keys(value);
	},

	objValues: (item, selector) => {
		let value = Helper.get(item, selector.path);

		if (!Tools.isObject) {
			return value;
		}

		return Object.values(value);
	},

	objEntries: (item, selector) => {
		let value = Helper.get(item, selector.path);

		if (!Tools.isObject) {
			return value;
		}

		return Object.entries(value);
	},

	formula: (item, selector) => {
		if (!selector.expr) {
			console.warn('Invalid FormulaValue expression (\'expr\').');
			return item;
		}

		if (!fvCache[selector.expr]) {
			fvCache[selector.expr] = new FormulaValues(selector.expr);
		}

		let fv = fvCache[selector.expr];
		return fv.eval(item);
	}

};
