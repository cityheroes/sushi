import Helper from '../Helper';
import Tools from '../Tools';
import FormulaValues from 'formula-values';

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
		return selector.paths.map((path) => {
			return Helper.get(item, path, selector.default).split(selector.separator || ' ');
		});
	},

	format: (item, selector) => {
		return selector.paths.reduce(function(partialFormat, path, index) {
			return partialFormat.replace(
				'{' + index + '}',
				Helper.get(item, path, selector.default)
			);
		}, selector.format || '');
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
