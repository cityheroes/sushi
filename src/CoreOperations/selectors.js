import Helper from '../Helper';

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
			return Helper.get(item, path, selector.default);
		}).split(selector.separator || ' ');
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

};